import { create } from "zustand";
import type { User } from "@/types";
import { API_URL } from "@/lib/utils";

interface UserStore {
  users: User[];
  isLoading: boolean;
  fetchUsers: () => Promise<void>;
  addUser: (user: Omit<User, "id">) => Promise<void>;
  updateUser: (id: number, data: Partial<User>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
}

export const useUserStore = create<UserStore>()((set) => ({
  users: [],
  isLoading: false,

  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_URL}/users`);
      const users = await res.json();
      set({ users, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addUser: async (user) => {
    const res = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    const newUser = await res.json();
    set((s) => ({ users: [...s.users, newUser] }));
  },

  updateUser: async (id, data) => {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const updated = await res.json();
    set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, ...updated } : u)) }));
  },

  deleteUser: async (id) => {
    await fetch(`${API_URL}/users/${id}`, { method: "DELETE" });
    set((s) => ({ users: s.users.filter((u) => u.id !== id) }));
  },
}));
