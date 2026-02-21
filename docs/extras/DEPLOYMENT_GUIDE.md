# Deployment and Build Guide

This document describes how to build the application for different environments and deploy it using PM2.

## 1. Environment Build Targets

We support three main environment targets, each with its own execution and build script.

### Local / Generic
- **Run**: `pnpm dev`
- **Build**: `pnpm build`

### Staging
- **Run**: `pnpm staging`
- **Build**: `pnpm staging:build`

### Production
- **Run**: `pnpm production`
- **Build**: `pnpm production:build`

## 2. Shared Scripts (`package.json`)

The boilerplate includes standardized deployment scripts for consistent CI/CD pipelines:
- `pnpm deploy:install`: Installs dependencies with a frozen lockfile.
- `pnpm deploy:build`: Triggers a production-level build.
- `pnpm deploy`: Combines installation and build steps.

## 3. PM2 Integration

For production servers, we use **PM2** to manage the process, handle auto-restarts on failure, and manage logs.

- **Start with PM2**: `pnpm pm2:deploy`
- This command internally runs `pnpm deploy` and follows up with `pm2 start ecosystem.config.js`.

### PM2 Configuration (`ecosystem.config.js`)
Ensure your ecosystem config is set up with the correct:
- `name`: (e.g., `admin-panel`)
- `script`: `npm run start` (or `pnpm start`)
- `instances`: Usually `max` or a specific number based on CPU cores.
- `env`: Environment variables or paths to `.env` files.

## 4. Environment Variables

Ensure your production server has the following variables configured (via `.env.production` or provider settings):

- `NEXT_PUBLIC_API_URL`: The base URL for the backend.
- `NODE_ENV`: Set to `production`.

## 5. Directory Mapping

- **Output**: The production build resides in the `.next` folder.
- **Static Assets**: All public assets remain in the `public/` directory and are automatically served by the Next.js production server.

## 6. Optimization Note

The project uses the `optimizePackageImports` experiment (visible in `next.config.mjs`) to ensure that importing individual components from large libraries (like `lucide-react`) doesn't bloat the entry bundle.
