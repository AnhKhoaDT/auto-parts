package identity

import (
	"encoding/json"
	"errors"
	"net/http"
	"time"

	"autoparts-backend/internal/platform/authz"
	"autoparts-backend/internal/platform/httpx"

	"github.com/go-chi/chi/v5"
)

// Handler exposes HTTP controllers for authentication and session management.
type Handler struct {
	svc         *Service
	environment string
}

// NewHandler constructs a Handler instance with environment awareness for cookie flags.
func NewHandler(svc *Service, env string) *Handler {
	return &Handler{svc: svc, environment: env}
}

// RegisterRoutes binds authentication endpoints to the chi sub-router.
func (h *Handler) RegisterRoutes(r chi.Router, authMiddleware func(http.Handler) http.Handler) {
	r.Post("/register", h.Register)
	r.Post("/login", h.Login)
	r.Post("/refresh", h.Refresh)
	r.Post("/logout", h.Logout)

	r.Group(func(protected chi.Router) {
		protected.Use(authMiddleware)
		protected.Get("/me", h.Me)
	})
}

// Register creates a new user account and sets session cookies.
func (h *Handler) Register(w http.ResponseWriter, r *http.Request) {
	var in RegisterInput
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		httpx.Error(w, http.StatusBadRequest, "INVALID_BODY", "Malformed JSON request body")
		return
	}

	tokens, err := h.svc.Register(r.Context(), in)
	if err != nil {
		if errors.Is(err, ErrDuplicateEmail) {
			httpx.Error(w, http.StatusConflict, "EMAIL_EXISTS", "Email address is already in use")
			return
		}
		if errors.Is(err, ErrWeakPassword) {
			httpx.Error(w, http.StatusBadRequest, "WEAK_PASSWORD", err.Error())
			return
		}
		httpx.Error(w, http.StatusInternalServerError, "INTERNAL", "Could not complete registration")
		return
	}

	h.setAuthCookies(w, tokens)
	httpx.JSON(w, http.StatusCreated, map[string]any{
		"user": tokens.User,
	})
}

// Login validates user credentials and issues authentication cookies.
func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var in LoginInput
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		httpx.Error(w, http.StatusBadRequest, "INVALID_BODY", "Malformed JSON request body")
		return
	}

	tokens, err := h.svc.Login(r.Context(), in)
	if err != nil {
		httpx.Error(w, http.StatusUnauthorized, "INVALID_CREDENTIALS", "Incorrect email or password")
		return
	}

	h.setAuthCookies(w, tokens)
	httpx.JSON(w, http.StatusOK, map[string]any{
		"user": tokens.User,
	})
}

// Me retrieves current user profile using request actor context.
func (h *Handler) Me(w http.ResponseWriter, r *http.Request) {
	actor, err := authz.GetActor(r.Context())
	if err != nil {
		httpx.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Missing authentication")
		return
	}

	u, err := h.svc.GetUserByID(r.Context(), actor.ID)
	if err != nil {
		httpx.Error(w, http.StatusNotFound, "USER_NOT_FOUND", "Account does not exist")
		return
	}

	httpx.JSON(w, http.StatusOK, map[string]any{"user": u})
}

// Refresh handles token rotation using active refresh token.
func (h *Handler) Refresh(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("refresh_token")
	if err != nil || cookie.Value == "" {
		httpx.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Missing refresh token cookie")
		return
	}

	tokens, err := h.svc.Refresh(r.Context(), cookie.Value)
	if err != nil {
		httpx.Error(w, http.StatusUnauthorized, "SESSION_EXPIRED", "Session expired, please login again")
		return
	}

	h.setAuthCookies(w, tokens)
	httpx.JSON(w, http.StatusOK, map[string]any{"status": "refreshed"})
}

// Logout clears active authentication cookies.
func (h *Handler) Logout(w http.ResponseWriter, r *http.Request) {
	isSecure := h.environment == "production"

	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   isSecure,
		SameSite: http.SameSiteLaxMode,
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Path:     "/api/v1/auth",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   isSecure,
		SameSite: http.SameSiteLaxMode,
	})

	httpx.JSON(w, http.StatusOK, map[string]any{"status": "logged_out"})
}

// setAuthCookies configures secure HttpOnly cookie headers for access and refresh tokens.
func (h *Handler) setAuthCookies(w http.ResponseWriter, tokens *AuthTokens) {
	isSecure := h.environment == "production"

	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    tokens.AccessToken,
		Path:     "/",
		Expires:  tokens.ExpiresAt,
		HttpOnly: true,
		Secure:   isSecure,
		SameSite: http.SameSiteLaxMode,
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    tokens.RefreshToken,
		Path:     "/api/v1/auth",
		Expires:  time.Now().UTC().Add(30 * 24 * time.Hour),
		HttpOnly: true,
		Secure:   isSecure,
		SameSite: http.SameSiteLaxMode,
	})
}

