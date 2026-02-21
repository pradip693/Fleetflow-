import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import instance from "@/api/instance";

import { ApiResponse, UpdateDataParams } from "./type";

const useUpdateData = <TPayload = unknown, TData = unknown>({
  url,
  mutationOptions = {},
  useFormData = false,
}: {
  url: string;
  mutationOptions?: UseMutationOptions<TData, Error, UpdateDataParams<TPayload>>;
  useFormData?: boolean;
}) => {
  return useMutation<TData, Error, UpdateDataParams<TPayload>>({
    mutationFn: async ({ id, payload, headers }) => {
      const finalHeaders = {
        ...headers,
        ...(useFormData ? { "Content-Type": "multipart/form-data" } : {}),
      };
      const response = await instance.patch<ApiResponse<TData>>(`${url}${String(id)}`, payload, {
        headers: finalHeaders,
      });
      if (!response.data?.error) {
        toast.success(response.data?.message || "Updated successfully.");
        return response.data?.data as TData;
      }
      throw new Error(response.data?.message || "Failed to update resource.");
    },
    ...mutationOptions,
    retry: false,
  });
};

export default useUpdateData;
