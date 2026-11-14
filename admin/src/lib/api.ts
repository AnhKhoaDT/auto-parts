const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: "ADMIN" | "STAFF" | "GARAGE" | "CUSTOMER";
  is_active: boolean;
  created_at: string;
}

export interface ApiError {
  code: string;
  message: string;
}

// request wraps fetch handling credentialed requests for the admin portal.
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error: ApiError = data?.error || {
      code: "UNKNOWN_ERROR",
      message: response.statusText,
    };
    throw error;
  }

  return data as T;
}

// adminAuthApi handles authentication against the administrative identity endpoints with /admin prefix.
export const adminAuthApi = {
  // login authenticates admin or staff credentials with elevated privileges check.
  login: (payload: { email: string; password: string }) =>
    request<{ user: AdminUser }>("/admin/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // getMe verifies active admin session cookie.
  getMe: () => request<{ user: AdminUser }>("/admin/auth/me", { method: "GET" }),

  // logout terminates the admin session cookie.
  logout: () => request<{ status: string }>("/admin/auth/logout", { method: "POST" }),
};

