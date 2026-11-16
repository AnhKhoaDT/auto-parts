package catalog

import (
	"context"
	"fmt"
)

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
