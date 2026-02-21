# Troubleshooting and Debugging

This document provides tips for diagnosing and fixing common issues encountered during development.

## 1. Build Errors (TypeScript)

Build errors are usually caused by type mismatches in components used across the app (like Recharts or custom UI components).

- **How to fix**: Run `pnpm build` locally. The terminal output will give you exact line numbers and file paths for every TS error.
- **Common culprit**: Missing props or incorrect data structures passed to `GlobalTable`.

## 2. API Integration Issues

If your API calls are failing:
1.  **Check Interceptors**: Open `api/instance.ts` and ensure the `baseURL` is correct.
2.  **Network Tab**: Use Chrome DevTools (F12) > Network. Check the **Payload** and **Response** of the failed request.
3.  **Token Issues**: Ensure the `accessToken` is present in the "Headers" of the request. If missing, check the `AuthStore` logic.

## 3. Styling Problems (Tailwind v4)

If your Tailwind classes aren't applying:
1.  **Check `globals.css`**: Ensure the class or variable is defined in the `@theme inline` block.
2.  **IntelliSense**: Hover over the class in VS Code. If no CSS appears, the class name might be misspelled or not registered.
3.  **V4 Syntax**: Remember that v4 handles configuration differently. Do not expect a `tailwind.config.js` to do anything.

## 4. State Management (Zustand)

If state isn't persisting or updating:
1.  **LocalStorage**: Check Application > Local Storage in Chrome DevTools to see if your store key exists.
2.  **Action Logic**: Ensure you are using the `set()` function. Directly modifying state variables won't trigger re-renders.

## 5. Unused Code / Files

If the project feels bloated or dependencies are missing:
- Run `pnpm knip`. It will list every file and export that is not being used.
- Run `pnpm knip:fix` to automatically clean up the project.

## 6. Development Tools

- **Error Lens Extension**: Highly recommended. It highlights errors directly in your code so you can fix them as you type.
- **Turbopack Logs**: Watch the terminal where `pnpm dev` is running. It provides high-performance compilation logs and error reporting.
- **Next.js Overlay**: In the browser, Next.js will show a red overlay for runtime errors. Pay attention to the stack trace provided.
