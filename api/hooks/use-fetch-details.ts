import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import instance from "@/api/instance";

import { ApiResponse } from "./type";

interface UseFetchDetailsProps<T> {
  url: string;
  id?: string | number;
  queryOptions?: any;
  enabled?: boolean;
}

function useFetchDetails<T>({
  url,
  id,
  queryOptions = {},
  enabled,
}: UseFetchDetailsProps<T>): UseQueryResult<T> {
  return useQuery({
    queryKey: [url, id],
    queryFn: async (): Promise<T> => {
      try {
        const response = await instance.get<ApiResponse<T>>(
          id !== undefined ? `${url}${String(id)}` : url
        );

        if (response?.data?.statusCode >= 200 && response?.data?.statusCode < 300) {
          return response.data.data;
        } else {
          throw new Error(response?.data?.message ?? "An unknown error occurred");
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || error.message || "Something went wrong!";
        toast.error(errorMessage);
        throw error;
      }
    },
    enabled: enabled ?? (id !== undefined || url !== undefined),
    retry: 1,
    refetchOnWindowFocus: false,
    ...queryOptions,
  }) as UseQueryResult<T>;
}

export default useFetchDetails;
