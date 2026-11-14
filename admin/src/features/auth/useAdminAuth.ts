"use client";

import { create } from "zustand";
import { adminAuthApi, AdminUser } from "@/lib/api";

interface AdminAuthState {
  admin: AdminUser | null;
  isLoading: boolean;
  setAdmin: (admin: AdminUser | null) => void;
  fetchAdmin: () => Promise<AdminUser | null>;
  logout: () => Promise<void>;
}

// useAdminAuth coordinates authentication state and role verification for admin dashboard.
export const useAdminAuth = create<AdminAuthState>((set) => ({
  admin: null,
  isLoading: true,
  setAdmin: (admin) => set({ admin, isLoading: false }),

  fetchAdmin: async () => {
    try {
      const res = await adminAuthApi.getMe();
      if (res.user.role === "ADMIN" || res.user.role === "STAFF") {
        set({ admin: res.user, isLoading: false });
        return res.user;
      }
      set({ admin: null, isLoading: false });
      return null;
    } catch {
      set({ admin: null, isLoading: false });
      return null;
    }
  },

  logout: async () => {
    try {
      await adminAuthApi.logout();
    } finally {
      set({ admin: null, isLoading: false });
    }
  },
}));

