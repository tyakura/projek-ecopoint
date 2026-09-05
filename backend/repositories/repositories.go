package repositories

import (
	"database/sql"
	"errors"
	"time"

	"ecopoint/backend/database"
	"ecopoint/backend/models"
	"ecopoint/backend/services"
)

var ErrNotFound = errors.New("not found")

type UserRepo struct{}
type CollectionRepo struct{}
type ChallengeRepo struct{}
type AchievementRepo struct{}
type RewardRepo struct{}
type LeaderboardRepo struct{}

// ---------- User ----------

func (UserRepo) Create(u models.User) error {
	_, err := database.DB.Exec(`INSERT INTO users (id, name, email, username, password_hash, created_at, updated_at)
		VALUES (?,?,?,?,?,?,?)`, u.ID, u.Name, u.Email, u.Username, u.PasswordHash, u.CreatedAt, u.UpdatedAt)
	return err
}

func (UserRepo) ByEmail(email string) (models.User, error) {
	var u models.User
	err := database.DB.QueryRow(`SELECT id, name, email, username, password_hash, points, xp, level, total_waste, total_items, created_at, updated_at FROM users WHERE email = ?`, email).
		Scan(&u.ID, &u.Name, &u.Email, &u.Username, &u.PasswordHash, &u.Points, &u.XP, &u.Level, &u.TotalWaste, &u.TotalItems, &u.CreatedAt, &u.UpdatedAt)
	if err == sql.ErrNoRows {
		return u, ErrNotFound
	}
	return u, err
}

func (UserRepo) ByUsername(username string) (models.User, error) {
	var u models.User
	err := database.DB.QueryRow(`SELECT id, name, email, username, password_hash, points, xp, level, total_waste, total_items, created_at, updated_at FROM users WHERE username = ?`, username).
		Scan(&u.ID, &u.Name, &u.Email, &u.Username, &u.PasswordHash, &u.Points, &u.XP, &u.Level, &u.TotalWaste, &u.TotalItems, &u.CreatedAt, &u.UpdatedAt)
	if err == sql.ErrNoRows {
		return u, ErrNotFound
	}
	return u, err
}

func (UserRepo) ByID(id string) (models.User, error) {
	var u models.User
	err := database.DB.QueryRow(`SELECT id, name, email, username, password_hash, points, xp, level, total_waste, total_items, created_at, updated_at FROM users WHERE id = ?`, id).
		Scan(&u.ID, &u.Name, &u.Email, &u.Username, &u.PasswordHash, &u.Points, &u.XP, &u.Level, &u.TotalWaste, &u.TotalItems, &u.CreatedAt, &u.UpdatedAt)
	if err == sql.ErrNoRows {
		return u, ErrNotFound
	}
	return u, err
}

func (UserRepo) Update(id string, name, avatar string) error {
	_, err := database.DB.Exec(`UPDATE users SET name = ?, avatar = ?, updated_at = ? WHERE id = ?`, name, avatar, time.Now().Format(time.RFC3339), id)
	return err
}

// ---------- Collection ----------

func (CollectionRepo) Create(c models.Collection) error {
	_, err := database.DB.Exec(`INSERT INTO collections (id, user_id, waste_type, amount, items_count, points_earned, created_at) VALUES (?,?,?,?,?,?,?)`,
		c.ID, c.UserID, c.WasteType, c.Amount, c.ItemsCount, c.PointsEarned, c.CreatedAt)
	return err
}

