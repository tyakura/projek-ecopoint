package main

import (
	"log"
	"net/http"

	"ecopoint/backend/config"
	"ecopoint/backend/database"
	"ecopoint/backend/middleware"
	"ecopoint/backend/routes"
)

func main() {
	if err := database.Connect(); err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	cfg := config.Load()
	mux := routes.New()
	handler := middleware.CORS(middleware.Logger(mux))

	log.Printf("EcoPoint API listening on :%s", cfg.Port)
	if err := http.ListenAndServe(":"+cfg.Port, handler); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
