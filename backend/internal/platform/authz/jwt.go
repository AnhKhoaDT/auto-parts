package authz

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strings"

	"autoparts-backend/internal/platform/httpx"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type contextKey struct{}

// Actor represents an authenticated identity extracted from token claims.
type Actor struct {
	ID    uuid.UUID
	Email string
	Role  string
}

// RequireAuth middleware verifies access token from cookie or Authorization header.
func RequireAuth(jwtSecret string) func(http.Handler) http.Handler {
	secretBytes := []byte(jwtSecret)

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			tokenString := extractToken(r)
			if tokenString == "" {
				httpx.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Missing authentication token")
				return
			}

			claims := jwt.MapClaims{}
			token, err := jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (any, error) {
				if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
				}
				return secretBytes, nil
			})

			if err != nil || !token.Valid {
				httpx.Error(w, http.StatusUnauthorized, "INVALID_TOKEN", "Token is invalid or expired")
				return
			}

			subStr, _ := claims["sub"].(string)
			userID, err := uuid.Parse(subStr)
			if err != nil {
				httpx.Error(w, http.StatusUnauthorized, "INVALID_TOKEN", "Malformed user identifier in token")
				return
			}

			email, _ := claims["email"].(string)
			role, _ := claims["role"].(string)

			actor := Actor{
				ID:    userID,
				Email: email,
				Role:  role,
			}

			ctx := context.WithValue(r.Context(), contextKey{}, actor)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// GetActor extracts the authenticated actor from request context.
func GetActor(ctx context.Context) (Actor, error) {
	actor, ok := ctx.Value(contextKey{}).(Actor)
	if !ok {
		return Actor{}, errors.New("unauthorized: actor not found in context")
	}
	return actor, nil
}

// extractToken retrieves token from Bearer header or fallback HttpOnly cookie.
func extractToken(r *http.Request) string {
	authHeader := r.Header.Get("Authorization")
	if strings.HasPrefix(authHeader, "Bearer ") {
		return strings.TrimPrefix(authHeader, "Bearer ")
	}

	if cookie, err := r.Cookie("access_token"); err == nil && cookie.Value != "" {
		return cookie.Value
	}

	return ""
}

