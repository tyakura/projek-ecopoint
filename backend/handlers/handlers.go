package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"
	"time"

	"ecopoint/backend/config"
	"ecopoint/backend/database"
	"ecopoint/backend/middleware"
	"ecopoint/backend/models"
	"ecopoint/backend/repositories"
	"ecopoint/backend/services"
)

var (
	userRepo        = repositories.UserRepo{}
	collectionRepo  = repositories.CollectionRepo{}
	challengeRepo   = repositories.ChallengeRepo{}
	achievementRepo = repositories.AchievementRepo{}
	rewardRepo      = repositories.RewardRepo{}
	leaderboardRepo = repositories.LeaderboardRepo{}
)

func writeJSON(w http.ResponseWriter, status int, v interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func writeErr(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, map[string]string{"error": msg})
}

func decode(r *http.Request, v interface{}) error {
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()
	return dec.Decode(v)
}

func publicUser(u models.User) map[string]interface{} {
	return map[string]interface{}{
		"id":          u.ID,
		"name":        u.Name,
		"email":       u.Email,
		"username":    u.Username,
		"points":      u.Points,
		"xp":          u.XP,
		"level":       u.Level,
		"level_title": levelTitle(u.XP),
		"total_waste": u.TotalWaste,
		"total_items": u.TotalItems,
		"created_at":  u.CreatedAt,
	}
}

func levelTitle(xp int) string {
	titles := []struct {
		Threshold int
		Title     string
	}{
		{0, "Eco Starter"},
		{500, "Green Explorer"},
		{1500, "Eco Warrior"},
		{3000, "Earth Guardian"},
	}
	current := "Eco Starter"
	for _, t := range titles {
		if xp >= t.Threshold {
			current = t.Title
		}
	}
	return current
}

// ---------- Auth ----------

func Register(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Name            string `json:"name"`
		Email           string `json:"email"`
		Username        string `json:"username"`
		Password        string `json:"password"`
		ConfirmPassword string `json:"confirm_password"`
	}
	if err := decode(r, &body); err != nil {
		writeErr(w, http.StatusBadRequest, "invalid request body")
		return
	}
	body.Name = strings.TrimSpace(body.Name)
	body.Email = strings.TrimSpace(body.Email)
	body.Username = strings.TrimSpace(body.Username)
	if body.Name == "" || body.Email == "" || body.Username == "" || body.Password == "" {
		writeErr(w, http.StatusBadRequest, "all fields are required")
		return
	}
	if !strings.Contains(body.Email, "@") {
		writeErr(w, http.StatusBadRequest, "invalid email address")
		return
	}
	if len(body.Password) < 6 {
		writeErr(w, http.StatusBadRequest, "password must be at least 6 characters")
		return
	}
	if body.Password != body.ConfirmPassword {
		writeErr(w, http.StatusBadRequest, "password confirmation does not match")
		return
	}
	if _, err := userRepo.ByEmail(body.Email); err == nil {
		writeErr(w, http.StatusConflict, "email already registered")
		return
	}
	if _, err := userRepo.ByUsername(body.Username); err == nil {
		writeErr(w, http.StatusConflict, "username already taken")
		return
	}
	hash, err := services.HashPassword(body.Password)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "could not create account")
		return
	}
	now := time.Now().Format(time.RFC3339)
	u := models.User{
		ID:           services.NewID(),
		Name:         body.Name,
		Email:        body.Email,
		Username:     body.Username,
		PasswordHash: hash,
		Level:        1,
		CreatedAt:    now,
		UpdatedAt:    now,
	}
	if err := userRepo.Create(u); err != nil {
		writeErr(w, http.StatusInternalServerError, "could not create account")
		return
	}
	token, err := services.GenerateToken(u.ID, config.JWTSecret)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "could not create session")
		return
	}
	writeJSON(w, http.StatusCreated, map[string]interface{}{"token": token, "user": publicUser(u)})
}

func Login(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := decode(r, &body); err != nil {
		writeErr(w, http.StatusBadRequest, "invalid request body")
		return
	}
	u, err := userRepo.ByEmail(strings.TrimSpace(body.Email))
	if errors.Is(err, repositories.ErrNotFound) {
		writeErr(w, http.StatusUnauthorized, "invalid email or password")
		return
	}
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "server error")
		return
	}
	if !services.CheckPassword(u.PasswordHash, body.Password) {
		writeErr(w, http.StatusUnauthorized, "invalid email or password")
		return
	}
	token, err := services.GenerateToken(u.ID, config.JWTSecret)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "could not create session")
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"token": token, "user": publicUser(u)})
}

