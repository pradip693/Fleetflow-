# Development Workflow

This document outlines the standard tools and commands used for development, code maintenance, and ensuring code quality.

## 1. Package Management

We use **pnpm** as our exclusive package manager.

- **Sync dependencies**: `pnpm install`
- **Add a package**: `pnpm add <name>`
- **Add a dev dependency**: `pnpm add -D <name>`

## 2. Environment Management

The project uses `scripts/check-env.mjs` to verify environment variables before the app starts.
- Ensure you have a `.env.local` for local development.
- For staging or production runs, ensure the respective env variables are correctly configured in the environment.

## 3. Maintenance Tools

### Knip
We use **Knip** to detect unused files, dependencies, and exports. This keeps the bundle size small and the codebase clean.

- **Analysis**: `pnpm knip`
- **Automatic Fixes**: `pnpm knip:fix`

### Linting & Formatting
- **Lint**: `pnpm lint` (Uses Next.js build-in ESLint rules and our custom overrides).
- **Formatting**: We use **Prettier** for a consistent code style across the entire team.

## 4. Feature-Based Development

When starting a new feature, always follow the **feature-based folder structure** within `features/`. This keeps the routes (`app/`) clean and ensures all feature logic is easy to locate and move if necessary.

## 5. IDE Support (VS Code)

For the best experience, please install the recommended extensions in `.vscode/extensions.json`:
- **ESLint**: Shows real-time rule violations.
- **Prettier**: Formats your code on every save.
- **Tailwind CSS IntelliSense**: Essential for working with Tailwind v4 (hover over classes to see CSS and get autocomplete).
- **Error Lens**: Displays errors inline so you don't have to check the terminal as often.

## 6. Development Cycle

1.  **Pull changes**: `git pull`
2.  **Sync deps**: `pnpm i`
3.  **Run dev server**: `pnpm dev` (Uses Turbopack for near-instant compiles).
4.  **Before pushing**:
    - Run `pnpm lint`
    - Run `pnpm knip`
    - Run `pnpm build` (to ensure no TypeScript or build errors exist).
