import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import instance from "@/api/instance";

import { ApiResponse, UpdateDataParams } from "./type";

const usePatchData = <TPayload = unknown, TData = unknown>({
  url,
  enabled = true,
  mutationOptions = {},
  showToast = true,
}: {
  url: string;
  enabled?: boolean;
  mutationOptions?: UseMutationOptions<
    TData,
    Error,
    TPayload | UpdateDataParams<TPayload>
  >;
  showToast?: boolean;
}) => {
  const mutation = useMutation<
    TData,
    Error,
    TPayload | UpdateDataParams<TPayload>
  >({
    mutationFn: async (variables) => {
      // Check if variables has the UpdateDataParams structure (with id, payload, headers)
      const isUpdateDataParams =
        typeof variables === "object" &&
        variables !== null &&
        "id" in variables &&
        "payload" in variables;

      let finalUrl = url;
      let finalPayload: TPayload;
      let finalHeaders: Record<string, string> | undefined;

      if (isUpdateDataParams) {
        const { id, payload, headers } =
          variables as UpdateDataParams<TPayload>;
        finalUrl = `${url}${String(id)}`;
        finalPayload = payload;
        finalHeaders = headers;
      } else {
        // Direct payload without id
        finalPayload = variables as TPayload;
      }

      const response = await instance.patch<ApiResponse<TData>>(
        finalUrl,
        finalPayload,
        {
          headers: finalHeaders,
        },
      );

      if (!response.data?.error) {
        if (showToast) {
          toast.success(response.data?.message || "Updated successfully.");
        }
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

export default usePatchData;
