import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";

export interface ApiResponse<T> {
  error: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface PaginatedData<T> {
  data: T[];
  totalCount: number;
  page: number | string;
  limit: number | string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}

export interface UsePostDataProps<TData, TVariables> {
  url: string;
  useFormData?: boolean;
  showToast?: boolean;
  mutationOptions?: UseMutationOptions<TData, ApiError, TVariables>;
  headers?: Record<string, string>;
  refetchQueries?: string[];
  onSuccess?: (data: TData) => void;
  customCompanyId?: string;
  customGroupId?: string;
  sendPayloadInQueryParam?: boolean;
  useCompanyAsToken?: string;
}

export interface UseFetchDetailsProps<T> {
  url: string;
  id?: string | number;
  queryOptions?: Omit<UseQueryOptions<T, Error, T>, "queryKey" | "queryFn">;
  enabled?: boolean;
}

export interface UpdateDataParams<TPayload> {
  id: string | number;
  payload: TPayload;
  headers?: Record<string, string>;
}

export interface VariablesWithId {
  id?: string | number;
}
