import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import {
  AUTH_ROUTES,
  COMPANY_REQUIRED_ROUTES,
  PROTECTED_ROUTES,
  DEFAULT_REDIRECT_AFTER_LOGIN,
  LOCALES,
  DEFAULT_LOCALE,
  SIGN_IN_ROUTE,
  Locale,
} from "@/app/lib/constants";
import {
  buildLocalizedHref,
  getCanonicalPath,
} from "@/app/lib/language/navigation";
import { rateLimit } from "@/app/lib/rate-limiter";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                     */
/* -------------------------------------------------------------------------- */

function getClientIp(request: NextRequest): string {
  // Trust order:
  // 1. x-real-ip — overwritten by our own reverse proxy (or Vercel), so it
  //    cannot be forged from outside.
  // 2. LAST hop of x-forwarded-for — appended by the nearest trusted proxy.
  //    Earlier entries are client-supplied and trivially spoofable, so they
  //    must never be used for rate limiting.
  // 3. "unknown" — a distinct bucket instead of a shared constant, so header
  //    stripping can't merge every anonymous client into one legit-looking IP.
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const hops = xff
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);
    if (hops.length > 0) return hops[hops.length - 1] ?? "unknown";
  }

  return "unknown";
}

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
/*  Proxy (Next.js 16+ proxy/middleware convention)                             */
/* -------------------------------------------------------------------------- */

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Rate Limiting for API Routes ───────────────────────────────────────────
  if (pathname.startsWith("/api")) {
    const ip = getClientIp(request);

    const limitResult = await rateLimit(ip, 120, 60, "rate-limit:api:");

    if (!limitResult.success) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": limitResult.limit.toString(),
            "X-RateLimit-Remaining": limitResult.remaining.toString(),
            "X-RateLimit-Reset": limitResult.reset.toString(),
          },
        }
      );
    }
  }

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
    let locale = DEFAULT_LOCALE;

    if (cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale)) {
      locale = cookieLocale as Locale;
    } else {
      const acceptLanguage = request.headers.get("accept-language");
      if (acceptLanguage) {
        // 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7' -> pick the first matching language
        const preferredLang = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase() ?? "";
        if ((LOCALES as readonly string[]).includes(preferredLang)) {
          locale = preferredLang as Locale;
        }
      }
    }

    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  const { locale, restPath } = getLocaleFromPathname(pathname);
  const currentLocalePath = restPath || "/";
  
  // ── 2. Determine Canonical Path for Auth Checks and Rewrites ──────────────
  const canonicalPath =
    locale !== "en" ? getCanonicalPath(currentLocalePath, locale) : currentLocalePath;

  let rewriteUrl: URL | null = null;
  if (locale !== "en" && canonicalPath !== currentLocalePath) {
    rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = `/${locale}${canonicalPath}`;
  }

  // ── 3. Auth gate ────────────────────────────────────────────────────────────
  const token = request.cookies.get("token")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  
  // Use canonicalPath for route matching!
  const currentPath = canonicalPath;

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
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
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
    url.searchParams.set(
      "redirect_to",
      request.nextUrl.pathname + request.nextUrl.search
    );
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
    if (isTokenValid && !companyId) {
      const url = request.nextUrl.clone();
      url.pathname = buildLocalizedHref("/onboarding", locale);
      return NextResponse.redirect(url);
    }

    if (!isTokenValid && !refreshToken) {
      const url = request.nextUrl.clone();
      url.pathname = buildLocalizedHref(SIGN_IN_ROUTE, locale);
      return NextResponse.redirect(url);
    }
  }

  // ── 5. Root Path Redirect ───────────────────────────────────────────────────
  // Authenticated users skip the marketing page; anonymous visitors (and
  // crawlers) must reach the landing page, so no redirect for them.
  if (currentPath === "/" && isTokenValid) {
    const url = request.nextUrl.clone();
    url.pathname = buildLocalizedHref(DEFAULT_REDIRECT_AFTER_LOGIN, locale);
    return NextResponse.redirect(url);
  }

  // ── 6. Final Response ───────────────────────────────────────────────────────
  if (rewriteUrl) {
    return NextResponse.rewrite(rewriteUrl);
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
