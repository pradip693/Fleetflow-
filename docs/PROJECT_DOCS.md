# Project Documentation: Next.js Boilerplate

This documentation provides an exhaustive guide to the architecture, development standards, and operational workflows of the `nextjs-2` project.

---

## 🛠 Tech Stack Overview

- **Framework**: Next.js 16.1.6 (App Router) with Turbopack.
- **UI Architecture**: **Shadcn UI** built with **Base UI** (`@base-ui/react`) and **Tailwind CSS v4**.
  - *Note*: This project uses Base UI primitives for its components instead of Radix UI.
- **Data Fetching**: Axios + TanStack React Query v5.
- **State Management**: Zustand (with localStorage persistence).
- **Forms**: React Hook Form + Zod validation.
- **Development Tools**: Knip (unused code detection), ESLint, Prettier.

---

## 🚀 Getting Started

### 📦 Package Management
Always use **pnpm** as the package manager (`npx only-allow pnpm` is enforced).

- **Install Dependencies**: `pnpm i` or `pnpm install`
- **Add a Package**: `pnpm add <package-name>`
- **Add a Dev Dependency**: `pnpm add -D <package-name>`
- **Add Shadcn UI Component**: `pnpm dlx shadcn@latest add <component-name>`
  - *Note: New components are added to `components/ui/` and use Base UI primitives.*

### 🛠 Visual Studio Code Setup
To maintain code quality and style, please install the recommended extensions from `.vscode/extensions.json`:
1. **ESLint**: Enforces coding rules defined in `eslint.config.mjs`.
2. **Prettier**: Enforces consistent code formatting on save.
3. **Tailwind CSS IntelliSense**: Autocomplete for styles (Vital for Tailwind v4).
4. **Error Lens**: Highlights errors directly in the editor for faster debugging.

---

## 🏗 Project Structure

The project follows a **Feature-based Architecture** to keep the code modular and scalable.

### 📂 Directory Layout
- `api/`: Global API instance (`instance.ts`), endpoints (`endpoints.ts`), and generic hooks.
- `app/`: Next.js App Router (routes and layouts).
- `components/`:
  - `shared/`: Generic reusable components (e.g., `AppFormContainer`).
  - `table/`: Implementation of the `GlobalTable`.
  - `ui/`: Base UI primitives (Shadcn components).
- `features/`: Module-based logic (Auth, Users, Profile).
- `hooks/`: Global utility hooks (e.g., `useDataTable`).
- `stores/`: Global state management with Zustand.
- `proxy.ts`: Centralized route protection and proxy logic.

### � Adding a New Feature
When adding a new module (e.g., `products`), create a corresponding folder in `features/products/` with the following sub-directories:
- `components/`: Specific UI components for this feature.
- `hooks/`: Feature-specific logic and hooks.
- `services/`: API request definitions for this feature.
- `types/`: TypeScript interfaces and definitions.
- `schemas/`: Zod validation schemas.

---

## 🌐 API & Data Integration

### 1. Axios Instance (`api/instance.ts`)
The API instance is configured with automatic **Security Interceptors**:
- **Token Injection**: Pulls the `accessToken` from the Zustand store and attaches it to request headers.
- **Error Handling**: Monitors for `401` or `440` responses to automatically clear local auth state and redirect to `/login`.

### 2. Mutation Hooks (e.g., `usePostData`)
API calls are wrapped in custom hooks found in `api/hooks/`.
- **Built-in Notifications**: Automatically displays success/error toasts using `sonner`.
- **Cache Invalidation**: Use the `refetchQueries` property to refresh specific data tags after a successful operation.

```typescript
const { mutate: addProduct } = usePostData({
  url: "/products",
  refetchQueries: ["products-list"], // Refresh the list after adding
});
```

---

## 📊 Tables & Data Management

The boilerplate uses a standardized pattern for handling complex data containers.

### 1. `useDataTable` Hook
Located in `hooks/use-data-table.ts`, this hook manages the state for pagination, search, and filtering. It returns `listParams` (for UI) and `apiParams` (formatted for API requests).

### 2. `GlobalTable` Component
Located in `components/table/global-table.tsx`, this is the primary wrapper for metadata-driven tables.
- **Features**: Built-in loading skeletons, multi-type filters (search, select, date range, multi-select), and standardized pagination.

**Usage Example:**
```tsx
const { apiParams, handlePageChange, handleSearch } = useDataTable();
const { data, isLoading } = useFetchData({ 
  url: "/items", 
  params: apiParams 
});

<GlobalTable
  data={data?.items ?? []}
  columns={columns}
  loading={isLoading}
  totalCount={data?.total ?? 0}
  currentPage={apiParams.page}
  pageSize={apiParams.limit}
  onPageChange={handlePageChange}
  filters={[
    { key: "search", type: "search", label: "Name", value: apiParams.search, onChange: handleSearch }
  ]}
/>
```

---

## 📝 Form Standard (`AppFormContainer`)

All application forms should be wrapped in `components/shared/app-form-container.tsx` to maintain UI consistency.

- **Layout**: Provides a standardized shell with a sticky header and footer for actions.
- **Modes**:
  - `fullScreen={true}`: Utilizes the full viewport for complex/massive forms.
  - Default: A centered card layout optimized for standard data entry.

---

## 🎨 Styling and Configuration (Tailwind CSS v4)

Tailwind CSS v4 configurations are managed directly in `app/globals.css`. There is no `tailwind.config.js` file.

- **Theme Management**: Tokens are defined using the `@theme inline` directive, mapping CSS variables to Tailwind classes.
- **Accessibility Scaling**: Global variables like `--font-size-multiplier` and `--spacing-multiplier` allow for real-time application-wide scaling adjustments.
- **Base Layer**: Standardized styles for borders, backgrounds, and scrollbars are enforced in the `@layer base` block.

---

## 🛡 Security & Route Protection

Route security is handled centrally in `proxy.ts`. It acts as a gatekeeper based on the presence of an `accessToken` cookie.

- **Public Routes**: Routes like `/login` and `/forgot-password` are defined as publicly accessible.
- **Redirection Logic**:
  - Authenticated users attempting to access public pages are redirected to `/admin`.
  - Unauthenticated users attempting to access protected routes are redirected to `/login` with a `callbackUrl` parameter.
- **Matcher**: The `config` in `proxy.ts` defines which paths are processed by the auth logic (excluding static assets).

---

## 🚦 Environments & Deployment

We use dedicated scripts for different environments. Ensure the corresponding `.env` files are configured.

### 🏃 Running
- **Development**: `pnpm dev`
- **Staging**: `pnpm staging`
- **Production**: `pnpm production`

### 🏗 Building
- **Standard Build**: `pnpm build`
- **Staging Build**: `pnpm staging:build`
- **Production Build**: `pnpm production:build`

---

## 🧹 Quality Control

### Knip
**Knip** is used to identify unused files, exports, and dependencies to keep the project lean.
- **Check**: `pnpm knip`
- **Auto-Fix**: `pnpm knip:fix`

### ESLint & Linting
- **Check**: `pnpm lint`
- Guidelines are enforced via configurations in `eslint.config.mjs`.

---

## 🔐 Current Configuration Note

The project is currently configured for a **Static Evaluation Mode**.

- **Authentication**: API-based login is commented out. Use the static credentials: `admin@feetflow.in` / `Test@123`.
- **Static Data**: Feature-specific tables currently utilize local dummy data while the API layer remains ready for backend integration.