func Logout(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]bool{"success": true})
}

// ---------- User ----------

func Me(w http.ResponseWriter, r *http.Request) {
	u, err := userRepo.ByID(middleware.UserIDFrom(r.Context()))
	if err != nil {
		writeErr(w, http.StatusNotFound, "user not found")
		return
	}
	writeJSON(w, http.StatusOK, publicUser(u))
}

func UpdateMe(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Name   string `json:"name"`
		Avatar string `json:"avatar"`
	}
	if err := decode(r, &body); err != nil {
		writeErr(w, http.StatusBadRequest, "invalid request body")
		return
	}
	uid := middleware.UserIDFrom(r.Context())
	if err := userRepo.Update(uid, strings.TrimSpace(body.Name), body.Avatar); err != nil {
		writeErr(w, http.StatusInternalServerError, "could not update profile")
		return
	}
	u, err := userRepo.ByID(uid)
	if err != nil {
		writeErr(w, http.StatusNotFound, "user not found")
		return
	}
	writeJSON(w, http.StatusOK, publicUser(u))
}

// ---------- Collection ----------

func CreateCollection(w http.ResponseWriter, r *http.Request) {
	var body struct {
		WasteType  string  `json:"waste_type"`
		Amount     float64 `json:"amount"`
		ItemsCount int     `json:"items_count"`
	}
	if err := decode(r, &body); err != nil {
		writeErr(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if body.Amount <= 0 || body.ItemsCount <= 0 {
		writeErr(w, http.StatusBadRequest, "amount and items_count must be positive")
		return
	}
	uid := middleware.UserIDFrom(r.Context())
	points := services.CalcPoints(body.Amount, body.ItemsCount)
	c := models.Collection{
		ID:           services.NewID(),
		UserID:       uid,
		WasteType:    body.WasteType,
		Amount:       body.Amount,
		ItemsCount:   body.ItemsCount,
		PointsEarned: points,
		CreatedAt:    time.Now().Format(time.RFC3339),
	}
	if err := collectionRepo.Create(c); err != nil {
		writeErr(w, http.StatusInternalServerError, "could not save collection")
		return
	}
	if err := services.RebuildUser(database.DB, uid); err != nil {
		writeErr(w, http.StatusInternalServerError, "could not update totals")
		return
	}
	services.CheckAchievements(database.DB, uid)
	writeJSON(w, http.StatusCreated, map[string]interface{}{
		"collection": c,
		"points":     points,
		"message":    "Great job! Keep collecting.",
	})
}

func ListCollections(w http.ResponseWriter, r *http.Request) {
	cols, err := collectionRepo.ByUser(middleware.UserIDFrom(r.Context()))
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "could not load collections")
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"collections": cols})
}

// ---------- Challenge ----------

func ListChallenges(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserIDFrom(r.Context())
	chs, err := challengeRepo.List()
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "could not load challenges")
		return
	}
	chs = challengeRepo.WithProgress(chs, uid)
	writeJSON(w, http.StatusOK, map[string]interface{}{"challenges": chs})
}

func ListMyChallenges(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserIDFrom(r.Context())
	chs, err := challengeRepo.List()
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "could not load challenges")
		return
	}
	chs = challengeRepo.WithProgress(chs, uid)
	mine := make([]models.Challenge, 0)
	for _, c := range chs {
		if c.Progress > 0 || c.IsCompleted {
			mine = append(mine, c)
		}
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"challenges": mine})
}

