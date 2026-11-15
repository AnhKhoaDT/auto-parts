package catalog

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

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
