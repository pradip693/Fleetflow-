"use client";

import { API_ENDPOINTS } from "@/api/endpoints";
import usePostData from "@/api/hooks/use-post-data";
import useUpdateData from "@/api/hooks/use-update-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { userFormSchema } from "../schema/user.schema";
import { UserFormProps, UserFormValues } from "../types/user.types";

export interface UseUserFormReturn {
  form: UseFormReturn<UserFormValues>;
  onSubmit: (data: UserFormValues) => void;
  handleReset: () => void;
  isSubmitting: boolean;
  router: any;
}

export function useUserForm({
  mode,
  initialData,
  userId,
}: UserFormProps): UseUserFormReturn {
  const router = useRouter();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
      email: initialData?.email || "",
      password: "",
      bio: initialData?.bio || "",
      role: initialData?.role || "user",
      status: initialData?.status || "active",
      gender: initialData?.gender || "male",
      interests: initialData?.interests || [],
      newsletter: initialData?.newsletter ?? false,
      notifications: initialData?.notifications ?? true,
      avatar: initialData?.avatar || "",
      introVideo: initialData?.introVideo || "",
      voiceNote: initialData?.voiceNote || "",
      document: initialData?.document || "",
    },
  });

  const { mutate: createUser, isPending: isAdding } = usePostData({
    url: API_ENDPOINTS.USERS.BASE,
    onSuccess: () => {
      router.push("/admin/user");
    },
  });

  const { mutate: updateUser, isPending: isUpdating } = useUpdateData({
    url: API_ENDPOINTS.USERS.BASE + "/",
    mutationOptions: {
      onSuccess: () => {
        router.push("/admin/user");
      },
    },
  });

  const isSubmitting = isAdding || isUpdating;

  const onSubmit = (data: UserFormValues) => {
    // If password is empty string, remove it from payload when editing
    const payload = { ...data };
    if (mode === "edit" && !payload.password) {
      delete payload.password;
    }

    if (mode === "add") {
      createUser(payload as any);
    } else {
      updateUser({
        id: userId!,
        payload: payload as any,
      });
    }
  };

  return {
    form,
    onSubmit,
    handleReset: () => form.reset(),
    isSubmitting,
    router,
  };
}
