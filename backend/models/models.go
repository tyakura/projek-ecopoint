package models

type User struct {
	ID           string  `json:"id"`
	Name         string  `json:"name"`
	Email        string  `json:"email"`
	Username     string  `json:"username"`
	PasswordHash string  `json:"-"`
	Avatar       *string `json:"avatar"`
	Points       int     `json:"points"`
	XP           int     `json:"xp"`
	Level        int     `json:"level"`
	LevelTitle   string  `json:"level_title"`
	TotalWaste   float64 `json:"total_waste"`
	TotalItems   int     `json:"total_items"`
	CreatedAt    string  `json:"created_at"`
	UpdatedAt    string  `json:"updated_at"`
}

type Collection struct {
	ID           string  `json:"id"`
	UserID       string  `json:"user_id"`
	WasteType    string  `json:"waste_type"`
	Amount       float64 `json:"amount"`
	ItemsCount   int     `json:"items_count"`
	PointsEarned int     `json:"points_earned"`
	CreatedAt    string  `json:"created_at"`
}

type Level struct {
	ID          int    `json:"id"`
	LevelNumber int    `json:"level_number"`
	Title       string `json:"title"`
	XPRequired  int    `json:"xp_required"`
	BadgeIcon   string `json:"badge_icon"`
}

type Challenge struct {
	ID          string  `json:"id"`
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Target      int     `json:"target"`
	XPReward    int     `json:"xp_reward"`
	Type        string  `json:"type"`
	Deadline    string  `json:"deadline"`
	CreatedAt   string  `json:"created_at"`
	Progress    int     `json:"progress"`
	IsCompleted bool    `json:"is_completed"`
	CompletedAt *string `json:"completed_at"`
}

type UserChallenge struct {
	ID          string  `json:"id"`
	UserID      string  `json:"user_id"`
	ChallengeID string  `json:"challenge_id"`
	Progress    int     `json:"progress"`
	IsCompleted bool    `json:"is_completed"`
	CompletedAt *string `json:"completed_at"`
}

type Achievement struct {
	ID             string  `json:"id"`
	Name           string  `json:"name"`
	Description    string  `json:"description"`
	Icon           string  `json:"icon"`
	ConditionType  string  `json:"condition_type"`
	ConditionValue int     `json:"condition_value"`
	UnlockedAt     *string `json:"unlocked_at"`
}

type UserAchievement struct {
	ID            string `json:"id"`
	UserID        string `json:"user_id"`
	AchievementID string `json:"achievement_id"`
	UnlockedAt    string `json:"unlocked_at"`
}

type Reward struct {
	ID             string `json:"id"`
	Name           string `json:"name"`
	Description    string `json:"description"`
	Category       string `json:"category"`
	PointsRequired int    `json:"points_required"`
	Image          string `json:"image"`
	Stock          int    `json:"stock"`
	IsActive       bool   `json:"is_active"`
}

type Redemption struct {
	ID         string `json:"id"`
	UserID     string `json:"user_id"`
	RewardID   string `json:"reward_id"`
	RewardName string `json:"reward_name"`
	PointsUsed int    `json:"points_used"`
	Status     string `json:"status"`
	CreatedAt  string `json:"created_at"`
}

type LeaderboardEntry struct {
	Rank       int     `json:"rank"`
	UserID     string  `json:"user_id"`
	Name       string  `json:"name"`
	Username   string  `json:"username"`
	TotalWaste float64 `json:"total_waste"`
	Level      int     `json:"level"`
}

type Stats struct {
	WasteCollected float64 `json:"waste_collected"`
	ActiveUsers    int     `json:"active_users"`
	Collections    int     `json:"collections"`
	RewardsClaimed int     `json:"rewards_claimed"`
}
