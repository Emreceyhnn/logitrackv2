import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Routes that require authentication
const PROTECTED_ROUTES = [
  "/overview",
  "/vehicle",
  "/drivers",
  "/shipments",
  "/routes",
  "/customers",
  "/warehouses",
  "/inventory",
  "/fuel",
  "/analytics",
  "/reports",
  "/users",
  "/company",
];

// Routes only for unauthenticated users
const AUTH_ROUTES = ["/auth/sign-in", "/auth/sign-up"];

// Routes that require a company to be set up
const COMPANY_REQUIRED_ROUTES = [
  "/overview",
  "/vehicle",
  "/drivers",
  "/shipments",
  "/routes",
  "/customers",
  "/warehouses",
  "/inventory",
  "/fuel",
  "/analytics",
  "/reports",
  "/users",
  "/company",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get("token")?.value;
  const refreshTokenCookie = request.cookies.get("refreshToken")?.value;

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isCompanyRequired = COMPANY_REQUIRED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // ─── No session cookies → send to sign-in ───────────────────────────────────
  if (isProtected && !tokenCookie && !refreshTokenCookie) {
    const signInUrl = new URL("/auth/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // ─── Decode the JWT to check companyId ──────────────────────────────────────
  let companyId: string | null = null;
  if (tokenCookie) {
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "fallback_secret_for_dev_only"
      );
      const { payload } = await jwtVerify(tokenCookie, secret);
      companyId = (payload.companyId as string) || null;
    } catch {
      // Token is expired or invalid — let the server action handle refresh
    }
  }

  // ─── Logged in but no company → send to create-company ──────────────────────
  if (
    isCompanyRequired &&
    tokenCookie &&
    !companyId &&
    pathname !== "/create-company"
  ) {
    return NextResponse.redirect(new URL("/create-company", request.url));
  }

  // ─── Already logged in → redirect away from auth pages ──────────────────────
  if (isAuthRoute && (tokenCookie || refreshTokenCookie)) {
    if (!companyId) {
      return NextResponse.redirect(new URL("/create-company", request.url));
    }
    return NextResponse.redirect(new URL("/overview", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|ico)$).*)",
  ],
};