func ChallengeProgress(w http.ResponseWriter, r *http.Request) {
	challengeID := r.PathValue("id")
	uid := middleware.UserIDFrom(r.Context())
	ch, err := challengeRepo.ByID(challengeID)
	if errors.Is(err, repositories.ErrNotFound) {
		writeErr(w, http.StatusNotFound, "challenge not found")
		return
	}
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "server error")
		return
	}
	uc, err := challengeRepo.GetUserChallenge(uid, challengeID)
	if errors.Is(err, repositories.ErrNotFound) {
		uc = models.UserChallenge{UserID: uid, ChallengeID: challengeID}
	}
	if uc.IsCompleted {
		writeJSON(w, http.StatusOK, map[string]interface{}{"challenge": challengeWithProgress(ch, uc)})
		return
	}
	uc.Progress++
	if uc.Progress >= ch.Target {
		uc.IsCompleted = true
		now := time.Now().Format(time.RFC3339)
		uc.CompletedAt = &now
		u, err := userRepo.ByID(uid)
		if err == nil {
			newXP := u.XP + ch.XPReward
			newPoints := u.Points + ch.XPReward
			level, _ := services.LevelForXP(database.DB, newXP)
			_, _ = database.DB.Exec(`UPDATE users SET xp = ?, points = ?, level = ?, updated_at = ? WHERE id = ?`,
				newXP, newPoints, level.LevelNumber, now, uid)
		}
	}
	if err := challengeRepo.UpsertUserChallenge(uc); err != nil {
		writeErr(w, http.StatusInternalServerError, "could not update progress")
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"challenge": challengeWithProgress(ch, uc)})
}

func challengeWithProgress(c models.Challenge, uc models.UserChallenge) models.Challenge {
	c.Progress = uc.Progress
	c.IsCompleted = uc.IsCompleted
	c.CompletedAt = uc.CompletedAt
	return c
}

// ---------- Achievement ----------

func ListAchievements(w http.ResponseWriter, r *http.Request) {
	ach, err := achievementRepo.List(middleware.UserIDFrom(r.Context()))
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "could not load achievements")
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"achievements": ach})
}

// ---------- Reward ----------

func ListRewards(w http.ResponseWriter, r *http.Request) {
	rw, err := rewardRepo.ListActive()
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "could not load rewards")
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"rewards": rw})
}

func Redeem(w http.ResponseWriter, r *http.Request) {
	rewardID := r.PathValue("id")
	uid := middleware.UserIDFrom(r.Context())
	u, err := userRepo.ByID(uid)
	if err != nil {
		writeErr(w, http.StatusNotFound, "user not found")
		return
	}
	rw, err := rewardRepo.ByID(rewardID)
	if errors.Is(err, repositories.ErrNotFound) {
		writeErr(w, http.StatusNotFound, "reward not found")
		return
	}
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "server error")
		return
	}
	if u.Points < rw.PointsRequired {
		writeErr(w, http.StatusBadRequest, "not enough points")
		return
	}
	if rw.Stock <= 0 {
		writeErr(w, http.StatusBadRequest, "reward out of stock")
		return
	}
	red := models.Redemption{
		ID:         services.NewID(),
		UserID:     uid,
		RewardID:   rewardID,
		PointsUsed: rw.PointsRequired,
		Status:     "completed",
		CreatedAt:  time.Now().Format(time.RFC3339),
	}
	if err := rewardRepo.CreateRedemption(red); err != nil {
		writeErr(w, http.StatusInternalServerError, "could not redeem reward")
		return
	}
	if err := rewardRepo.DecrementStock(rewardID); err != nil {
		writeErr(w, http.StatusInternalServerError, "could not update stock")
		return
	}
	_, _ = database.DB.Exec(`UPDATE users SET points = points - ?, updated_at = ? WHERE id = ?`, rw.PointsRequired, time.Now().Format(time.RFC3339), uid)
	writeJSON(w, http.StatusCreated, map[string]interface{}{
		"message":    "Reward redeemed successfully!",
		"redemption": red,
	})
}

func ListRedemptions(w http.ResponseWriter, r *http.Request) {
	red, err := rewardRepo.RedemptionsByUser(middleware.UserIDFrom(r.Context()))
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "could not load redemptions")
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"redemptions": red})
}

// ---------- Leaderboard & Stats ----------

func Leaderboard(w http.ResponseWriter, r *http.Request) {
	rangeKey := r.URL.Query().Get("range")
	if rangeKey == "" {
		rangeKey = "all"
	}
	entries, err := leaderboardRepo.Get(rangeKey)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "could not load leaderboard")
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"leaderboard": entries, "range": rangeKey})
}

func Stats(w http.ResponseWriter, _ *http.Request) {
	s, err := repositories.GetStats()
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "could not load stats")
		return
	}
	writeJSON(w, http.StatusOK, s)
}
