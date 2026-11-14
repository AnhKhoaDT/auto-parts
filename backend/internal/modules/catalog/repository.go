package catalog

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var (
	ErrProductNotFound = errors.New("product not found")
	ErrVehicleNotFound = errors.New("vehicle not found")
)

// Repository encapsulates database operations for automotive catalog and garage.
type Repository interface {
	ListCategories(ctx context.Context) ([]Category, error)
	ListBrands(ctx context.Context) ([]Brand, error)
	ListVehicles(ctx context.Context, make string) ([]Vehicle, error)
	ListProducts(ctx context.Context, filter ProductFilter) ([]Product, error)
	GetProductByID(ctx context.Context, id uuid.UUID) (*Product, error)
	GetProductBySlug(ctx context.Context, slug string) (*ProductDetail, error)
	ListRelatedProducts(ctx context.Context, categoryID uuid.UUID, excludeID uuid.UUID, limit int) ([]Product, error)
	ListUserVehicles(ctx context.Context, userID uuid.UUID) ([]UserVehicle, error)
	CreateUserVehicle(ctx context.Context, uv *UserVehicle) error
	DeleteUserVehicle(ctx context.Context, id, userID uuid.UUID) error
	SetDefaultUserVehicle(ctx context.Context, id, userID uuid.UUID) error
}

type pgRepo struct {
	pool *pgxpool.Pool
}

// NewRepository constructs a catalog repository backed by PostgreSQL connection pool.
func NewRepository(pool *pgxpool.Pool) Repository {
	return &pgRepo{pool: pool}
}

// ListCategories returns active automotive component categories ordered by hierarchy.
func (r *pgRepo) ListCategories(ctx context.Context) ([]Category, error) {
	query := `
		SELECT id, name, slug, code, description, icon_name, sort_order, is_active, created_at
		FROM categories
		WHERE is_active = TRUE
		ORDER BY sort_order ASC, name ASC
	`
	rows, err := r.pool.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("list categories: %w", err)
	}
	defer rows.Close()

	var categories []Category
	for rows.Next() {
		var c Category
		if err := rows.Scan(
			&c.ID, &c.Name, &c.Slug, &c.Code, &c.Description, &c.IconName, &c.SortOrder, &c.IsActive, &c.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan category: %w", err)
		}
		categories = append(categories, c)
	}
	return categories, nil
}

// ListBrands returns all automotive manufacturer and OEM parts brands.
func (r *pgRepo) ListBrands(ctx context.Context) ([]Brand, error) {
	query := `
		SELECT id, name, slug, country, logo_url, is_oem, created_at
		FROM brands
		ORDER BY is_oem DESC, name ASC
	`
	rows, err := r.pool.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("list brands: %w", err)
	}
	defer rows.Close()

	var brands []Brand
	for rows.Next() {
		var b Brand
		if err := rows.Scan(
			&b.ID, &b.Name, &b.Slug, &b.Country, &b.LogoURL, &b.IsOEM, &b.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan brand: %w", err)
		}
		brands = append(brands, b)
	}
	return brands, nil
}

// ListVehicles returns vehicle models optionally filtered by automotive brand.
func (r *pgRepo) ListVehicles(ctx context.Context, make string) ([]Vehicle, error) {
	query := `
		SELECT id, make, model, year_from, year_to, engine, fuel_type, created_at
		FROM vehicles
		WHERE ($1 = '' OR LOWER(make) = LOWER($1))
		ORDER BY make ASC, model ASC, year_from DESC
	`
	rows, err := r.pool.Query(ctx, query, make)
	if err != nil {
		return nil, fmt.Errorf("list vehicles: %w", err)
	}
	defer rows.Close()

	var vehicles []Vehicle
	for rows.Next() {
		var v Vehicle
		if err := rows.Scan(
			&v.ID, &v.Make, &v.Model, &v.YearFrom, &v.YearTo, &v.Engine, &v.FuelType, &v.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan vehicle: %w", err)
		}
		vehicles = append(vehicles, v)
	}
	return vehicles, nil
}

