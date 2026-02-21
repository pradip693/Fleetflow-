# CRUD Development Guide

This guide explains how to build a complete CRUD (Create, Read, Update, Delete) module in the `nextjs-2` boilerplate using our standardized patterns.

---

## 1. Feature Folder Structure

Group all logic by feature inside the `features/` directory. For a new `products` module:

```
features/products/
├── actions/          # API Service Hooks (Individual hooks for CRUD)
├── components/       # UI Components
│   ├── product-dialog.tsx
│   ├── products-table.tsx
│   └── products-table.columns.tsx # Column definitions
├── hooks/            # Feature-specific logic hooks
├── types/            # TypeScript interfaces
└── schema/           # Zod validation schemas
```

---

## 2. Define API Endpoints

Register your endpoints in `api/endpoints.ts` to maintain a single source of truth for URLs.

```typescript
// api/endpoints.ts
export const API_ENDPOINTS = {
  PRODUCTS: {
    CREATE: "/products/add",
    LIST: "/products/list",
    DETAILS: "/products/details",
    UPDATE: "/products/update",
    DELETE: "/products/delete",
  },
} as const;
```

---

## 3. Types and Validation Schema

### Type Definition
```typescript
// features/products/types/product.types.ts
export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
}
```

### Zod Schema
```typescript
// features/products/schema/product.schema.ts
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().min(0.01),
});

export type ProductFormValues = z.infer<typeof productSchema>;
```

---

## 4. API Service Hooks (Actions)

Create customized hooks in the `actions/` folder of your feature. These hooks wrap the global API utilities.

```typescript
// features/products/actions/products.action.ts
import { API_ENDPOINTS } from "@/api/endpoints";
import useDeleteData from "@/api/hooks/use-delete-data";
import { useFetchData } from "@/api/hooks/use-fetch-data";
import usePostData from "@/api/hooks/use-post-data";
import usePatchData from "@/api/hooks/use-patch"; // Or useUpdateData depending on implementation

export const useCreateProduct = () => {
  return usePostData({
    url: API_ENDPOINTS.PRODUCTS.CREATE,
  });
};

export const useProductList = (params: any) => {
  return useFetchData<ProductListResponse>({
    url: API_ENDPOINTS.PRODUCTS.LIST,
    params,
  });
};

export const useUpdateProduct = () => {
  return usePatchData({
    url: API_ENDPOINTS.PRODUCTS.UPDATE,
  });
};

export const useDeleteProduct = () => {
  return useDeleteData({
    url: API_ENDPOINTS.PRODUCTS.DELETE,
  });
};
```

---

## 5. Implementation: Table Columns

Store column definitions in a separate file to keep the table component clean. Use the global `TableActions` component for consistent row actions.

```tsx
// features/products/components/products-table.columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { TableActions } from "@/components/table/table-actions";
import { Product } from "../types/product.types";

export const getProductColumns = (
  onEdit: (product: Product) => void,
  onDelete: (id: string) => void
): ColumnDef<Product>[] => [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "price", header: "Price" },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <TableActions
        onEdit={() => onEdit(row.original)}
        onDelete={() => onDelete(row.original.id)}
      />
    ),
  },
];
```

---

## 6. Implementation: The Listing View

Wrap everything together using `useDataTable` and `GlobalTable`.

```tsx
// features/products/components/products-table.tsx
import { useDataTable } from "@/hooks/use-data-table";
import { GlobalTable } from "@/components/table/global-table";
import { useProductList, useDeleteProduct } from "../actions/products.action";
import { getProductColumns } from "./products-table.columns";

export const ProductsTable = () => {
  const { apiParams, handlePageChange, handleSearch } = useDataTable();
  const { data, isLoading, refetch } = useProductList(apiParams);
  const { mutate: deleteProduct } = useDeleteProduct();

  const handleEdit = (product: any) => {
    // Open Edit Dialog
  };

  const handleDelete = (id: string) => {
    deleteProduct(id, { onSuccess: () => refetch() });
  };

  const columns = getProductColumns(handleEdit, handleDelete);

  return (
    <GlobalTable
      data={data?.items ?? []}
      columns={columns}
      loading={isLoading}
      totalCount={data?.total ?? 0}
      currentPage={apiParams.page}
      pageSize={apiParams.limit}
      onPageChange={handlePageChange}
      filters={[
        { key: "search", type: "search", label: "Product", value: apiParams.search ?? "", onChange: handleSearch }
      ]}
    />
  );
};
```

---

## 6. Implementation: The Form (Create/Edit)

Use `AppFormContainer` for the layout shell and `react-hook-form` for logic.

```tsx
// features/products/components/product-form.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppFormContainer } from "@/components/shared/app-form-container";
import { productSchema, ProductFormValues } from "../schema/product.schema";
import { useProducts } from "../hooks/use-products";

export const ProductForm = ({ initialData, isEdit }: { initialData?: any, isEdit?: boolean }) => {
  const { useCreateProduct, useUpdateProduct } = useProducts();
  const { mutate: create } = useCreateProduct();
  const { mutate: update } = useUpdateProduct();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ?? { name: "", price: 0, status: "active" },
  });

  const onSubmit = (values: ProductFormValues) => {
    if (isEdit) {
      update({ id: initialData.id, payload: values });
    } else {
      create(values);
    }
  };

  return (
    <AppFormContainer
      title={isEdit ? "Edit Product" : "Create Product"}
      formId="product-form"
      closeHref="/admin/products"
      actions={
        <button type="submit" form="product-form" className="btn-primary">
          Save Changes
        </button>
      }
    >
      <form id="product-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <input {...form.register("name")} placeholder="Product Name" />
        <input type="number" {...form.register("price")} placeholder="Price" />
        {/* ... other fields */}
      </form>
    </AppFormContainer>
  );
};
```

---

## 7. Refetch and Sync Logic

1.  **Cache Keys**: Ensure the `url` and `params` used in `useFetchData` are consistent.
2.  **`refetchQueries`**: When creating or updating, use the `refetchQueries` property in mutation hooks to automatically refresh the table.
3.  **Global TableActions**: Always use the `TableActions` component in `components/table/table-actions.tsx` to ensure Edit and Delete actions look and behave the same across all modules.

---

## 8. Summary Checklist

1. [ ] Add endpoints to `api/endpoints.ts`.
2. [ ] Create Types + Zod Schema.
3. [ ] Create Feature Action Hook (wrapping global hooks).
4. [ ] Implement `GlobalTable` with `useDataTable`.
5. [ ] Implement `AppFormContainer` for Create/Edit views.
6. [ ] Ensure `refetchQueries` matches the fetch URL.

