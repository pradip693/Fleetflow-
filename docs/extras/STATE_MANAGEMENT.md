# Global State Management (Zustand)

This document describes how global state is handled using **Zustand**, particularly focusing on store structure, persistence, and access patterns.

## 1. Why Zustand?

Zustand is used because it is lightweight, has a simple hook-based API, and performs significantly better than React Context for frequently updated global state.

## 2. Store Organization

All global stores are located in the `stores/` directory.

- `stores/auth-store.ts`: Manages user authentication, session tokens, and identity.
- (Recommended): Create separate files for separate domains (e.g., `theme-store.ts`, `cart-store.ts`).

## 3. Creating a New Store

When creating a new store, follow this pattern:

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UIState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: "ui-storage", // Key for localStorage
      storage: createJSONStorage(() => localStorage), // Defaults to localStorage
    }
  )
);
```

## 4. State Persistence

We use the `persist` middleware to save state across page refreshes.
- **Serialization**: Data is automatically stringified and stored in `localStorage`.
- **Hydration**: When the app loads, Zustand automatically reloads the state from storage.

## 5. Accessing State

### Inside Components (Hooks)
The standard way to access state is via a hook. Always select only the properties you need to avoid unnecessary re-renders.

```tsx
// Good: Selected specifically
const sidebarOpen = useUIStore((state) => state.sidebarOpen);

// Bad: Destructuring the whole store (triggers re-render on ANY change)
const { sidebarOpen } = useUIStore();
```

### Outside Components (Direct Access)
Sometimes you need state in a non-React file (like `instance.ts`). In these cases, use the `.getState()` method.

```typescript
// Used in API instance
const token = useAuthStore.getState().accessToken;
```

## 6. Best Practices

1.  **Immutability**: Never mutate state directly. Always use the `set()` function.
2.  **Selectors**: Use selectors (e.g., `(state) => state.id`) to keep components performant.
3.  **Local vs Global**: Only put data in Zustand if multiple distant components need it. If it's only for a single form or page, use `useState`.
