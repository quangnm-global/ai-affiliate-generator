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
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const abuseResponse = enforceMiddlewareAbuseGuards(request);
  if (abuseResponse) return abuseResponse;

  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const generationAuthResponse = enforceMiddlewareAuthForGeneration(
    request,
    user
  );
  if (generationAuthResponse) return generationAuthResponse;

  if (isProtectedRoute(pathname) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute(pathname) && user) {
    const redirectTo = sanitizeRedirectPath(
      request.nextUrl.searchParams.get("redirect")
    );
    const url = request.nextUrl.clone();
    url.pathname = redirectTo;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
