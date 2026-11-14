"use client";

import { create } from "zustand";
import { authApi, User } from "@/lib/api";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

// useAuth manages global authentication state with cookie synchronization.
export const useAuth = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),

  fetchUser: async () => {
    try {
      const res = await authApi.getMe();
      set({ user: res.user, isLoading: false });
    } catch {
      set({ user: null, isLoading: false });
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      set({ user: null, isLoading: false });
    }
  },
}));