// ListProducts queries spare parts filtered by vehicle compatibility, category, brand, or search.
func (r *pgRepo) ListProducts(ctx context.Context, f ProductFilter) ([]Product, error) {
	limit := f.Limit
	if limit <= 0 || limit > 100 {
		limit = 20
	}
	offset := f.Offset
	if offset < 0 {
		offset = 0
	}

	query := `
		SELECT 
			p.id, p.oem_number, p.sku, p.name, p.slug, p.brand_id, b.name AS brand_name,
			p.category_id, c.name AS category_name, p.grade, p.retail_price, p.wholesale_price,
			p.stock_quantity, p.warranty_months, p.image_url, p.description, p.is_active,
			p.created_at, p.updated_at
		FROM products p
		JOIN brands b ON p.brand_id = b.id
		JOIN categories c ON p.category_id = c.id
		LEFT JOIN product_vehicle_compatibilities pvc ON p.id = pvc.product_id
		WHERE p.is_active = TRUE
		  AND ($1::uuid IS NULL OR pvc.vehicle_id = $1)
		  AND ($2::text IS NULL OR c.slug = $2)
		  AND ($3::text IS NULL OR b.slug = $3)
		  AND ($4::text IS NULL OR p.name ILIKE '%' || $4 || '%' OR p.oem_number ILIKE '%' || $4 || '%' OR p.sku ILIKE '%' || $4 || '%')
		GROUP BY p.id, b.name, c.name
		ORDER BY p.created_at DESC
		LIMIT $5 OFFSET $6
	`

	rows, err := r.pool.Query(ctx, query, f.VehicleID, f.CategorySlug, f.BrandSlug, f.Search, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("list products: %w", err)
	}
	defer rows.Close()

	var products []Product
	for rows.Next() {
		var p Product
		if err := rows.Scan(
			&p.ID, &p.OEMNumber, &p.SKU, &p.Name, &p.Slug, &p.BrandID, &p.BrandName,
			&p.CategoryID, &p.CategoryName, &p.Grade, &p.RetailPrice, &p.WholesalePrice,
			&p.StockQuantity, &p.WarrantyMonths, &p.ImageURL, &p.Description, &p.IsActive,
			&p.CreatedAt, &p.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan product: %w", err)
		}
		products = append(products, p)
	}
	return products, nil
}

// GetProductByID fetches single product details by primary key UUID.
func (r *pgRepo) GetProductByID(ctx context.Context, id uuid.UUID) (*Product, error) {
	query := `
		SELECT 
			p.id, p.oem_number, p.sku, p.name, p.slug, p.brand_id, b.name AS brand_name,
			p.category_id, c.name AS category_name, p.grade, p.retail_price, p.wholesale_price,
			p.stock_quantity, p.warranty_months, p.image_url, p.description, p.is_active,
			p.created_at, p.updated_at
		FROM products p
		JOIN brands b ON p.brand_id = b.id
		JOIN categories c ON p.category_id = c.id
		WHERE p.id = $1 AND p.is_active = TRUE
	`
	var p Product
	err := r.pool.QueryRow(ctx, query, id).Scan(
		&p.ID, &p.OEMNumber, &p.SKU, &p.Name, &p.Slug, &p.BrandID, &p.BrandName,
		&p.CategoryID, &p.CategoryName, &p.Grade, &p.RetailPrice, &p.WholesalePrice,
		&p.StockQuantity, &p.WarrantyMonths, &p.ImageURL, &p.Description, &p.IsActive,
		&p.CreatedAt, &p.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrProductNotFound
		}
		return nil, fmt.Errorf("get product by id: %w", err)
	}
	return &p, nil
}

// GetProductBySlug fetches a full product detail including brand country and vehicle compatibilities.
func (r *pgRepo) GetProductBySlug(ctx context.Context, slug string) (*ProductDetail, error) {
	productQuery := `
		SELECT 
			p.id, p.oem_number, p.sku, p.name, p.slug, p.brand_id, b.name AS brand_name,
			p.category_id, c.name AS category_name, p.grade, p.retail_price, p.wholesale_price,
			p.stock_quantity, p.warranty_months, p.image_url, p.description, p.is_active,
			p.created_at, p.updated_at, b.country AS brand_country
		FROM products p
		JOIN brands b ON p.brand_id = b.id
		JOIN categories c ON p.category_id = c.id
		WHERE p.slug = $1 AND p.is_active = TRUE
	`
	var detail ProductDetail
	var p Product
	err := r.pool.QueryRow(ctx, productQuery, slug).Scan(
		&p.ID, &p.OEMNumber, &p.SKU, &p.Name, &p.Slug, &p.BrandID, &p.BrandName,
		&p.CategoryID, &p.CategoryName, &p.Grade, &p.RetailPrice, &p.WholesalePrice,
		&p.StockQuantity, &p.WarrantyMonths, &p.ImageURL, &p.Description, &p.IsActive,
		&p.CreatedAt, &p.UpdatedAt, &detail.BrandCountry,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrProductNotFound
		}
		return nil, fmt.Errorf("get product by slug: %w", err)
	}
	detail.Product = p

	// Fetch compatible vehicle list
	compatQuery := `
		SELECT v.id, v.make, v.model, v.year_from, v.year_to, v.engine, v.fuel_type,
		       pvc.position, pvc.notes
		FROM product_vehicle_compatibilities pvc
		JOIN vehicles v ON pvc.vehicle_id = v.id
		WHERE pvc.product_id = $1
		ORDER BY v.make, v.model, v.year_from DESC
	`
	rows, err := r.pool.Query(ctx, compatQuery, p.ID)
	if err != nil {
		return nil, fmt.Errorf("list compatibilities: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var c VehicleCompatibility
		if err := rows.Scan(
			&c.VehicleID, &c.Make, &c.Model, &c.YearFrom, &c.YearTo, &c.Engine, &c.FuelType,
			&c.Position, &c.Notes,
		); err != nil {
			return nil, fmt.Errorf("scan compatibility: %w", err)
		}
		detail.Compatibilities = append(detail.Compatibilities, c)
	}

	return &detail, nil
}