func (CollectionRepo) ByUser(userID string) ([]models.Collection, error) {
	rows, err := database.DB.Query(`SELECT id, user_id, waste_type, amount, items_count, points_earned, created_at FROM collections WHERE user_id = ? ORDER BY created_at DESC`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []models.Collection
	for rows.Next() {
		var c models.Collection
		if err := rows.Scan(&c.ID, &c.UserID, &c.WasteType, &c.Amount, &c.ItemsCount, &c.PointsEarned, &c.CreatedAt); err != nil {
			return nil, err
		}
		out = append(out, c)
	}
	return out, nil
}

// ---------- Challenge ----------

func (ChallengeRepo) List() ([]models.Challenge, error) {
	rows, err := database.DB.Query(`SELECT id, title, description, target, xp_reward, type, deadline, created_at FROM challenges ORDER BY type ASC, created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := make([]models.Challenge, 0)
	for rows.Next() {
		var c models.Challenge
		if err := rows.Scan(&c.ID, &c.Title, &c.Description, &c.Target, &c.XPReward, &c.Type, &c.Deadline, &c.CreatedAt); err != nil {
			return nil, err
		}
		out = append(out, c)
	}
	return out, nil
}

func (ChallengeRepo) ByID(id string) (models.Challenge, error) {
	var c models.Challenge
	err := database.DB.QueryRow(`SELECT id, title, description, target, xp_reward, type, deadline, created_at FROM challenges WHERE id = ?`, id).
		Scan(&c.ID, &c.Title, &c.Description, &c.Target, &c.XPReward, &c.Type, &c.Deadline, &c.CreatedAt)
	if err == sql.ErrNoRows {
		return c, ErrNotFound
	}
	return c, err
}

func (ChallengeRepo) GetUserChallenge(userID, challengeID string) (models.UserChallenge, error) {
	var uc models.UserChallenge
	var completedAt sql.NullString
	err := database.DB.QueryRow(`SELECT id, user_id, challenge_id, progress, is_completed, completed_at FROM user_challenges WHERE user_id = ? AND challenge_id = ?`, userID, challengeID).
		Scan(&uc.ID, &uc.UserID, &uc.ChallengeID, &uc.Progress, &uc.IsCompleted, &completedAt)
	uc.CompletedAt = nullStringPtr(completedAt)
	if err == sql.ErrNoRows {
		return uc, ErrNotFound
	}
	return uc, err
}

func nullStringPtr(ns sql.NullString) *string {
	if !ns.Valid {
		return nil
	}
	return &ns.String
}

func (ChallengeRepo) UpsertUserChallenge(uc models.UserChallenge) error {
	var c int
	err := database.DB.QueryRow(`SELECT COUNT(*) FROM user_challenges WHERE user_id = ? AND challenge_id = ?`, uc.UserID, uc.ChallengeID).Scan(&c)
	if err != nil {
		return err
	}
	if c == 0 {
		_, err = database.DB.Exec(`INSERT INTO user_challenges (id, user_id, challenge_id, progress, is_completed, completed_at) VALUES (?,?,?,?,?,?)`,
			services.NewID(), uc.UserID, uc.ChallengeID, uc.Progress, uc.IsCompleted, uc.CompletedAt)
		return err
	}
	_, err = database.DB.Exec(`UPDATE user_challenges SET progress = ?, is_completed = ?, completed_at = ? WHERE user_id = ? AND challenge_id = ?`,
		uc.Progress, uc.IsCompleted, uc.CompletedAt, uc.UserID, uc.ChallengeID)
	return err
}

func (ChallengeRepo) WithProgress(challenges []models.Challenge, userID string) []models.Challenge {
	for i := range challenges {
		uc, err := (ChallengeRepo{}).GetUserChallenge(userID, challenges[i].ID)
		if err == nil {
			challenges[i].Progress = uc.Progress
			challenges[i].IsCompleted = uc.IsCompleted
			challenges[i].CompletedAt = uc.CompletedAt
		}
	}
	return challenges
}

// ---------- Achievement ----------

func (AchievementRepo) List(userID string) ([]models.Achievement, error) {
	rows, err := database.DB.Query(`SELECT a.id, a.name, a.description, a.icon, a.condition_type, a.condition_value, ua.unlocked_at
		FROM achievements a LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = ?
		ORDER BY a.condition_value ASC`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := make([]models.Achievement, 0)
	for rows.Next() {
		var a models.Achievement
		var unlockedAt sql.NullString
		if err := rows.Scan(&a.ID, &a.Name, &a.Description, &a.Icon, &a.ConditionType, &a.ConditionValue, &unlockedAt); err != nil {
			return nil, err
		}
		a.UnlockedAt = nullStringPtr(unlockedAt)
		out = append(out, a)
	}
	return out, nil
}

// ---------- Reward ----------

func (RewardRepo) ListActive() ([]models.Reward, error) {
	rows, err := database.DB.Query(`SELECT id, name, description, category, points_required, image, stock, is_active FROM rewards WHERE is_active = 1 ORDER BY points_required ASC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := make([]models.Reward, 0)
	for rows.Next() {
		var r models.Reward
		if err := rows.Scan(&r.ID, &r.Name, &r.Description, &r.Category, &r.PointsRequired, &r.Image, &r.Stock, &r.IsActive); err != nil {
			return nil, err
		}
		out = append(out, r)
	}
	return out, nil
}

func (RewardRepo) ByID(id string) (models.Reward, error) {
	var r models.Reward
	err := database.DB.QueryRow(`SELECT id, name, description, category, points_required, image, stock, is_active FROM rewards WHERE id = ?`, id).
		Scan(&r.ID, &r.Name, &r.Description, &r.Category, &r.PointsRequired, &r.Image, &r.Stock, &r.IsActive)
	if err == sql.ErrNoRows {
		return r, ErrNotFound
	}
	return r, err
}

func (RewardRepo) CreateRedemption(red models.Redemption) error {
	_, err := database.DB.Exec(`INSERT INTO redemptions (id, user_id, reward_id, points_used, status, created_at) VALUES (?,?,?,?,?,?)`,
		red.ID, red.UserID, red.RewardID, red.PointsUsed, red.Status, red.CreatedAt)
	return err
}

func (RewardRepo) DecrementStock(rewardID string) error {
	_, err := database.DB.Exec(`UPDATE rewards SET stock = stock - 1 WHERE id = ? AND stock > 0`, rewardID)
	return err
}

func (RewardRepo) RedemptionsByUser(userID string) ([]models.Redemption, error) {
	rows, err := database.DB.Query(`SELECT r.id, r.user_id, r.reward_id, r.points_used, r.status, r.created_at, w.name
		FROM redemptions r JOIN rewards w ON r.reward_id = w.id WHERE r.user_id = ? ORDER BY r.created_at DESC`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := make([]models.Redemption, 0)
	for rows.Next() {
		var red models.Redemption
		if err := rows.Scan(&red.ID, &red.UserID, &red.RewardID, &red.PointsUsed, &red.Status, &red.CreatedAt, &red.RewardName); err != nil {
			return nil, err
		}
		out = append(out, red)
	}
	return out, nil
}

// ---------- Leaderboard ----------

func (LeaderboardRepo) Get(rangeKey string) ([]models.LeaderboardEntry, error) {
	q := `SELECT u.id, u.name, u.username, u.total_waste, u.level FROM users u ORDER BY u.total_waste DESC LIMIT 20`
	rows, err := database.DB.Query(q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out = make([]models.LeaderboardEntry, 0)
	rank := 1
	for rows.Next() {
		var e models.LeaderboardEntry
		if err := rows.Scan(&e.UserID, &e.Name, &e.Username, &e.TotalWaste, &e.Level); err != nil {
			return nil, err
		}
		e.Rank = rank
		rank++
		out = append(out, e)
	}
	return out, nil
}

// ---------- Stats ----------

func GetStats() (models.Stats, error) {
	var s models.Stats
	err := database.DB.QueryRow(`SELECT IFNULL(SUM(amount),0) FROM collections`).Scan(&s.WasteCollected)
	if err != nil {
		return s, err
	}
	err = database.DB.QueryRow(`SELECT COUNT(*) FROM users`).Scan(&s.ActiveUsers)
	if err != nil {
		return s, err
	}
	err = database.DB.QueryRow(`SELECT COUNT(*) FROM collections`).Scan(&s.Collections)
	if err != nil {
		return s, err
	}
	err = database.DB.QueryRow(`SELECT COUNT(*) FROM redemptions`).Scan(&s.RewardsClaimed)
	return s, err
}
