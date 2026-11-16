package catalog

import (
	"context"
	"errors"

	"github.com/google/uuid"
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
