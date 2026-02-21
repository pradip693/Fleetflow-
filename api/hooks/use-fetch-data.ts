import { type UseQueryOptions, useQuery } from "@tanstack/react-query";

import instance from "@/api/instance";

interface ApiResponse<T = any> {
  error: boolean;
  message: string;
  statusCode: number;
  data: T;
}

/**
 * **Build Query String Helper**
 */
function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

/**
 * **useFetchData Hook**
 */
export function useFetchData<
  TData = unknown,
  TParams = Record<string, unknown>,
>({
  url,
  params = {} as TParams,
  queryOptions = {},
  enabled = true,
}: {
  url: string;
  params?: TParams;
  queryOptions?: Omit<
    UseQueryOptions<TData, Error, TData>,
    "queryKey" | "queryFn"
  >;
  enabled?: boolean;
}) {
  return useQuery<TData, Error>({
    queryKey: [url, params],
    queryFn: async (): Promise<TData> => {
      const queryString = buildQueryString(params as Record<string, unknown>);
      const fullUrl = `${url}${queryString}`;

      try {
        const response = await instance.get<ApiResponse<TData>>(fullUrl);
        
        if (response?.data?.data !== undefined) {
          return response.data.data;
        }
        
        if (response?.data !== undefined) {
          return response.data as TData;
        }
        
        throw new Error("Invalid response structure");
        
      } catch (error: any) {
        console.error("🔧 useFetchData - Error:", error);
        
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
        
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: enabled,
    staleTime: 0,
    ...queryOptions,
  });
}
