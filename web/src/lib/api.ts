const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: "CUSTOMER" | "GARAGE" | "ADMIN" | "STAFF";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  code: string;
  description?: string;
  icon_name: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  country?: string;
  logo_url?: string;
  is_oem: boolean;
  created_at: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year_from: number;
  year_to: number;
  engine: string;
  fuel_type: string;
  created_at: string;
}

export interface Product {
  id: string;
  oem_number: string;
  sku: string;
  name: string;
  slug: string;
  brand_id: string;
  brand_name?: string;
  category_id: string;
  category_name?: string;
  grade: string;
  retail_price: number;
  wholesale_price: number;
  stock_quantity: number;
  warranty_months: number;
  image_url?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserVehicle {
  id: string;
  user_id: string;
  vehicle_id?: string;
  make: string;
  model: string;
  year: number;
  engine: string;
  license_plate?: string;
  vin?: string;
  nickname?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface VehicleCompatibility {
  vehicle_id: string;
  make: string;
  model: string;
  year_from: number;
  year_to: number;
  engine: string;
  fuel_type: string;
  position?: string;
  notes?: string;
}

export interface ProductDetail extends Product {
  brand_country?: string;
  compatibilities: VehicleCompatibility[];
}

export interface ApiError {
  code: string;
  message: string;
}

// request wraps fetch handling credentialed requests and uniform error responses.
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

// authApi provides functions to authenticate against the Golang identity service.
export const authApi = {
  // register sends registration payload and sets session cookies upon success.
  register: (payload: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    role?: string;
  }) =>
    request<{ user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // login submits credentials and receives HttpOnly session cookies.
  login: (payload: { email: string; password: string }) =>
    request<{ user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // getMe queries current authenticated user using active session cookie.
  getMe: () => request<{ user: User }>("/auth/me", { method: "GET" }),

  // logout terminates the current session and clears cookies.
  logout: () => request<{ status: string }>("/auth/logout", { method: "POST" }),
};

// catalogApi fetches parts, vehicle compatibility, and customer garage records.
export const catalogApi = {
  getCategories: () => request<{ categories: Category[] }>("/categories", { method: "GET" }),

  getBrands: () => request<{ brands: Brand[] }>("/brands", { method: "GET" }),

  getVehicles: (make?: string) => {
    const query = make ? `?make=${encodeURIComponent(make)}` : "";
    return request<{ vehicles: Vehicle[] }>(`/vehicles${query}`, { method: "GET" });
  },

  getProducts: (params?: {
    vehicle_id?: string;
    category?: string;
    brand?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) => {
    const sp = new URLSearchParams();
    if (params?.vehicle_id) sp.set("vehicle_id", params.vehicle_id);
    if (params?.category) sp.set("category", params.category);
    if (params?.brand) sp.set("brand", params.brand);
    if (params?.search) sp.set("search", params.search);
    if (params?.limit) sp.set("limit", params.limit.toString());
    if (params?.offset) sp.set("offset", params.offset.toString());
    const query = sp.toString() ? `?${sp.toString()}` : "";
    return request<{ products: Product[]; count: number }>(`/products${query}`, { method: "GET" });
  },

  getProduct: (id: string) => request<{ product: Product }>(`/products/${id}`, { method: "GET" }),

  getProductBySlug: (slug: string) =>
    request<{ product: ProductDetail }>(`/products/slug/${encodeURIComponent(slug)}`, { method: "GET" }),

  getRelatedProducts: (id: string) =>
    request<{ products: Product[]; count: number }>(`/products/${id}/related`, { method: "GET" }),

  getUserVehicles: () => request<{ vehicles: UserVehicle[] }>("/garage/vehicles", { method: "GET" }),

  addUserVehicle: (payload: {
    vehicle_id?: string;
    make: string;
    model: string;
    year: number;
    engine: string;
    license_plate?: string;
    vin?: string;
    nickname?: string;
    is_default?: boolean;
  }) =>
    request<{ vehicle: UserVehicle }>("/garage/vehicles", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  deleteUserVehicle: (id: string) =>
    request<{ status: string }>(`/garage/vehicles/${id}`, { method: "DELETE" }),

  setDefaultUserVehicle: (id: string) =>
    request<{ status: string }>(`/garage/vehicles/${id}/default`, { method: "PATCH" }),
};
