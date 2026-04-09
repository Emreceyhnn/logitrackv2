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
  Locale
} from "@/app/lib/constants";

function getLocaleFromPathname(pathname: string): {
  locale: Locale;
  restPath: string;
} {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (LOCALES.includes(firstSegment as Locale)) {
    const restPath = "/" + segments.slice(1).join("/");
    return { locale: firstSegment as Locale, restPath: restPath === "/" ? "" : restPath };
  }

  return { locale: DEFAULT_LOCALE, restPath: pathname };
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static/internal paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    /\.(.*)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const { locale, restPath } = getLocaleFromPathname(pathname);

  // If no locale prefix → redirect to default locale variant
  const hasLocalePrefix = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );

  if (!hasLocalePrefix) {
    // Priority: 1. Cookie, 2. Default
    const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
    const locale = (cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale))
      ? cookieLocale as Locale
      : DEFAULT_LOCALE;

    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

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

  if (isProtectedRoute && !token && !refreshToken) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${SIGN_IN_ROUTE}`;
    return NextResponse.redirect(url);
  }

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
      isTokenValid = false;
    }
  }

  if (isAuthRoute && isTokenValid && companyId) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${DEFAULT_REDIRECT_AFTER_LOGIN}`;
    return NextResponse.redirect(url);
  }

  if (isCompanyRequired) {
    if (isTokenValid && !companyId && currentPath !== ONBOARDING_ROUTE) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}${ONBOARDING_ROUTE}`;
      return NextResponse.redirect(url);
    }

    if (!isTokenValid && !refreshToken) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}${SIGN_IN_ROUTE}`;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|ico)$).*)",
  ],
};