// ListRelatedProducts returns other parts in the same category, excluding current product.
func (r *pgRepo) ListRelatedProducts(ctx context.Context, categoryID uuid.UUID, excludeID uuid.UUID, limit int) ([]Product, error) {
	if limit <= 0 {
		limit = 4
	}
	query := `
		SELECT 
			p.id, p.oem_number, p.sku, p.name, p.slug, p.brand_id, b.name AS brand_name,
			p.category_id, c.name AS category_name, p.grade, p.retail_price, p.wholesale_price,
			p.stock_quantity, p.warranty_months, p.image_url, p.description, p.is_active,
			p.created_at, p.updated_at
		FROM products p
		JOIN brands b ON p.brand_id = b.id
		JOIN categories c ON p.category_id = c.id
		WHERE p.category_id = $1 AND p.id != $2 AND p.is_active = TRUE
		ORDER BY p.created_at DESC
		LIMIT $3
	`
	rows, err := r.pool.Query(ctx, query, categoryID, excludeID, limit)
	if err != nil {
		return nil, fmt.Errorf("list related products: %w", err)
	}
	defer rows.Close()

	var products []Product
	for rows.Next() {
		var p Product
		if err := rows.Scan(
			&p.ID, &p.OEMNumber, &p.SKU, &p.Name, &p.Slug, &p.BrandID, &p.BrandName,
			&p.CategoryID, &p.CategoryName, &p.Grade, &p.RetailPrice, &p.WholesalePrice,
			&p.StockQuantity, &p.WarrantyMonths, &p.ImageURL, &p.Description, &p.IsActive,
			&p.CreatedAt, &p.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan related product: %w", err)
		}
		products = append(products, p)
	}
	return products, nil
}

// ListUserVehicles returns all registered vehicles belonging to a user garage.
func (r *pgRepo) ListUserVehicles(ctx context.Context, userID uuid.UUID) ([]UserVehicle, error) {
	query := `
		SELECT id, user_id, vehicle_id, make, model, year, engine, license_plate, vin, nickname, is_default, created_at, updated_at
		FROM user_vehicles
		WHERE user_id = $1
		ORDER BY is_default DESC, created_at DESC
	`
	rows, err := r.pool.Query(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("list user vehicles: %w", err)
	}
	defer rows.Close()

	var list []UserVehicle
	for rows.Next() {
		var uv UserVehicle
		if err := rows.Scan(
			&uv.ID, &uv.UserID, &uv.VehicleID, &uv.Make, &uv.Model, &uv.Year, &uv.Engine,
			&uv.LicensePlate, &uv.VIN, &uv.Nickname, &uv.IsDefault, &uv.CreatedAt, &uv.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan user vehicle: %w", err)
		}
		list = append(list, uv)
	}
	return list, nil
}

// CreateUserVehicle adds a car to customer garage.
func (r *pgRepo) CreateUserVehicle(ctx context.Context, uv *UserVehicle) error {
	if uv.ID == uuid.Nil {
		uv.ID = uuid.New()
	}
	now := time.Now().UTC()
	uv.CreatedAt = now
	uv.UpdatedAt = now

	// If marked default, unset existing defaults first
	if uv.IsDefault {
		_, _ = r.pool.Exec(ctx, `UPDATE user_vehicles SET is_default = FALSE WHERE user_id = $1`, uv.UserID)
	}

	query := `
		INSERT INTO user_vehicles (id, user_id, vehicle_id, make, model, year, engine, license_plate, vin, nickname, is_default, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
	`
	_, err := r.pool.Exec(ctx, query,
		uv.ID, uv.UserID, uv.VehicleID, uv.Make, uv.Model, uv.Year, uv.Engine,
		uv.LicensePlate, uv.VIN, uv.Nickname, uv.IsDefault, uv.CreatedAt, uv.UpdatedAt,
	)
	if err != nil {
		return fmt.Errorf("create user vehicle: %w", err)
	}
	return nil
}

// DeleteUserVehicle removes a vehicle from customer garage ensuring ownership.
func (r *pgRepo) DeleteUserVehicle(ctx context.Context, id, userID uuid.UUID) error {
	query := `DELETE FROM user_vehicles WHERE id = $1 AND user_id = $2`
	_, err := r.pool.Exec(ctx, query, id, userID)
	if err != nil {
		return fmt.Errorf("delete user vehicle: %w", err)
	}
	return nil
}

// SetDefaultUserVehicle sets a vehicle as the active default in the garage.
func (r *pgRepo) SetDefaultUserVehicle(ctx context.Context, id, userID uuid.UUID) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("begin tx: %w", err)
	}
	defer tx.Rollback(ctx) // nolint:errcheck

	if _, err := tx.Exec(ctx, `UPDATE user_vehicles SET is_default = FALSE WHERE user_id = $1`, userID); err != nil {
		return fmt.Errorf("reset default: %w", err)
	}
	if _, err := tx.Exec(ctx, `UPDATE user_vehicles SET is_default = TRUE, updated_at = NOW() WHERE id = $1 AND user_id = $2`, id, userID); err != nil {
		return fmt.Errorf("set default: %w", err)
	}
	return tx.Commit(ctx)
}

