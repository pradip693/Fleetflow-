import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";

import { API_ENDPOINTS } from "@/api/endpoints";
import instance from "@/api/instance";
import { useAuthStore } from "@/stores/auth-store";

export function useLogout() {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: async () => {
      try {
        await instance.post(API_ENDPOINTS.AUTH.LOGOUT);
      } catch (error) {
        console.error("Logout API failed:", error);
      }
    },
    onSettled: () => {
      clearAuth();
      router.push("/");
    },
  });
}
