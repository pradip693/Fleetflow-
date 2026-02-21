import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserRole } from "@/types";
import { API_URL } from "@/lib/utils";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch(`${API_URL}/users?email=${email}`);
          const users: User[] = await res.json();
          const user = users[0];
          if (user && user.password === password) {
            set({ user, isAuthenticated: true, isLoading: false, error: null });
            return true;
          }
          set({ isLoading: false, error: "Invalid email or password" });
          return false;
        } catch {
          set({ isLoading: false, error: "Server connection failed" });
          return false;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
      },

      hasRole: (roles: UserRole[]) => {
        const { user } = get();
        return user ? roles.includes(user.role) : false;
      },

      updateProfile: async (data: Partial<User>) => {
        const { user } = get();
        if (!user) return false;
        try {
          const res = await fetch(`${API_URL}/users/${user.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          const updated = await res.json();
          set({ user: { ...user, ...updated } });
          return true;
        } catch {
          return false;
        }
      },

      updatePassword: async (currentPassword: string, newPassword: string) => {
        const { user } = get();
        if (!user) return { success: false, error: "Not authenticated" };

        if (user.password !== currentPassword) {
          return { success: false, error: "Current password is incorrect" };
        }

        if (newPassword.length < 6) {
          return { success: false, error: "New password must be at least 6 characters" };
        }

        try {
          const res = await fetch(`${API_URL}/users/${user.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: newPassword }),
          });
          const updated = await res.json();
          set({ user: { ...user, ...updated } });
          return { success: true };
        } catch {
          return { success: false, error: "Failed to update password" };
        }
      },
    }),
    { name: "fleetflow-auth" }
  )
);
