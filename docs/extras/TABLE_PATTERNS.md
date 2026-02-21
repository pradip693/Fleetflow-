# Table Patterns and GlobalTable Usage

This document explains how to use the `GlobalTable` component and the `useDataTable` hook to build powerful, listing-based interfaces.

## 1. Core Pattern

The listing pattern consists of two parts:
1.  **State Management**: `useDataTable` handles page numbers, search strings, and filter values.
2.  **UI Rendering**: `GlobalTable` handles the grid, pagination controls, and integrated filter inputs.

## 2. Using the `useDataTable` Hook

Located at `hooks/use-data-table.ts`, this hook maintains the synchronization between the UI filters and the API parameters.

```typescript
const { 
  apiParams,           // Object formatted for API requests (page, limit, search)
  handlePageChange,    // Updates current page
  handleSearch,        // Updates search query and resets to page 1
  handleSelectChange   // Updates custom filters (e.g., status, category)
} = useDataTable();
```

## 3. The `GlobalTable` Component

The `GlobalTable` (`components/table/global-table.tsx`) is a standardized wrapper for `TanStack Table`.

### Essential Props:
- `data`: Array of items to display.
- `columns`: Column definitions (use `@tanstack/react-table` structure).
- `loading`: Boolean to trigger skeleton states.
- `filters`: Array of filter configurations (see section below).
- `totalCount`: Total number of records (for pagination).

## 4. Configuring Filters

`GlobalTable` supports multiple filter types out of the box.

```tsx
filters={[
  {
    key: "search",
    type: "search", // Renders an Input field with a clear button
    label: "Name",
    value: apiParams.search ?? "",
    onChange: handleSearch,
  },
  {
    key: "role",
    type: "select", // Renders a Select dropdown
    label: "Role",
    options: [{ label: "Admin", value: "admin" }, { label: "User", value: "user" }],
    value: apiParams.role ?? "all",
    onChange: (val) => handleSelectChange("role", val),
  }
]}
```

### Supported Types:
- `search`: Standard text input.
- `select`: Dropdown for categorization.
- `dateRange`: Calendar-based range selection.
- `multiSelect`: Checkbox-based multiple selection.

## 5. Column Definitions

Define your columns outside the component for better readability.

```tsx
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Full Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "active" ? "default" : "secondary"}>
        {row.original.status}
      </Badge>
    )
  }
];
```

## 6. Skeletons and Loading States

The table automatically handles loading states. When `loading={true}` is passed:
- The body is cleared.
- A number of **Skeleton** rows (matching the current `pageSize`) are rendered.
- This provides a smooth "Shimmer" effect during data fetching.
