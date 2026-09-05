package database

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	"ecopoint/backend/config"
	"ecopoint/backend/models"
	"ecopoint/backend/services"

	_ "modernc.org/sqlite"
)

var DB *sql.DB

func Connect() error {
	cfg := config.Load()
	db, err := sql.Open("sqlite", cfg.DBPath)
	if err != nil {
		return err
	}
	db.SetMaxOpenConns(1)
	if err := db.Ping(); err != nil {
		return err
	}
	DB = db
	if err := migrate(); err != nil {
		return err
	}
	if err := seed(); err != nil {
		return err
	}
	return nil
}

func migrate() error {
	stmts := []string{
		`CREATE TABLE IF NOT EXISTS users (
			id TEXT PRIMARY KEY,
			name TEXT NOT NULL,
			email TEXT NOT NULL UNIQUE,
			username TEXT NOT NULL UNIQUE,
			password_hash TEXT NOT NULL,
			avatar TEXT,
			points INTEGER NOT NULL DEFAULT 0,
			xp INTEGER NOT NULL DEFAULT 0,
			level INTEGER NOT NULL DEFAULT 1,
			total_waste REAL NOT NULL DEFAULT 0,
			total_items INTEGER NOT NULL DEFAULT 0,
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL
		)`,
		`CREATE TABLE IF NOT EXISTS collections (
			id TEXT PRIMARY KEY,
			user_id TEXT NOT NULL REFERENCES users(id),
			waste_type TEXT NOT NULL,
			amount REAL NOT NULL,
			items_count INTEGER NOT NULL DEFAULT 0,
			points_earned INTEGER NOT NULL,
			created_at TEXT NOT NULL
		)`,
		`CREATE TABLE IF NOT EXISTS levels (
			id INTEGER PRIMARY KEY,
			level_number INTEGER NOT NULL UNIQUE,
			title TEXT NOT NULL,
			xp_required INTEGER NOT NULL,
			badge_icon TEXT
		)`,
		`CREATE TABLE IF NOT EXISTS challenges (
			id TEXT PRIMARY KEY,
			title TEXT NOT NULL,
			description TEXT,
			target INTEGER NOT NULL,
			xp_reward INTEGER NOT NULL,
			type TEXT NOT NULL,
			deadline TEXT NOT NULL,
			created_at TEXT NOT NULL
		)`,
		`CREATE TABLE IF NOT EXISTS user_challenges (
			id TEXT PRIMARY KEY,
			user_id TEXT NOT NULL REFERENCES users(id),
			challenge_id TEXT NOT NULL REFERENCES challenges(id),
			progress INTEGER NOT NULL DEFAULT 0,
			is_completed BOOLEAN NOT NULL DEFAULT 0,
			completed_at TEXT,
			UNIQUE(user_id, challenge_id)
		)`,
		`CREATE TABLE IF NOT EXISTS achievements (
			id TEXT PRIMARY KEY,
			name TEXT NOT NULL,
			description TEXT,
			icon TEXT,
			condition_type TEXT NOT NULL,
			condition_value INTEGER NOT NULL
		)`,
		`CREATE TABLE IF NOT EXISTS user_achievements (
			id TEXT PRIMARY KEY,
			user_id TEXT NOT NULL REFERENCES users(id),
			achievement_id TEXT NOT NULL REFERENCES achievements(id),
			unlocked_at TEXT NOT NULL,
			UNIQUE(user_id, achievement_id)
		)`,
		`CREATE TABLE IF NOT EXISTS rewards (
			id TEXT PRIMARY KEY,
			name TEXT NOT NULL,
			description TEXT,
			category TEXT,
			points_required INTEGER NOT NULL,
			image TEXT,
			stock INTEGER NOT NULL DEFAULT 0,
			is_active BOOLEAN NOT NULL DEFAULT 1
		)`,
		`CREATE TABLE IF NOT EXISTS redemptions (
			id TEXT PRIMARY KEY,
			user_id TEXT NOT NULL REFERENCES users(id),
			reward_id TEXT NOT NULL REFERENCES rewards(id),
			points_used INTEGER NOT NULL,
			status TEXT NOT NULL DEFAULT 'pending',
			created_at TEXT NOT NULL
		)`,
	}
	for _, s := range stmts {
		if _, err := DB.Exec(s); err != nil {
			return fmt.Errorf("migrate: %w", err)
		}
	}
	return nil
}

