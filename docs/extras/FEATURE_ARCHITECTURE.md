# Feature-Based Architecture

This document explains the "Feature-First" methodology used in this project to ensure scalability, ease of maintenance, and high modularity.

## 1. The Core Philosophy

Instead of grouping files by their **technical type** (e.g., all components in one folder, all hooks in another), we group them by **domain logic**. 

- **Global**: Only truly universal items (e.g., a generic `Button` or an `AuthStore`) live in the root `components/` or `stores/` directories.
- **Features**: Everything related to a specific business unit (e.g., `Users`, `Products`, `Orders`) is contained within a dedicated folder in `features/`.

## 2. Directory Structure

A standard feature folder looks like this:

```
features/inventory/
├── components/       # Feature-specific UI (InventoryTable, WarehouseCard)
├── hooks/            # Hooks used only in this feature (useInventoryLogic)
├── services/         # API hooks (wrappers around useFetchData/usePostData)
├── types/            # Module-specific interfaces and types
├── schemas/          # Zod validation schemas for this module's forms
├── actions/          # (Optional) Server actions or specialized logic
└── utils/            # (Optional) Logic specific only to this domain
```

## 3. Benefits of this Pattern

1.  **Isolation**: Changes to the `Users` feature are guaranteed not to break the `Orders` feature.
2.  **Scalability**: Adding a new module is as easy as creating a new folder in `features/`.
3.  **Portability**: It is much easier to move or delete a feature because all related dependencies are localized.
4.  **Finding Code**: Developers know exactly where to look for the "Inventory Form" without searching through a 100-file `components` directory.

## 4. Cross-Feature Interoperability

While isolation is preferred, features often need to interact.
- **Rule**: A feature can import types or generic hooks from another feature, but try to avoid heavy UI component cross-imports.
- **Common Solution**: If a component is needed by multiple features, move it to the global `components/shared/` directory.

## 5. Implementation Guide

When starting a new feature (e.g., `reports`):
1.  Add the endpoints to `api/endpoints.ts`.
2.  Create `features/reports/`.
3.  Define types in `features/reports/types/reports.ts`.
4.  Create listing components in `features/reports/components/reports-table.tsx`.
5.  Export the main view to be used in `/app/admin/reports/page.tsx`.
