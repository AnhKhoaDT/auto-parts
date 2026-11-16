package catalog

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/google/uuid"
)

var (
	ErrInvalidVehicleData = errors.New("make, model, year, and engine are required")
)

// Service defines domain use cases for catalog browsing and garage management.
type Service interface {
	GetCategories(ctx context.Context) ([]Category, error)
	GetBrands(ctx context.Context) ([]Brand, error)
	GetVehicles(ctx context.Context, make string) ([]Vehicle, error)
	GetProducts(ctx context.Context, filter ProductFilter) ([]Product, error)
	GetProduct(ctx context.Context, id uuid.UUID) (*Product, error)
	GetProductDetail(ctx context.Context, slug string) (*ProductDetail, error)
	GetRelatedProducts(ctx context.Context, categoryID uuid.UUID, excludeID uuid.UUID) ([]Product, error)
	GetUserVehicles(ctx context.Context, userID uuid.UUID) ([]UserVehicle, error)
	AddUserVehicle(ctx context.Context, userID uuid.UUID, in CreateUserVehicleInput) (*UserVehicle, error)
	RemoveUserVehicle(ctx context.Context, id, userID uuid.UUID) error
	MarkDefaultVehicle(ctx context.Context, id, userID uuid.UUID) error
}

type service struct {
	repo Repository
}

// NewService instantiates a catalog domain service with repository dependency.
func NewService(repo Repository) Service {
	return &service{repo: repo}
}

// GetCategories returns active automotive product categories.
func (s *service) GetCategories(ctx context.Context) ([]Category, error) {
	return s.repo.ListCategories(ctx)
}

// GetBrands returns all registered brands.
func (s *service) GetBrands(ctx context.Context) ([]Brand, error) {
	return s.repo.ListBrands(ctx)
}

// GetVehicles retrieves vehicle specifications filtered by manufacturer.
func (s *service) GetVehicles(ctx context.Context, make string) ([]Vehicle, error) {
	return s.repo.ListVehicles(ctx, strings.TrimSpace(make))
}

// GetProducts searches and returns spare parts based on automotive criteria.
func (s *service) GetProducts(ctx context.Context, filter ProductFilter) ([]Product, error) {
	return s.repo.ListProducts(ctx, filter)
}

// GetProduct retrieves complete specification of a single auto part.
func (s *service) GetProduct(ctx context.Context, id uuid.UUID) (*Product, error) {
	return s.repo.GetProductByID(ctx, id)
}

// GetProductDetail fetches full product specification with vehicle compatibility table.
func (s *service) GetProductDetail(ctx context.Context, slug string) (*ProductDetail, error) {
	return s.repo.GetProductBySlug(ctx, strings.TrimSpace(slug))
}

// GetRelatedProducts returns similar parts in same category for cross-selling.
func (s *service) GetRelatedProducts(ctx context.Context, categoryID uuid.UUID, excludeID uuid.UUID) ([]Product, error) {
	return s.repo.ListRelatedProducts(ctx, categoryID, excludeID, 4)
}

// GetUserVehicles returns garage vehicles owned by the customer.
func (s *service) GetUserVehicles(ctx context.Context, userID uuid.UUID) ([]UserVehicle, error) {
	return s.repo.ListUserVehicles(ctx, userID)
}

// AddUserVehicle validates and registers an automobile to customer garage.
func (s *service) AddUserVehicle(ctx context.Context, userID uuid.UUID, in CreateUserVehicleInput) (*UserVehicle, error) {
	makeStr := strings.TrimSpace(in.Make)
	modelStr := strings.TrimSpace(in.Model)
	engineStr := strings.TrimSpace(in.Engine)

	if makeStr == "" || modelStr == "" || in.Year <= 1970 || engineStr == "" {
		return nil, ErrInvalidVehicleData
	}

	uv := &UserVehicle{
		UserID:       userID,
		VehicleID:    in.VehicleID,
		Make:         makeStr,
		Model:        modelStr,
		Year:         in.Year,
		Engine:       engineStr,
		LicensePlate: in.LicensePlate,
		VIN:          in.VIN,
		Nickname:     in.Nickname,
		IsDefault:    in.IsDefault,
	}

	if err := s.repo.CreateUserVehicle(ctx, uv); err != nil {
		return nil, fmt.Errorf("service add user vehicle: %w", err)
	}
	return uv, nil
}

// RemoveUserVehicle deletes an owned vehicle from customer garage.
func (s *service) RemoveUserVehicle(ctx context.Context, id, userID uuid.UUID) error {
	return s.repo.DeleteUserVehicle(ctx, id, userID)
}

// MarkDefaultVehicle switches active vehicle used for parts compatibility filtering.
func (s *service) MarkDefaultVehicle(ctx context.Context, id, userID uuid.UUID) error {
	return s.repo.SetDefaultUserVehicle(ctx, id, userID)
}

