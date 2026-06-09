import { stripLocale } from "@/i18n/routing";

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
  const path = stripLocale(pathname);
  return PROTECTED_ROUTES.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );
}

export function isAuthRoute(pathname: string) {
  const path = stripLocale(pathname);
  return AUTH_ROUTES.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );
}

export function sanitizeRedirectPath(
  path: string | null | undefined,
  locale = "en"
) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return `/${locale}/dashboard`;
  }

  const stripped = stripLocale(path);
  if (stripped.startsWith("/en/") || stripped.startsWith("/vi/")) {
    return stripped;
  }

  return `/${locale}${stripped === "/" ? "/dashboard" : stripped}`;
}
