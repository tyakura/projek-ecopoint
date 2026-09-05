package config

import (
	"bufio"
	"log"
	"os"
	"strings"
)

type Config struct {
	Port      string
	DBPath    string
	JWTSecret string
}

var JWTSecret = ""

// LoadDotEnv membaca file .env di direktori kerja (dan folder backend/)
// dan memuatnya ke environment jika variabelnya belum ter-set.
func LoadDotEnv() {
	for _, p := range []string{".env", "backend/.env"} {
		f, err := os.Open(p)
		if err != nil {
			continue
		}
		defer f.Close()
		sc := bufio.NewScanner(f)
		for sc.Scan() {
			line := strings.TrimSpace(sc.Text())
			if line == "" || strings.HasPrefix(line, "#") {
				continue
			}
			kv := strings.SplitN(line, "=", 2)
			if len(kv) != 2 {
				continue
			}
			key := strings.TrimSpace(kv[0])
			val := strings.TrimSpace(kv[1])
			val = strings.Trim(val, `"'`)
			if os.Getenv(key) == "" {
				if err := os.Setenv(key, val); err != nil {
					log.Printf("config: could not set %s", key)
				}
			}
		}
		break
	}
}

func Load() Config {
	LoadDotEnv()
	port := getenv("PORT", "8080")
	dbPath := getenv("DB_PATH", "ecopoint.db")
	secret := getenv("JWT_SECRET", "ecopoint-super-secret-key")
	JWTSecret = secret
	return Config{
		Port:      port,
		DBPath:    dbPath,
		JWTSecret: secret,
	}
}

func getenv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}