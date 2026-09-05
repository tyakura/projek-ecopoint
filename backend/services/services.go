package services

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"errors"
	"math"
	"time"

	"ecopoint/backend/models"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func NewID() string {
	b := make([]byte, 16)
	if _, err := rand.Read(b); err != nil {
		return time.Now().Format("20060102150405")
	}
	return hex.EncodeToString(b)
}

func HashPassword(pw string) (string, error) {
	b, err := bcrypt.GenerateFromPassword([]byte(pw), bcrypt.DefaultCost)
	return string(b), err
}

func CheckPassword(hash, pw string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(pw)) == nil
}

var ErrInvalidToken = errors.New("invalid token")

func GenerateToken(userID string, secret string) (string, error) {
	claims := jwt.MapClaims{
		"sub": userID,
		"iat": time.Now().Unix(),
		"exp": time.Now().Add(72 * time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

func ParseToken(tokenStr string, secret string) (string, error) {
	token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, ErrInvalidToken
		}
		return []byte(secret), nil
	})
	if err != nil || !token.Valid {
		return "", ErrInvalidToken
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", ErrInvalidToken
	}
	sub, ok := claims["sub"].(string)
	if !ok {
		return "", ErrInvalidToken
	}
	return sub, nil
}

// CalcPoints menentukan poin yang didapat dari sebuah collection.
// 100 poin per KG + 25 poin per item.
func CalcPoints(amount float64, items int) int {
	return int(math.Round(amount*100)) + items*25
}

// LevelForXP mengembalikan level tertinggi yang memenuhi ambang XP user.
func LevelForXP(db *sql.DB, xp int) (models.Level, error) {
	rows, err := db.Query(`SELECT id, level_number, title, xp_required, badge_icon FROM levels ORDER BY xp_required ASC`)
	if err != nil {
		return models.Level{}, err
	}
	defer rows.Close()
	var current models.Level
	for rows.Next() {
		var l models.Level
		if err := rows.Scan(&l.ID, &l.LevelNumber, &l.Title, &l.XPRequired, &l.BadgeIcon); err != nil {
			return models.Level{}, err
		}
		if xp >= l.XPRequired {
			current = l
		}
	}
	if current.LevelNumber == 0 {
		current = models.Level{LevelNumber: 1, Title: "Eco Starter", XPRequired: 0, BadgeIcon: "🌱"}
	}
	return current, nil
}

// VerifyAchievements membuka achievement yang baru terpenuhi dari total user.
func CheckAchievements(db *sql.DB, userID string) {
	var xp, items int
	var waste float64
	_ = db.QueryRow(`SELECT xp, total_waste, total_items FROM users WHERE id = ?`, userID).Scan(&xp, &waste, &items)

	rows, err := db.Query(`SELECT id, name, description, icon, condition_type, condition_value FROM achievements`)
	if err != nil {
		return
	}
	var list []models.Achievement
	for rows.Next() {
		var a models.Achievement
		if err := rows.Scan(&a.ID, &a.Name, &a.Description, &a.Icon, &a.ConditionType, &a.ConditionValue); err != nil {
			continue
		}
		list = append(list, a)
	}
	rows.Close()
	for _, a := range list {
		satisfied := false
		switch a.ConditionType {
		case "total_items":
			satisfied = items >= a.ConditionValue
		case "total_waste":
			satisfied = waste >= float64(a.ConditionValue)
		}
		if !satisfied {
			continue
		}
		var c int
		_ = db.QueryRow(`SELECT COUNT(*) FROM user_achievements WHERE user_id = ? AND achievement_id = ?`, userID, a.ID).Scan(&c)
		if c > 0 {
			continue
		}
		now := time.Now().Format(time.RFC3339)
		_, _ = db.Exec(`INSERT INTO user_achievements (id, user_id, achievement_id, unlocked_at) VALUES (?,?,?,?)`,
			NewID(), userID, a.ID, now)
	}
}

// RebuildUser menghitung ulang agregat user (points, xp, level, total_waste, total_items)
// dari tabel collections — disebut pada seed dan setiap collection baru.
func RebuildUser(db *sql.DB, userID string) error {
	var totalWaste float64
	var totalItems, totalPoints int
	err := db.QueryRow(`SELECT IFNULL(SUM(amount),0), IFNULL(SUM(items_count),0), IFNULL(SUM(points_earned),0) FROM collections WHERE user_id = ?`, userID).Scan(&totalWaste, &totalItems, &totalPoints)
	if err != nil {
		return err
	}
	level, err := LevelForXP(db, totalPoints)
	if err != nil {
		return err
	}
	now := time.Now().Format(time.RFC3339)
	_, err = db.Exec(`UPDATE users SET points = ?, xp = ?, level = ?, total_waste = ?, total_items = ?, updated_at = ? WHERE id = ?`,
		totalPoints, totalPoints, level.LevelNumber, totalWaste, totalItems, now, userID)
	return err
}
