import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { 
  AUTH_ROUTES, 
  COMPANY_REQUIRED_ROUTES, 
  PROTECTED_ROUTES, 
  ONBOARDING_ROUTE,
  DEFAULT_REDIRECT_AFTER_LOGIN
} from "@/app/lib/constants";

/**
 * Middleware for Logitrack Authentication & Routing.
 * 
 * Objectives:
 * 1. Protect dashboard routes from unauthenticated users.
 * 2. Redirect authenticated users away from login/signup pages.
 * 3. Ensure users without companies are sent to onboarding (unless they have a refresh token).
 */
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isCompanyRequired = COMPANY_REQUIRED_ROUTES.some((route) => pathname.startsWith(route));

  // 1. Unauthenticated users accessing protected routes
  if (isProtectedRoute && !token && !refreshToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. Decode JWT if token exists
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
      // Token expired or invalid
      isTokenValid = false;
    }
  }

  // 3. Authenticated users (with valid token & company) accessing auth routes
  if (isAuthRoute && isTokenValid && companyId) {
    return NextResponse.redirect(new URL(DEFAULT_REDIRECT_AFTER_LOGIN, request.url));
  }

  // 4. Onboarding Logic (Logged in but no company)
  // CRITICAL: We only redirect if we are SURE they have no company.
  // If the token is invalid but we have a refresh token, we allow the request to 
  // proceed so that the server components can refresh the session and check the DB.
  if (isCompanyRequired) {
    // case A: Has valid token but NO companyId -> Go to onboarding
    if (isTokenValid && !companyId && pathname !== ONBOARDING_ROUTE) {
      return NextResponse.redirect(new URL(ONBOARDING_ROUTE, request.url));
    }
    
    // case B: Has NO valid token and NO refresh token -> Go to sign-in
    if (!isTokenValid && !refreshToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // case C: Has NO valid token but HAS refresh token -> Proceed to page
    // (The server component will handle the refresh)
  }

  return NextResponse.next();
}

/**
 * Configure middleware to match all routes except static assets.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|ico)$).*)",
  ],
};
