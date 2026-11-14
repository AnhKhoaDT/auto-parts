package catalog

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	"autoparts-backend/internal/platform/authz"
	"autoparts-backend/internal/platform/httpx"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

// Handler processes HTTP requests for catalog search and customer garage.
type Handler struct {
	service Service
}

// NewHandler creates a catalog HTTP handler instance.
func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

// RegisterRoutes mounts public catalog endpoints and protected garage routes.
func (h *Handler) RegisterRoutes(r chi.Router, authMiddleware func(http.Handler) http.Handler) {
	// Public catalog discovery
	r.Get("/categories", h.GetCategories)
	r.Get("/brands", h.GetBrands)
	r.Get("/vehicles", h.GetVehicles)
	r.Get("/products", h.GetProducts)
	r.Get("/products/slug/{slug}", h.GetProductBySlug)
	r.Get("/products/{id}", h.GetProduct)
	r.Get("/products/{id}/related", h.GetRelatedProducts)

	// Authenticated garage management
	r.Group(func(garage chi.Router) {
		garage.Use(authMiddleware)
		garage.Get("/garage/vehicles", h.GetUserVehicles)
		garage.Post("/garage/vehicles", h.AddUserVehicle)
		garage.Delete("/garage/vehicles/{id}", h.DeleteUserVehicle)
		garage.Patch("/garage/vehicles/{id}/default", h.MarkDefaultVehicle)
	})
}

// GetCategories returns automotive classification categories.
func (h *Handler) GetCategories(w http.ResponseWriter, r *http.Request) {
	categories, err := h.service.GetCategories(r.Context())
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to retrieve categories")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"categories": categories})
}

// GetBrands returns all registered parts and car manufacturers.
func (h *Handler) GetBrands(w http.ResponseWriter, r *http.Request) {
	brands, err := h.service.GetBrands(r.Context())
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to retrieve brands")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"brands": brands})
}

// GetVehicles returns vehicles list optionally filtered by make query param.
func (h *Handler) GetVehicles(w http.ResponseWriter, r *http.Request) {
	makeQuery := r.URL.Query().Get("make")
	vehicles, err := h.service.GetVehicles(r.Context(), makeQuery)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to retrieve vehicles")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"vehicles": vehicles})
}

// GetProducts handles spare parts search with compatibility and keyword filtering.
func (h *Handler) GetProducts(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	filter := ProductFilter{}

	if vIDStr := q.Get("vehicle_id"); vIDStr != "" {
		if parsed, err := uuid.Parse(vIDStr); err == nil {
			filter.VehicleID = &parsed
		}
	}
	if cat := q.Get("category"); cat != "" {
		filter.CategorySlug = &cat
	}
	if b := q.Get("brand"); b != "" {
		filter.BrandSlug = &b
	}
	if s := q.Get("search"); s != "" {
		filter.Search = &s
	}
	if limitStr := q.Get("limit"); limitStr != "" {
		if limit, err := strconv.Atoi(limitStr); err == nil {
			filter.Limit = limit
		}
	}
	if offsetStr := q.Get("offset"); offsetStr != "" {
		if offset, err := strconv.Atoi(offsetStr); err == nil {
			filter.Offset = offset
		}
	}

	products, err := h.service.GetProducts(r.Context(), filter)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to query products")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{
		"products": products,
		"count":    len(products),
	})
}

// GetProduct returns single product details by id.
func (h *Handler) GetProduct(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "INVALID_ID", "Invalid product UUID format")
		return
	}

	product, err := h.service.GetProduct(r.Context(), id)
	if err != nil {
		if errors.Is(err, ErrProductNotFound) {
			httpx.Error(w, http.StatusNotFound, "NOT_FOUND", "Product not found")
			return
		}
		httpx.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to fetch product")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"product": product})
}

// GetProductBySlug returns full product detail including vehicle compatibility table.
func (h *Handler) GetProductBySlug(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	if slug == "" {
		httpx.Error(w, http.StatusBadRequest, "INVALID_SLUG", "Product slug is required")
		return
	}

	detail, err := h.service.GetProductDetail(r.Context(), slug)
	if err != nil {
		if errors.Is(err, ErrProductNotFound) {
			httpx.Error(w, http.StatusNotFound, "NOT_FOUND", "Product not found")
			return
		}
		httpx.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to fetch product detail")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"product": detail})
}

// GetRelatedProducts returns similar parts in the same automotive category.
func (h *Handler) GetRelatedProducts(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "INVALID_ID", "Invalid product UUID format")
		return
	}

	product, err := h.service.GetProduct(r.Context(), id)
	if err != nil {
		httpx.Error(w, http.StatusNotFound, "NOT_FOUND", "Product not found")
		return
	}

	related, err := h.service.GetRelatedProducts(r.Context(), product.CategoryID, id)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to fetch related products")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"products": related, "count": len(related)})
}

// GetUserVehicles returns the authenticated customer's garage vehicle list.
func (h *Handler) GetUserVehicles(w http.ResponseWriter, r *http.Request) {
	actor, err := authz.GetActor(r.Context())
	if err != nil {
		httpx.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "User must be authenticated")
		return
	}

	vehicles, err := h.service.GetUserVehicles(r.Context(), actor.ID)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to retrieve user garage vehicles")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"vehicles": vehicles})
}

// AddUserVehicle saves a new car into customer garage profile.
func (h *Handler) AddUserVehicle(w http.ResponseWriter, r *http.Request) {
	actor, err := authz.GetActor(r.Context())
	if err != nil {
		httpx.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "User must be authenticated")
		return
	}

	var in CreateUserVehicleInput
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		httpx.Error(w, http.StatusBadRequest, "INVALID_JSON", "Malformed request payload")
		return
	}

	created, err := h.service.AddUserVehicle(r.Context(), actor.ID, in)
	if err != nil {
		if errors.Is(err, ErrInvalidVehicleData) {
			httpx.Error(w, http.StatusBadRequest, "INVALID_DATA", err.Error())
			return
		}
		httpx.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to add vehicle to garage")
		return
	}
	httpx.JSON(w, http.StatusCreated, map[string]any{"vehicle": created})
}

// DeleteUserVehicle removes a vehicle from customer garage.
func (h *Handler) DeleteUserVehicle(w http.ResponseWriter, r *http.Request) {
	actor, err := authz.GetActor(r.Context())
	if err != nil {
		httpx.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "User must be authenticated")
		return
	}

	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "INVALID_ID", "Invalid vehicle UUID format")
		return
	}

	if err := h.service.RemoveUserVehicle(r.Context(), id, actor.ID); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to remove vehicle")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]string{"status": "deleted"})
}

// MarkDefaultVehicle switches default vehicle used for storefront compatibility matching.
func (h *Handler) MarkDefaultVehicle(w http.ResponseWriter, r *http.Request) {
	actor, err := authz.GetActor(r.Context())
	if err != nil {
		httpx.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "User must be authenticated")
		return
	}

	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "INVALID_ID", "Invalid vehicle UUID format")
		return
	}

	if err := h.service.MarkDefaultVehicle(r.Context(), id, actor.ID); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to set default vehicle")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]string{"status": "updated"})
}
