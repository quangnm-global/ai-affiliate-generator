import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";

import {
  enforceMiddlewareAbuseGuards,
  enforceMiddlewareAuthForGeneration,
} from "@/lib/abuse-prevention/middleware-guards";
import {
  isAuthRoute,
  isProtectedRoute,
  sanitizeRedirectPath,
} from "@/lib/auth/routes";
import { getLocaleFromPathname, routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

function isApiOrAuthCallback(pathname: string) {
  return pathname.startsWith("/api") || pathname.startsWith("/auth");
}

function mergeCookies(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie.name, cookie.value);
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isApiOrAuthCallback(pathname)) {
    const abuseResponse = enforceMiddlewareAbuseGuards(request);
    if (abuseResponse) return abuseResponse;

    const { supabaseResponse, user } = await updateSession(request);
    const generationAuthResponse = enforceMiddlewareAuthForGeneration(
      request,
      user
    );
    if (generationAuthResponse) return generationAuthResponse;

    return supabaseResponse;
  }

  const intlResponse = intlMiddleware(request);
  const { supabaseResponse, user } = await updateSession(request);
  mergeCookies(supabaseResponse, intlResponse);

  const locale = getLocaleFromPathname(pathname);

  const abuseResponse = enforceMiddlewareAbuseGuards(request);
  if (abuseResponse) return abuseResponse;

  const generationAuthResponse = enforceMiddlewareAuthForGeneration(
    request,
    user
  );
  if (generationAuthResponse) return generationAuthResponse;

  if (isProtectedRoute(pathname) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute(pathname) && user) {
    const redirectTo = sanitizeRedirectPath(
      request.nextUrl.searchParams.get("redirect"),
      locale
    );
    const url = request.nextUrl.clone();
    url.pathname = redirectTo;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
