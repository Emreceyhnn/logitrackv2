import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import {
  AUTH_ROUTES,
  COMPANY_REQUIRED_ROUTES,
  PROTECTED_ROUTES,
  ONBOARDING_ROUTE,
  DEFAULT_REDIRECT_AFTER_LOGIN,
  LOCALES,
  DEFAULT_LOCALE,
  SIGN_IN_ROUTE,
  Locale,
} from "@/app/lib/constants";
import { buildLocalizedHref, getCanonicalPath } from "@/app/lib/language/navigation";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                     */
/* -------------------------------------------------------------------------- */

function getLocaleFromPathname(pathname: string): {
  locale: Locale;
  restPath: string;
} {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (LOCALES.includes(first as Locale)) {
    const rest = "/" + segments.slice(1).join("/");
    return {
      locale: first as Locale,
      restPath: rest === "/" ? "" : rest,
    };
  }

  return { locale: DEFAULT_LOCALE, restPath: pathname };
}

/* -------------------------------------------------------------------------- */
/*  Proxy (Next.js 16+ middleware convention)                                   */
/* -------------------------------------------------------------------------- */

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip Next.js internals, static files, API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    /\.(.+)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // ── 1. Locale redirect ─────────────────────────────────────────────────────
  const hasLocalePrefix = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );

  if (!hasLocalePrefix) {
    const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
    const locale =
      cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale)
        ? (cookieLocale as Locale)
        : DEFAULT_LOCALE;

    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  const { locale, restPath } = getLocaleFromPathname(pathname);

  // ── 2. URL translation rewrite (e.g. /tr/araclar → /tr/vehicle) ────────────
  if (locale !== "en") {
    const canonicalPath = getCanonicalPath(restPath || "/", locale);
    if (canonicalPath !== (restPath || "/")) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}${canonicalPath}`;
      return NextResponse.rewrite(url);
    }
  }

  // ── 3. Auth gate ────────────────────────────────────────────────────────────
  const token = request.cookies.get("token")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const currentPath = restPath || "/";

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (p) => currentPath === p || currentPath.startsWith(p + "/")
  );
  const isAuthRoute = AUTH_ROUTES.some(
    (p) => currentPath === p || currentPath.startsWith(p + "/")
  );
  const isCompanyRequired = COMPANY_REQUIRED_ROUTES.some(
    (p) => currentPath === p || currentPath.startsWith(p + "/")
  );

  // Unauthenticated access to protected page → redirect to sign-in
  if (isProtectedRoute && !token && !refreshToken) {
    const url = request.nextUrl.clone();
    url.pathname = buildLocalizedHref(SIGN_IN_ROUTE, locale);
    return NextResponse.redirect(url);
  }

  // Validate JWT
  let companyId: string | null = null;
  let isTokenValid = false;

  if (token) {
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "fallback_secret_for_dev_only"
      );
      const { payload } = await jwtVerify(token, secret);
      companyId = (payload.companyId as string) || null;
      isTokenValid = true;
    } catch {
      // jwtVerify throws errors.JWTExpired if expired, or other errors if invalid
      isTokenValid = false;
    }
  }

  // ── 4. Token Refresh Flow ───────────────────────────────────────────────────
  // If access token is invalid/expired, but a refresh token exists, redirect
  // to the refresh endpoint before hitting any Server Components.
  if (!isTokenValid && refreshToken) {
    const url = request.nextUrl.clone();
    url.pathname = `/api/auth/refresh`;
    url.searchParams.set("redirect_to", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  // Already authenticated on auth routes → redirect to dashboard
  if (isAuthRoute && isTokenValid && companyId) {
    const url = request.nextUrl.clone();
    url.pathname = buildLocalizedHref(DEFAULT_REDIRECT_AFTER_LOGIN, locale);
    return NextResponse.redirect(url);
  }

  // Company-required routes enforcement
  if (isCompanyRequired) {
    if (isTokenValid && !companyId && currentPath !== ONBOARDING_ROUTE) {
      const url = request.nextUrl.clone();
      url.pathname = buildLocalizedHref(ONBOARDING_ROUTE, locale);
      return NextResponse.redirect(url);
    }

    if (!isTokenValid && !refreshToken) {
      const url = request.nextUrl.clone();
      url.pathname = buildLocalizedHref(SIGN_IN_ROUTE, locale);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

/* -------------------------------------------------------------------------- */
/*  Matcher                                                                     */
/* -------------------------------------------------------------------------- */

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|ico)$).*)",
  ],
};