func seed() error {
	now := time.Now().Format(time.RFC3339)

	levels := []models.Level{
		{LevelNumber: 1, Title: "Eco Starter", XPRequired: 0, BadgeIcon: "🌱"},
		{LevelNumber: 2, Title: "Green Explorer", XPRequired: 500, BadgeIcon: "🍃"},
		{LevelNumber: 3, Title: "Eco Warrior", XPRequired: 1500, BadgeIcon: "♻️"},
		{LevelNumber: 4, Title: "Earth Guardian", XPRequired: 3000, BadgeIcon: "🌎"},
	}
	for _, l := range levels {
		var c int
		err := DB.QueryRow(`SELECT COUNT(*) FROM levels WHERE level_number = ?`, l.LevelNumber).Scan(&c)
		if err != nil {
			return err
		}
		if c == 0 {
			if _, err := DB.Exec(`INSERT INTO levels (level_number, title, xp_required, badge_icon) VALUES (?,?,?,?)`,
				l.LevelNumber, l.Title, l.XPRequired, l.BadgeIcon); err != nil {
				return err
			}
		}
	}

	challenges := []models.Challenge{
		{Title: "Collect 10 recyclable items", Description: "Collect any recyclable items to complete this weekly challenge.", Target: 10, XPReward: 500, Type: "weekly", Deadline: time.Now().Add(72 * time.Hour).Format(time.RFC3339)},
		{Title: "Collect 3 plastic bottles", Description: "Bring in 3 plastic bottles for recycling.", Target: 3, XPReward: 100, Type: "daily", Deadline: time.Now().Add(24 * time.Hour).Format(time.RFC3339)},
		{Title: "Recycle 1 KG of waste", Description: "Submit at least 1 KG of waste in a single collection.", Target: 1, XPReward: 250, Type: "weekly", Deadline: time.Now().Add(48 * time.Hour).Format(time.RFC3339)},
	}
	for _, ch := range challenges {
		var c int
		err := DB.QueryRow(`SELECT COUNT(*) FROM challenges WHERE title = ?`, ch.Title).Scan(&c)
		if err != nil {
			return err
		}
		if c == 0 {
			if _, err := DB.Exec(`INSERT INTO challenges (id, title, description, target, xp_reward, type, deadline, created_at) VALUES (?,?,?,?,?,?,?,?)`,
				services.NewID(), ch.Title, ch.Description, ch.Target, ch.XPReward, ch.Type, ch.Deadline, now); err != nil {
				return err
			}
		}
	}

	achievements := []models.Achievement{
		{Name: "First Collection", Description: "Submit your very first waste collection.", Icon: "♻️", ConditionType: "total_items", ConditionValue: 1},
		{Name: "Green Starter", Description: "Collect 5 items in total.", Icon: "🌱", ConditionType: "total_items", ConditionValue: 5},
		{Name: "Earth Saver", Description: "Collect 10 KG of waste in total.", Icon: "🌎", ConditionType: "total_waste", ConditionValue: 10},
		{Name: "Eco Legend", Description: "Collect 100 items in total.", Icon: "🏆", ConditionType: "total_items", ConditionValue: 100},
	}
	for _, a := range achievements {
		var c int
		err := DB.QueryRow(`SELECT COUNT(*) FROM achievements WHERE name = ?`, a.Name).Scan(&c)
		if err != nil {
			return err
		}
		if c == 0 {
			if _, err := DB.Exec(`INSERT INTO achievements (id, name, description, icon, condition_type, condition_value) VALUES (?,?,?,?,?,?)`,
				services.NewID(), a.Name, a.Description, a.Icon, a.ConditionType, a.ConditionValue); err != nil {
				return err
			}
		}
	}

	rewards := []models.Reward{
		{Name: "Rp10.000 Cash Reward", Description: "Redeem 10 thousand rupiah cash.", Category: "cash", PointsRequired: 1000, Image: "💰", Stock: 100, IsActive: true},
		{Name: "Discount Voucher", Description: "20% discount voucher for our partner stores.", Category: "voucher", PointsRequired: 1500, Image: "🎟️", Stock: 50, IsActive: true},
		{Name: "Environmental Donation", Description: "We plant a tree in your name.", Category: "donation", PointsRequired: 3000, Image: "🌱", Stock: 1000, IsActive: true},
		{Name: "Eco Merchandise — T-Shirt", Description: "Exclusive EcoPoint recycled-fiber t-shirt.", Category: "merchandise", PointsRequired: 5000, Image: "👕", Stock: 25, IsActive: true},
	}
	for _, r := range rewards {
		var c int
		err := DB.QueryRow(`SELECT COUNT(*) FROM rewards WHERE name = ?`, r.Name).Scan(&c)
		if err != nil {
			return err
		}
		if c == 0 {
			if _, err := DB.Exec(`INSERT INTO rewards (id, name, description, category, points_required, image, stock, is_active) VALUES (?,?,?,?,?,?,?,?)`,
				services.NewID(), r.Name, r.Description, r.Category, r.PointsRequired, r.Image, r.Stock, r.IsActive); err != nil {
				return err
			}
		}
	}

	if err := seedDemoUsers(now); err != nil {
		return err
	}
	log.Println("Database seeded.")
	return nil
}

