package identity

import (
	"time"

	"github.com/google/uuid"
)

// Role defines user access level in role-based authorization.
type Role string

const (
	RoleCustomer Role = "CUSTOMER"
	RoleGarage   Role = "GARAGE"
	RoleAdmin    Role = "ADMIN"
	RoleStaff    Role = "STAFF"
)

// User represents an account entity stored in the database.
type User struct {
	ID           uuid.UUID `json:"id"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	FullName     string    `json:"full_name"`
	Phone        *string   `json:"phone,omitempty"`
	Role         Role      `json:"role"`
	IsActive     bool      `json:"is_active"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// RefreshToken tracks active sessions and prevents token replay.
type RefreshToken struct {
	ID        uuid.UUID  `json:"id"`
	UserID    uuid.UUID  `json:"user_id"`
	TokenHash string     `json:"-"`
	ExpiresAt time.Time  `json:"expires_at"`
	RevokedAt *time.Time `json:"revoked_at,omitempty"`
	CreatedAt time.Time  `json:"created_at"`
}

// RegisterInput holds request data for user creation.
type RegisterInput struct {
	Email    string  `json:"email"`
	Password string  `json:"password"`
	FullName string  `json:"full_name"`
	Phone    *string `json:"phone,omitempty"`
	Role     *Role   `json:"role,omitempty"`
}

// LoginInput holds user credentials for authentication.
type LoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// AuthTokens encapsulates access and refresh token pair.
type AuthTokens struct {
	AccessToken  string    `json:"access_token"`
	RefreshToken string    `json:"refresh_token"`
	User         User      `json:"user"`
	ExpiresAt    time.Time `json:"expires_at"`
}

