import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import instance from "@/api/instance";

import { ApiResponse, UpdateDataParams } from "./type";

const usePutData = <TPayload = unknown, TData = unknown>({
  url,
  enabled = true,
  mutationOptions = {},
}: {
  url: string;
  enabled?: boolean;
  mutationOptions?: UseMutationOptions<
    TData,
    Error,
    UpdateDataParams<TPayload>
  >;
}) => {
  const mutation = useMutation<TData, Error, UpdateDataParams<TPayload>>({
    mutationFn: async ({ id, payload, headers }) => {
      const response = await instance.put<ApiResponse<TData>>(
        `${url}${String(id)}`,
        payload,
        {
          headers,
        },
      );

      if (!response.data?.error) {
        toast.success(response.data?.message || "Updated successfully.");
        return response.data?.data as TData;
      }

      throw new Error(response.data?.message || "Failed to update resource.");
    },
    ...mutationOptions,
    retry: false,
  });

  if (!enabled) {
    return {
      ...mutation,
      mutate: () => {},
      mutateAsync: async () => {},
      isPending: false,
      isSuccess: false,
      isError: false,
      data: undefined,
      error: undefined,
      reset: mutation.reset,
      status: "idle",
    } as any;
  }

  return mutation;
};

export default usePutData;
