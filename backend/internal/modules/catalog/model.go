package catalog

import (
	"time"

	"github.com/google/uuid"
)

// Category groups parts by automotive system.
type Category struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Slug        string    `json:"slug"`
	Code        string    `json:"code"`
	Description *string   `json:"description,omitempty"`
	IconName    string    `json:"icon_name"`
	SortOrder   int       `json:"sort_order"`
	IsActive    bool      `json:"is_active"`
	CreatedAt   time.Time `json:"created_at"`
}

// Brand represents an automotive parts manufacturer or OEM.
type Brand struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	Slug      string    `json:"slug"`
	Country   *string   `json:"country,omitempty"`
	LogoURL   *string   `json:"logo_url,omitempty"`
	IsOEM     bool      `json:"is_oem"`
	CreatedAt time.Time `json:"created_at"`
}

// Vehicle defines a specific automobile model and engine specification.
type Vehicle struct {
	ID        uuid.UUID `json:"id"`
	Make      string    `json:"make"`
	Model     string    `json:"model"`
	YearFrom  int       `json:"year_from"`
	YearTo    int       `json:"year_to"`
	Engine    string    `json:"engine"`
	FuelType  string    `json:"fuel_type"`
	CreatedAt time.Time `json:"created_at"`
}

// Product represents a sellable auto spare part with OEM and retail pricing.
type Product struct {
	ID             uuid.UUID `json:"id"`
	OEMNumber      string    `json:"oem_number"`
	SKU            string    `json:"sku"`
	Name           string    `json:"name"`
	Slug           string    `json:"slug"`
	BrandID        uuid.UUID `json:"brand_id"`
	BrandName      string    `json:"brand_name,omitempty"`
	CategoryID     uuid.UUID `json:"category_id"`
	CategoryName   string    `json:"category_name,omitempty"`
	Grade          string    `json:"grade"`
	RetailPrice    int64     `json:"retail_price"`
	WholesalePrice int64     `json:"wholesale_price"`
	StockQuantity  int       `json:"stock_quantity"`
	WarrantyMonths int       `json:"warranty_months"`
	ImageURL       *string   `json:"image_url,omitempty"`
	Description    *string   `json:"description,omitempty"`
	IsActive       bool      `json:"is_active"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// ProductFilter defines query parameters for searching and filtering spare parts.
type ProductFilter struct {
	VehicleID    *uuid.UUID `json:"vehicle_id"`
	CategorySlug *string    `json:"category_slug"`
	BrandSlug    *string    `json:"brand_slug"`
	Search       *string    `json:"search"`
	Limit        int        `json:"limit"`
	Offset       int        `json:"offset"`
}

// UserVehicle models a customer's vehicle saved to their garage profile.
type UserVehicle struct {
	ID           uuid.UUID  `json:"id"`
	UserID       uuid.UUID  `json:"user_id"`
	VehicleID    *uuid.UUID `json:"vehicle_id,omitempty"`
	Make         string     `json:"make"`
	Model        string     `json:"model"`
	Year         int        `json:"year"`
	Engine       string     `json:"engine"`
	LicensePlate *string    `json:"license_plate,omitempty"`
	VIN          *string    `json:"vin,omitempty"`
	Nickname     *string    `json:"nickname,omitempty"`
	IsDefault    bool       `json:"is_default"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
}

// CreateUserVehicleInput holds payload to add a vehicle to the garage.
type CreateUserVehicleInput struct {
	VehicleID    *uuid.UUID `json:"vehicle_id"`
	Make         string     `json:"make"`
	Model        string     `json:"model"`
	Year         int        `json:"year"`
	Engine       string     `json:"engine"`
	LicensePlate *string    `json:"license_plate"`
	VIN          *string    `json:"vin"`
	Nickname     *string    `json:"nickname"`
	IsDefault    bool       `json:"is_default"`
}

// VehicleCompatibility models compatibility between product and automobile.
type VehicleCompatibility struct {
	VehicleID uuid.UUID `json:"vehicle_id"`
	Make      string    `json:"make"`
	Model     string    `json:"model"`
	YearFrom  int       `json:"year_from"`
	YearTo    int       `json:"year_to"`
	Engine    string    `json:"engine"`
	FuelType  string    `json:"fuel_type"`
	Position  *string   `json:"position,omitempty"`
	Notes     *string   `json:"notes,omitempty"`
}

// ProductDetail holds comprehensive part specifications and vehicle fitment.
type ProductDetail struct {
	Product
	BrandCountry    *string                `json:"brand_country,omitempty"`
	Compatibilities []VehicleCompatibility `json:"compatibilities"`
}

