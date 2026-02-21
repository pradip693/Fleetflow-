"use client";

import { API_ENDPOINTS } from "@/api/endpoints";
import usePostData from "@/api/hooks/use-post-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "../schemas/profile.schema";

export function useChangePassword() {
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { mutate: changePassword, isPending } = usePostData({
    url: API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
    onSuccess: () => {
      toast.success("Password changed successfully");
      form.reset();
    },
    mutationOptions: {
      onError: (error: unknown) => {
        const message =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Failed to change password";
        toast.error(message);
      },
    },
  });

  const onSubmit = (data: ChangePasswordFormValues) => {
    changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending,
  };
}
