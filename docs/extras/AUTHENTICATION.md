# Authentication and Security

This document explains the authentication flow, session management, and route protection mechanisms in the `nextjs-2` boilerplate.

## 1. Authentication Flow

The application uses **JWT (JSON Web Token)** for authentication.

1.  **Login**: The user submits credentials via the `LoginForm`.
2.  **Success**: On a successful login:
    - The **Access Token** and **User Info** are stored in the **Zustand Auth Store** (`stores/auth-store.ts`).
    - The `accessToken` is also stored in a **Cookie** (managed via `js-cookie`) for middleware access.
3.  **Persistence**: The Zustand store is configured with `persist` middleware, so the user remains logged in after a page refresh.

## 2. Route Protection (`proxy.ts`)

Access control is managed in `proxy.ts`, which acts as the application gateway.

### Logic Summary:
- **Public Routes**: Defined in `PUBLIC_ROUTES` (e.g., `/login`). These are always accessible.
- **Authenticated Check**: The proxy checks for the `accessToken` in the request cookies.
- **Guest Access**: If an unauthenticated user tries to access a protected route (e.g., `/admin`), they are redirected to `/login` with a `callbackUrl` so they return to their previous location after logging in.
- **Logged-in Access**: If an authenticated user tries to access `/login`, they are automatically redirected to the dashboard (`/admin`).

## 3. The Auth Store (`stores/auth-store.ts`)

The `useAuthStore` is the single source of truth for the user's session state.

```typescript
const { user, accessToken, setAuth, clearAuth } = useAuthStore();
```

*   `setAuth(user, token)`: Updates the global state and persists the token.
*   `clearAuth()`: Resets the state, clears cookies, and removes persisted data (used for logout).

## 4. API Authorization (`api/instance.ts`)

The Axios instance is connected to the Auth Store via a **Request Interceptor**.

```typescript
instance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```
This ensures that every request sent from the app automatically includes the required security headers without manual intervention.

## 5. Token Expiry & Auto-Logout

The boilerplate handles session expiry via **Response Interceptors**:
- If the API returns a `401 Unauthorized` or `440 Session Expired` status code, the interceptor automatically calls `clearAuth()` and redirects the user to the login page.

## 6. Static vs. API Mode

In the current boilerplate configuration:
- The real API login services are commented out.
- The system validates against static credentials: `admin@feetflow.in` / `Test@123`.
- To re-enable API authentication, uncomment the `mutate` logic in `features/auth/hooks/use-login-form.ts`.
