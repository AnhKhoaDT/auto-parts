package usecase

import (
	"context"

	"autoparts-backend/internal/domain"
)

// CatalogUseCase handles business orchestration for catalog search.
type CatalogUseCase struct {
	productRepo domain.ProductRepository
	vehicleRepo domain.VehicleRepository
}

// NewCatalogUseCase initializes a new CatalogUseCase instance.
func NewCatalogUseCase(p domain.ProductRepository, v domain.VehicleRepository) *CatalogUseCase {
	return &CatalogUseCase{
		productRepo: p,
		vehicleRepo: v,
	}
}

// SearchByOEM searches parts matching an OEM or cross-reference number.
func (uc *CatalogUseCase) SearchByOEM(ctx context.Context, oem string) ([]domain.Product, error) {
	return uc.productRepo.GetByOEM(ctx, oem)
}

// SearchByVehicle filters parts matching vehicle parameters.
func (uc *CatalogUseCase) SearchByVehicle(ctx context.Context, vehicleID string) ([]domain.Product, error) {
	return uc.productRepo.GetByVehicle(ctx, vehicleID)
}

