export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/signin",
    LOGOUT: "auth/logout",
    CHANGE_PASSWORD: "auth/change-password",
  },
  USERS: {
    BASE: "/users",
    DETAIL: (id: string) => `/users/${id}`,
  },
  PROFILE: {
    BASE: "/profile",
    UPDATE: "/profile",
  },
} as const;
