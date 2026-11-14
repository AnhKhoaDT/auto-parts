package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

// Config holds runtime configuration parsed strictly from environment variables.
type Config struct {
	DatabaseURL   string
	Port          string
	JWTSecret     string
	RefreshSecret string
	Environment   string
}

// Load loads environment variables with fail-fast validation on missing keys.
func Load() (*Config, error) {
	_ = godotenv.Load()

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		return nil, fmt.Errorf("config: DATABASE_URL is required")
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if len(jwtSecret) < 32 {
		return nil, fmt.Errorf("config: JWT_SECRET must be at least 32 characters")
	}

	refreshSecret := os.Getenv("REFRESH_SECRET")
	if len(refreshSecret) < 32 {
		return nil, fmt.Errorf("config: REFRESH_SECRET must be at least 32 characters")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	env := os.Getenv("ENVIRONMENT")
	if env == "" {
		env = "development"
	}

	return &Config{
		DatabaseURL:   dbURL,
		Port:          port,
		JWTSecret:     jwtSecret,
		RefreshSecret: refreshSecret,
		Environment:   env,
	}, nil
}

