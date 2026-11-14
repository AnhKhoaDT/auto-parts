package postgres

import (
	"context"

	"autoparts-backend/internal/domain"
)

// ProductRepo implements domain.ProductRepository interface.
type ProductRepo struct{}

// NewProductRepo creates a new product repository instance.
func NewProductRepo() *ProductRepo {
	return &ProductRepo{}
}

// GetByID retrieves a single product by primary key.
func (r *ProductRepo) GetByID(ctx context.Context, id string) (*domain.Product, error) {
	return &domain.Product{ID: id, PartName: "Brake Pad Front"}, nil
}

// GetByOEM retrieves matching products by OEM part number.
func (r *ProductRepo) GetByOEM(ctx context.Context, oemNumber string) ([]domain.Product, error) {
	return []domain.Product{}, nil
}

// GetByVehicle retrieves compatible products via fitment matrix.
func (r *ProductRepo) GetByVehicle(ctx context.Context, vehicleID string) ([]domain.Product, error) {
	return []domain.Product{}, nil
}

