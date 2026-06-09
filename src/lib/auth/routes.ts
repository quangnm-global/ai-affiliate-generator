/** Routes that require an authenticated session */
export const PROTECTED_ROUTES = [
  "/dashboard",
  "/generate",
  "/history",
  "/settings",
] as const;

/** Routes only accessible when logged out */
export const AUTH_ROUTES = ["/login"] as const;

export function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function sanitizeRedirectPath(path: string | null | undefined) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/dashboard";
  }
  return path;
}
