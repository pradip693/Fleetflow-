import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/forgot-password", "/sign-up", "/reset-password"];

/**
 * Proxy to handle route protection and redirection based on authentication state.
 *
 * Note: In Next.js 16+, Middleware is referred to as Proxy.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Check for Token (e.g., in Cookies)
  const accessToken = request.cookies.get("accessToken")?.value;
  const isAuthenticated = !!accessToken;

  // 2. Determine if the current route is public
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // 3. LOGIC: If user is logged in...
  if (isAuthenticated) {
    if (isPublicRoute) {
      // If user is at the root or login page while already authenticated,
      // redirect them directly to the admin dashboard.
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // 4. LOGIC: If user is NOT logged in...
  if (!isAuthenticated) {
    if (!isPublicRoute) {
      // Redirect to / (which is now our login page) if trying to access protected pages.
      const loginUrl = new URL("/", request.url);

      // Store the original destination to redirect back after successful login
      if (pathname !== "/") {
        loginUrl.searchParams.set("callbackUrl", pathname);
      }

      return NextResponse.redirect(loginUrl);
    }
  }

  // 5. Allow request to proceed
  return NextResponse.next();
}

/**
 * Configure which routes should be processed by the proxy.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
