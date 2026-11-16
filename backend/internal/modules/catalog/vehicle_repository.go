package catalog

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
)

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
