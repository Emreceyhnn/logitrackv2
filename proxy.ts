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
import { hasAccess, type AccessStatus } from "@/app/lib/entitlement";

/* -------------------------------------------------------------------------- */
/*  Startup Validations                                                         */
/* -------------------------------------------------------------------------- */

if (!process.env.JWT_SECRET) {
  throw new Error("CRITICAL: JWT_SECRET environment variable is missing. Application cannot start safely.");
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                     */
/* -------------------------------------------------------------------------- */

function getClientIp(request: NextRequest): string {
  // Trust order for Next.js / Vercel environments (request.ip was removed
  // from NextRequest in Next 15, so we read it from trusted proxy headers):
  // 1. x-vercel-forwarded-for - Vercel specific secure header
  // 2. x-real-ip - Reliable if overwritten by a trusted proxy
  // 3. LAST hop of x-forwarded-for (fallback, but can be spoofed)
  const vercelIp = request.headers.get("x-vercel-forwarded-for");
  if (vercelIp) {
    const firstVercelIp = vercelIp.split(",")[0];
    if (firstVercelIp) return firstVercelIp.trim();
  }

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

// Dashboard responses get a strict per-request nonce on script-src: every
// script tag in that subtree (JsonLd is landing-only, MUI/emotion styles are
// untouched since style-src stays relaxed) must carry it via `x-nonce`.
// Marketing/static routes keep the relaxed script-src so the root [lang]
// layout can stay free of headers()/cookies() (see layout.tsx) and remain
// statically rendered.
function buildCsp(nonce: string, strict: boolean): string {
  const scriptSrc = strict
    ? `'self' 'nonce-${nonce}' https://maps.googleapis.com`
    : `'self' 'unsafe-inline' https://maps.googleapis.com`;

  return [
    `script-src ${scriptSrc}`,
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}

/* -------------------------------------------------------------------------- */
/*  Proxy (Next.js 16+ proxy/middleware convention)                             */
/* -------------------------------------------------------------------------- */

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const nonce = crypto.randomUUID().replace(/-/g, "");

  // ── Rate Limiting for API Routes ───────────────────────────────────────────
  if (pathname.startsWith("/api")) {
    const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(request.method);
    const isAuth = pathname.startsWith("/api/auth");
    
    // Optimizasyon: Kritik olmayan GET isteklerinde Redis ağ gecikmesini (+50-100ms) 
    // önlemek için Rate Limiter sadece mutasyon ve yetkilendirme rotalarında çalıştırılır.
    if (isMutation || isAuth) {
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
  }

  // Skip Next.js internals, static files, API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    /\.(.+)$/.test(pathname)
  ) {
    const response = NextResponse.next();
    response.headers.set("Content-Security-Policy", buildCsp(nonce, false));
    return response;
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
  let accessStatus: AccessStatus | null = null;
  let trialEndsAt: number | null = null;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
      const { payload } = await jwtVerify(token, secret);
      companyId = (payload.companyId as string) || null;
      accessStatus = (payload.accessStatus as AccessStatus) ?? null;
      trialEndsAt =
        typeof payload.trialEndsAt === "number" ? payload.trialEndsAt : null;
      isTokenValid = true;
    } catch {
      // jwtVerify throws errors.JWTExpired if expired, or other errors if invalid
      isTokenValid = false;
    }
  }

  // Effective dashboard entitlement, decided purely from the JWT summary.
  const userHasAccess = hasAccess(accessStatus, trialEndsAt);

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

  // "No access" splits by *why*: a brand-new user still awaiting a trial
  // (accessStatus NONE) sees the pending-access screen, which polls until the
  // trial resolves; a user whose trial/plan lapsed (EXPIRED) sees pricing with
  // an upgrade notice. Keeps "you're almost in" distinct from "time to pay".
  const noAccessHome: { pathname: string; search: string } =
    accessStatus === "NONE"
      ? { pathname: buildLocalizedHref("/pending-access", locale), search: "" }
      : { pathname: buildLocalizedHref("/pricing", locale), search: "?reason=expired" };

  // Where an authenticated user belongs, given their entitlement:
  //   - no access  → pending-access (NONE) or pricing (EXPIRED), per above
  //   - has company → dashboard
  //   - otherwise   → onboarding (create a company)
  const authedHome: { pathname: string; search: string } = !userHasAccess
    ? noAccessHome
    : {
        pathname: buildLocalizedHref(
          companyId ? DEFAULT_REDIRECT_AFTER_LOGIN : "/onboarding",
          locale
        ),
        search: "",
      };

  // `/onboarding` requires access too: without it, company creation is blocked,
  // so route the user to pricing instead of the create-company screen.
  const isOnboarding =
    currentPath === "/onboarding" || currentPath.startsWith("/onboarding/");

  // Already authenticated on auth routes → send them to their home.
  if (isAuthRoute && isTokenValid) {
    const url = request.nextUrl.clone();
    url.pathname = authedHome.pathname;
    url.search = authedHome.search;
    return NextResponse.redirect(url);
  }

  // Authenticated but without access, trying to reach onboarding → their
  // no-access home (pending-access for NONE, pricing for EXPIRED).
  if (isOnboarding && isTokenValid && !userHasAccess) {
    const url = request.nextUrl.clone();
    url.pathname = noAccessHome.pathname;
    url.search = noAccessHome.search;
    return NextResponse.redirect(url);
  }

  // Company-required routes enforcement
  if (isCompanyRequired) {
    if (!isTokenValid && !refreshToken) {
      const url = request.nextUrl.clone();
      url.pathname = buildLocalizedHref(SIGN_IN_ROUTE, locale);
      return NextResponse.redirect(url);
    }

    // Signed in but no dashboard access → pending-access (NONE) or pricing
    // (EXPIRED trial / no plan).
    if (isTokenValid && !userHasAccess) {
      const url = request.nextUrl.clone();
      url.pathname = noAccessHome.pathname;
      url.search = noAccessHome.search;
      return NextResponse.redirect(url);
    }

    // Has access but no company yet → onboarding to create one.
    if (isTokenValid && !companyId) {
      const url = request.nextUrl.clone();
      url.pathname = buildLocalizedHref("/onboarding", locale);
      return NextResponse.redirect(url);
    }
  }

  // ── 5. Root Path Redirect ───────────────────────────────────────────────────
  // Authenticated users skip the marketing page; anonymous visitors (and
  // crawlers) must reach the landing page, so no redirect for them.
  if (currentPath === "/" && isTokenValid) {
    const url = request.nextUrl.clone();
    url.pathname = authedHome.pathname;
    url.search = authedHome.search;
    return NextResponse.redirect(url);
  }

  // ── 6. Final Response ───────────────────────────────────────────────────────
  const csp = buildCsp(nonce, isProtectedRoute);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  // Next.js reads the nonce for its own inline scripts (bootstrap/flight
  // payload) from the REQUEST's Content-Security-Policy header — without this,
  // a strict script-src would block them and protected pages would not hydrate.
  requestHeaders.set("content-security-policy", csp);

  const response = rewriteUrl
    ? NextResponse.rewrite(rewriteUrl, { request: { headers: requestHeaders } })
    : NextResponse.next({ request: { headers: requestHeaders } });

  response.headers.set("Content-Security-Policy", csp);

  return response;
}

/* -------------------------------------------------------------------------- */
/*  Matcher                                                                     */
/* -------------------------------------------------------------------------- */

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|ico)$).*)",
  ],
};
