import { create } from "zustand";

// Demo sessions live in memory and expire on reload; never persist bearer tokens.
localStorage.removeItem("token");
localStorage.removeItem("auth-storage");
export const useAuthStore = create((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  login: (token, user) => set({ token, user, isAuthenticated: true }),
  logout: () => set({ token: null, user: null, isAuthenticated: false }),
}));
