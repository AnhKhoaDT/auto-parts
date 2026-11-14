package domain

import (
	"context"
	"time"
)

// Vehicle represents vehicle master specs for part compatibility.
type Vehicle struct {
	ID           string    `json:"id"`
	Make         string    `json:"make"`
	Model        string    `json:"model"`
	YearStart    int       `json:"year_start"`
	YearEnd      *int      `json:"year_end,omitempty"`
	Generation   string    `json:"generation"`
	EngineCode   string    `json:"engine_code"`
	Transmission string    `json:"transmission"`
	CreatedAt    time.Time `json:"created_at"`
}

// VehicleRepository defines persistence contract for vehicles.
type VehicleRepository interface {
	GetMakes(ctx context.Context) ([]string, error)
	GetModelsByMake(ctx context.Context, make string) ([]string, error)
	FindVehicles(ctx context.Context, make, model string, year int) ([]Vehicle, error)
}

