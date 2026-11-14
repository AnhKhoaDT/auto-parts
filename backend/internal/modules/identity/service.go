package identity

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrInvalidCredentials = errors.New("invalid email or password")
	ErrTokenExpired        = errors.New("token has expired")
	ErrTokenRevoked        = errors.New("token has been revoked")
	ErrInvalidToken        = errors.New("invalid token payload")
	ErrWeakPassword        = errors.New("password must be at least 8 characters")
)

// Service coordinates authentication rules, password hashing, and token lifecycles.
type Service struct {
	repo          Repository
	jwtSecret     []byte
	refreshSecret []byte
}

// NewService constructs a Service with cryptographically verified secrets.
func NewService(repo Repository, jwtSecret, refreshSecret string) *Service {
	return &Service{
		repo:          repo,
		jwtSecret:     []byte(jwtSecret),
		refreshSecret: []byte(refreshSecret),
	}
}

// Register validates inputs, hashes passwords with bcrypt cost 12, and creates a user.
func (s *Service) Register(ctx context.Context, in RegisterInput) (*AuthTokens, error) {
	email := strings.ToLower(strings.TrimSpace(in.Email))
	if email == "" || !strings.Contains(email, "@") {
		return nil, fmt.Errorf("invalid email address")
	}

	if len(in.Password) < 8 {
		return nil, ErrWeakPassword
	}

	existing, _ := s.repo.GetByEmail(ctx, email)
	if existing != nil {
		return nil, ErrDuplicateEmail
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(in.Password), 12)
	if err != nil {
		return nil, fmt.Errorf("hash password: %w", err)
	}

	role := RoleCustomer
	if in.Role != nil {
		role = *in.Role
	}

	u := &User{
		Email:        email,
		PasswordHash: string(hash),
		FullName:     strings.TrimSpace(in.FullName),
		Phone:        in.Phone,
		Role:         role,
		IsActive:     true,
	}

	if err := s.repo.CreateUser(ctx, u); err != nil {
		return nil, fmt.Errorf("register user: %w", err)
	}

	return s.generateTokens(ctx, u)
}

// Login verifies user credentials against bcrypt hashes and returns fresh tokens.
func (s *Service) Login(ctx context.Context, in LoginInput) (*AuthTokens, error) {
	email := strings.ToLower(strings.TrimSpace(in.Email))
	u, err := s.repo.GetByEmail(ctx, email)
	if err != nil {
		return nil, ErrInvalidCredentials
	}

	if err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(in.Password)); err != nil {
		return nil, ErrInvalidCredentials
	}

	return s.generateTokens(ctx, u)
}

// Refresh verifies an existing refresh token and performs rotation.
func (s *Service) Refresh(ctx context.Context, rawToken string) (*AuthTokens, error) {
	tokenHash := s.hashToken(rawToken)
	t, err := s.repo.GetRefreshToken(ctx, tokenHash)
	if err != nil {
		return nil, ErrInvalidCredentials
	}

	if t.RevokedAt != nil {
		return nil, ErrTokenRevoked
	}

	if time.Now().UTC().After(t.ExpiresAt) {
		return nil, ErrTokenExpired
	}

	_ = s.repo.RevokeRefreshToken(ctx, t.ID)

	u, err := s.repo.GetByID(ctx, t.UserID)
	if err != nil {
		return nil, ErrUserNotFound
	}

	return s.generateTokens(ctx, u)
}

// GetUserByID loads profile data for an authenticated subject.
func (s *Service) GetUserByID(ctx context.Context, id uuid.UUID) (*User, error) {
	return s.repo.GetByID(ctx, id)
}

// generateTokens creates an access JWT and records a hashed refresh token in database.
func (s *Service) generateTokens(ctx context.Context, u *User) (*AuthTokens, error) {
	accessExpiry := time.Now().UTC().Add(15 * time.Minute)
	claims := jwt.MapClaims{
		"sub":   u.ID.String(),
		"email": u.Email,
		"role":  string(u.Role),
		"exp":   accessExpiry.Unix(),
	}

	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedAccess, err := accessToken.SignedString(s.jwtSecret)
	if err != nil {
		return nil, fmt.Errorf("sign access token: %w", err)
	}

	randomBytes := make([]byte, 32)
	if _, err := rand.Read(randomBytes); err != nil {
		return nil, fmt.Errorf("generate random bytes: %w", err)
	}
	rawRefreshToken := hex.EncodeToString(randomBytes)
	refreshExpiry := time.Now().UTC().Add(30 * 24 * time.Hour)

	dbToken := &RefreshToken{
		UserID:    u.ID,
		TokenHash: s.hashToken(rawRefreshToken),
		ExpiresAt: refreshExpiry,
	}

	if err := s.repo.CreateRefreshToken(ctx, dbToken); err != nil {
		return nil, fmt.Errorf("save refresh token: %w", err)
	}

	return &AuthTokens{
		AccessToken:  signedAccess,
		RefreshToken: rawRefreshToken,
		User:         *u,
		ExpiresAt:    accessExpiry,
	}, nil
}

// hashToken produces a deterministic SHA-256 hash preventing plaintext leakage.
func (s *Service) hashToken(raw string) string {
	sum := sha256.Sum256([]byte(raw + string(s.refreshSecret)))
	return hex.EncodeToString(sum[:])
}

