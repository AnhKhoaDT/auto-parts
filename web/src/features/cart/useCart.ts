"use client";

import { useState, useEffect, useCallback } from "react";

export interface CartCompatibility {
  make: string;
  model: string;
  year_from?: number;
  year_to?: number;
  engine?: string;
}

export interface CartItem {
  id: string;
  slug: string;
  oem_number: string;
  name: string;
  brand_name: string;
  image_url?: string;
  grade: string;
  retail_price: number;
  wholesale_price: number;
  quantity: number;
  stock_quantity: number;
  warranty_months: number;
  compatibilities?: CartCompatibility[];
}

export type FitmentCheckResult = "COMPATIBLE" | "INCOMPATIBLE" | "UNKNOWN";

const CART_STORAGE_KEY = "kv_cart_items";
const CART_EVENT_NAME = "kv_cart_updated";

// Default initial items for demo and smooth first-load experience.
const DEFAULT_INITIAL_ITEMS: CartItem[] = [
  {
    id: "d0000000-0000-0000-0000-000000000001",
    slug: "bo-ma-phanh-truoc-denso-japan-04465-0d150",
    oem_number: "04465-0D150",
    name: "Bộ Má Phanh Trước Denso Japan Chuẩn OEM",
    brand_name: "Denso Japan",
    grade: "OEM_GENUINE",
    retail_price: 450000,
    wholesale_price: 370000,
    quantity: 1,
    stock_quantity: 45,
    warranty_months: 12,
    compatibilities: [
      { make: "Toyota", model: "Vios", year_from: 2018, year_to: 2023, engine: "1.5L 2NR-FE (Xăng)" },
    ],
  },
  {
    id: "d0000000-0000-0000-0000-000000000002",
    slug: "bugi-iridium-chan-dai-denso-sc20hr11",
    oem_number: "90919-01253",
    name: "Bugi Iridium Chân Dài Denso SC20HR11",
    brand_name: "Denso Japan",
    grade: "OEM_GENUINE",
    retail_price: 220000,
    wholesale_price: 175000,
    quantity: 4,
    stock_quantity: 120,
    warranty_months: 24,
    compatibilities: [
      { make: "Toyota", model: "Vios", year_from: 2018, year_to: 2023, engine: "1.5L 2NR-FE (Xăng)" },
      { make: "Toyota", model: "Corolla Cross", year_from: 2020, year_to: 2024, engine: "1.8L 2ZR-FE" },
    ],
  },
];

// Helper to read items safely from localStorage.
function readCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      // Seed default items on very first visit
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(DEFAULT_INITIAL_ITEMS));
      return DEFAULT_INITIAL_ITEMS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Helper to write items and notify all active tabs.
function writeCartToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(CART_EVENT_NAME));
  } catch {
    // Fail-safe if storage quota exceeded
  }
}

// checkFitmentAgainstCar verifies if a cart item matches the active garage vehicle string.
export function checkFitmentAgainstCar(item: CartItem, activeCarFilter: string): FitmentCheckResult {
  if (!activeCarFilter || activeCarFilter.trim() === "") return "UNKNOWN";
  if (!item.compatibilities || item.compatibilities.length === 0) return "UNKNOWN";

  const lower = activeCarFilter.toLowerCase();
  const isMatch = item.compatibilities.some((c) => {
    const makeMatch = lower.includes(c.make.toLowerCase());
    const modelMatch = lower.includes(c.model.toLowerCase());
    return makeMatch && modelMatch;
  });

  return isMatch ? "COMPATIBLE" : "INCOMPATIBLE";
}

// useCart hook provides reactive cart state management and persistence.
export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const syncState = useCallback(() => {
    setItems(readCartFromStorage());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    syncState();

    const handleUpdate = () => syncState();
    window.addEventListener(CART_EVENT_NAME, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(CART_EVENT_NAME, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [syncState]);

  const addToCart = (newItem: Omit<CartItem, "quantity">, quantity = 1) => {
    const current = readCartFromStorage();
    const existingIndex = current.findIndex((i) => i.id === newItem.id);

    let updated: CartItem[];
    if (existingIndex >= 0) {
      updated = [...current];
      const existing = updated[existingIndex];
      const newQty = Math.min(existing.quantity + quantity, existing.stock_quantity || 999);
      updated[existingIndex] = { ...existing, quantity: newQty };
    } else {
      updated = [...current, { ...newItem, quantity }];
    }

    writeCartToStorage(updated);
    setItems(updated);
  };

  const updateQuantity = (id: string, quantity: number) => {
    const current = readCartFromStorage();
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    const updated = current.map((item) => {
      if (item.id === id) {
        const capped = Math.min(quantity, item.stock_quantity || 999);
        return { ...item, quantity: capped };
      }
      return item;
    });

    writeCartToStorage(updated);
    setItems(updated);
  };

  const removeFromCart = (id: string) => {
    const current = readCartFromStorage();
    const updated = current.filter((i) => i.id !== id);
    writeCartToStorage(updated);
    setItems(updated);
  };

  const clearCart = () => {
    writeCartToStorage([]);
    setItems([]);
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalRetail = items.reduce((sum, item) => sum + item.retail_price * item.quantity, 0);
  const subtotalWholesale = items.reduce((sum, item) => sum + item.wholesale_price * item.quantity, 0);

  return {
    items,
    isLoaded,
    cartCount,
    subtotalRetail,
    subtotalWholesale,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    checkFitment: checkFitmentAgainstCar,
  };
}

