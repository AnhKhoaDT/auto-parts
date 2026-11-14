package domain

import (
	"context"
	"time"
)

// PartGrade represents automotive part quality tier.
type PartGrade string

const (
	GradeGenuine     PartGrade = "GENUINE"
	GradeOEM         PartGrade = "OEM"
	GradeAftermarket PartGrade = "AFTERMARKET"
)

// Product represents an automotive spare part SKU.
type Product struct {
	ID             string    `json:"id"`
	OEMNumber      string    `json:"oem_number"`
	PartName       string    `json:"part_name"`
	Slug           string    `json:"slug"`
	CategoryID     string    `json:"category_id"`
	Grade          PartGrade `json:"grade"`
	Brand          string    `json:"brand"`
	OriginCountry  string    `json:"origin_country"`
	WeightGram     int       `json:"weight_gram"`
	DimensionsCM   string    `json:"dimensions_cm"`
	WarrantyMonths int       `json:"warranty_months"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// ProductRepository defines persistence contract for products.
type ProductRepository interface {
	GetByID(ctx context.Context, id string) (*Product, error)
	GetByOEM(ctx context.Context, oemNumber string) ([]Product, error)
	GetByVehicle(ctx context.Context, vehicleID string) ([]Product, error)
}

