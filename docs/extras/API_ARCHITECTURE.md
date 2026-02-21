# API Architecture and Data Fetching

This document explains the technical implementation of the API layer, including Axios configuration, endpoint management, and custom React Query hooks.

## 1. Centralized Axios Instance (`api/instance.ts`)

We use a single Axios instance for all requests. This ensures global configuration and standardized header management.

### Features:
- **Base URL**: Automatically pulled from `process.env.NEXT_PUBLIC_API_URL`.
- **Request Interceptor**: Injects the `Authorization` bearer token from the global Zustand store.
- **Response Interceptor**: Handles global error states (401/440) by triggering a logout and redirecting to the login page.

## 2. Endpoint Management (`api/endpoints.ts`)

All API paths are centralized in a single constant object. **Never hardcode URLs in your components.**

```typescript
// Good usage:
url: API_ENDPOINTS.USERS.BASE
```

## 3. Custom Query/Mutation Hooks

To simplify data fetching, we wrap `@tanstack/react-query` with custom logic. These hooks are located in `api/hooks/`.

### `useFetchData` (GET)
Used for fetching resources.
- **Query Key Management**: Automatically builds query keys based on the URL and parameters to ensure correct caching.
- **Param Serialization**: Includes a helper to clean and serialize parameters into a query string.

### `usePostData` (POST)
Used for creating resources.
- **Auto-Toasts**: Shows a "Success" notification using `sonner` automatically.
- **Cache Invalidation**: Accepts a `refetchQueries` array to refresh specific data after a post succeeds.
- **Form Data Support**: Has a `useFormData` flag to switch content types for file uploads.

### `usePatchData` & `useUpdateData` (PATCH/PUT)
Used for updating resources.
- Similar to `usePostData`, but specifically designed to handle single resource updates (often requiring an ID).

### `useDeleteData` (DELETE)
Used for removing resources.
- Standardized deletion flow with automatic toast confirmation.

## 4. Response Standardization

The hooks expect a standardized JSON response from the backend:
```json
{
  "error": false,
  "message": "Success message",
  "statusCode": 200,
  "data": { ... }
}
```
If your backend uses a different structure, you should adjust the logic in `api/hooks/type.ts` and the fetch hooks accordingly.

## 5. Typical Usage Pattern

```tsx
// 1. Fetching a list with parameters
const { data, isLoading } = useFetchData({
  url: API_ENDPOINTS.PRODUCTS.BASE,
  params: { page: 1, limit: 10 }
});

// 2. Performing a mutation
const { mutate } = usePostData({
  url: API_ENDPOINTS.PRODUCTS.BASE,
  refetchQueries: [API_ENDPOINTS.PRODUCTS.BASE]
});
```
