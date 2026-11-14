package httpx

import (
	"encoding/json"
	"net/http"
)

// ErrBody defines the unified API error envelope.
type ErrBody struct {
	Error ErrDetail `json:"error"`
}

// ErrDetail holds stable machine-readable error codes.
type ErrDetail struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Details any    `json:"details,omitempty"`
}

// JSON serializes payload as JSON with appropriate Content-Type header.
func JSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(data)
}

// Error writes a standardized error JSON structure to the response.
func Error(w http.ResponseWriter, status int, code, message string) {
	JSON(w, status, ErrBody{
		Error: ErrDetail{
			Code:    code,
			Message: message,
		},
	})
}

