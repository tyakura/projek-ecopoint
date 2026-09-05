package routes

import (
	"net/http"

	"ecopoint/backend/handlers"
	"ecopoint/backend/middleware"
)

func New() *http.ServeMux {
	mux := http.NewServeMux()

	// Public
	mux.HandleFunc("GET /api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"ok"}`))
	})
	mux.HandleFunc("GET /api/stats", handlers.Stats)
	mux.HandleFunc("POST /api/auth/register", handlers.Register)
	mux.HandleFunc("POST /api/auth/login", handlers.Login)

	// Protected
	protected := http.NewServeMux()

	protected.HandleFunc("POST /api/auth/logout", handlers.Logout)
	protected.HandleFunc("GET /api/users/me", handlers.Me)
	protected.HandleFunc("PUT /api/users/me", handlers.UpdateMe)
	protected.HandleFunc("POST /api/collections", handlers.CreateCollection)
	protected.HandleFunc("GET /api/collections", handlers.ListCollections)
	protected.HandleFunc("GET /api/challenges", handlers.ListChallenges)
	protected.HandleFunc("GET /api/challenges/me", handlers.ListMyChallenges)
	protected.HandleFunc("POST /api/challenges/{id}/progress", handlers.ChallengeProgress)
	protected.HandleFunc("GET /api/achievements", handlers.ListAchievements)
	protected.HandleFunc("GET /api/achievements/me", handlers.ListAchievements)
	protected.HandleFunc("GET /api/rewards", handlers.ListRewards)
	protected.HandleFunc("GET /api/rewards/redemptions", handlers.ListRedemptions)
	protected.HandleFunc("POST /api/rewards/{id}/redeem", handlers.Redeem)
	protected.HandleFunc("GET /api/leaderboard", handlers.Leaderboard)

	mux.Handle("/", middleware.Auth(protected))
	return mux
}
