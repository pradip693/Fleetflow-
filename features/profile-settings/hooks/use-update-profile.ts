"use client";

import useUpdateData from "@/api/hooks/use-update-data";
import { useAuthStore } from "@/stores/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  updateProfileSchema,
  type UpdateProfileFormValues,
} from "../schemas/profile.schema";

export function useUpdateProfile() {
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);
  const accessToken = useAuthStore((state) => state.accessToken);

  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      avatar: user?.avatar || "",
    },
  });

  const { mutate: updateProfile, isPending } = useUpdateData({
    url: "/profile",
    mutationOptions: {
      onSuccess: (data: unknown) => {
        toast.success("Profile updated successfully");
        // Update auth store with new user data
        if (user && accessToken && data) {
          setAuth(
            {
              ...user,
              ...(data as Partial<typeof user>),
            },
            accessToken,
          );
        }
      },
      onError: (error: unknown) => {
        const message =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Failed to update profile";
        toast.error(message);
      },
    },
  });

  const onSubmit = (data: UpdateProfileFormValues) => {
    if (!user?.user_id) {
      toast.error("User not found");
      return;
    }

    updateProfile({
      id: user.user_id,
      payload: data,
    });
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending,
    user,
  };
}