func seedDemoUsers(now string) error {
	demoUsers := []struct {
		Name     string
		Email    string
		Username string
		Password string
		Samples  []struct {
			WasteType string
			Amount    float64
			Items     int
			DaysAgo   time.Duration
		}
	}{
		{
			Name: "Alex Yanuar", Email: "alex@ecopoint.io", Username: "alex", Password: "demo123456",
			Samples: []struct {
				WasteType string
				Amount    float64
				Items     int
				DaysAgo   time.Duration
			}{
				{WasteType: "plastic_bottle", Amount: 2.5, Items: 20, DaysAgo: 2 * time.Hour},
				{WasteType: "plastic_bag", Amount: 3.0, Items: 15, DaysAgo: 24 * time.Hour},
				{WasteType: "recyclable", Amount: 6.9, Items: 52, DaysAgo: 10 * 24 * time.Hour},
			},
		},
		{
			Name: "Sarah Putri", Email: "sarah@ecopoint.io", Username: "sarah", Password: "demo123456",
			Samples: []struct {
				WasteType string
				Amount    float64
				Items     int
				DaysAgo   time.Duration
			}{
				{WasteType: "plastic_bottle", Amount: 4.0, Items: 30, DaysAgo: 5 * time.Hour},
				{WasteType: "recyclable", Amount: 5.0, Items: 40, DaysAgo: 5 * 24 * time.Hour},
			},
		},
		{
			Name: "Daniel Wijaya", Email: "daniel@ecopoint.io", Username: "daniel", Password: "demo123456",
			Samples: []struct {
				WasteType string
				Amount    float64
				Items     int
				DaysAgo   time.Duration
			}{
				{WasteType: "plastic_bottle", Amount: 3.2, Items: 25, DaysAgo: 3 * 24 * time.Hour},
			},
		},
		{
			Name: "Kevin Tan", Email: "kevin@ecopoint.io", Username: "kevin", Password: "demo123456",
			Samples: []struct {
				WasteType string
				Amount    float64
				Items     int
				DaysAgo   time.Duration
			}{
				{WasteType: "plastic_bag", Amount: 2.1, Items: 18, DaysAgo: 12 * 24 * time.Hour},
			},
		},
	}
	for _, d := range demoUsers {
		var c int
		err := DB.QueryRow(`SELECT COUNT(*) FROM users WHERE email = ?`, d.Email).Scan(&c)
		if err != nil {
			return err
		}
		if c > 0 {
			continue
		}
		hash, err := services.HashPassword(d.Password)
		if err != nil {
			return err
		}
		if _, err := DB.Exec(`INSERT INTO users (id, name, email, username, password_hash, created_at, updated_at) VALUES (?,?,?,?,?,?,?)`,
			services.NewID(), d.Name, d.Email, d.Username, hash, now, now); err != nil {
			return err
		}
		var uid string
		if err := DB.QueryRow(`SELECT id FROM users WHERE email = ?`, d.Email).Scan(&uid); err != nil {
			return err
		}
		for _, s := range d.Samples {
			points := services.CalcPoints(s.Amount, s.Items)
			ts := time.Now().Add(-s.DaysAgo).Format(time.RFC3339)
			if _, err := DB.Exec(`INSERT INTO collections (id, user_id, waste_type, amount, items_count, points_earned, created_at) VALUES (?,?,?,?,?,?,?)`,
				services.NewID(), uid, s.WasteType, s.Amount, s.Items, points, ts); err != nil {
				return err
			}
		}
	}
	// recompute user aggregates & levels for all users
	rows, err := DB.Query(`SELECT id FROM users`)
	if err != nil {
		return err
	}
	var ids []string
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			rows.Close()
			return err
		}
		ids = append(ids, id)
	}
	rows.Close()
	for _, id := range ids {
		services.RebuildUser(DB, id)
		services.CheckAchievements(DB, id)
	}
	return nil
}
