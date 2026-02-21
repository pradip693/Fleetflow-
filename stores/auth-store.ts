import Cookies from "js-cookie";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
  role: {
    name: string;
  };
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: Cookies.get("accessToken") || null,
      setAuth: (user, token) => {
        Cookies.set("accessToken", token, { expires: 7 });
        set({ user, accessToken: token });
      },
      clearAuth: () => {
        Cookies.remove("accessToken");
        set({ user: null, accessToken: null });
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
