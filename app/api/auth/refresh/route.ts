import { NextRequest, NextResponse } from "next/server";
import { refreshSession } from "@/app/lib/controllers/session";
import { DEFAULT_LOCALE, SIGN_IN_ROUTE } from "@/app/lib/constants";
import { buildLocalizedHref } from "@/app/lib/language/navigation";

export async function GET(request: NextRequest) {
  const redirectTo = request.nextUrl.searchParams.get("redirect_to") || "/";

  // Attempt to refresh the session
  const success = await refreshSession();

  if (success) {
    // If successful, the new cookies are already set by refreshSession().
    // We just redirect the user back to where they were going.
    const url = request.nextUrl.clone();
    url.pathname = redirectTo;
    // Clear search params to not carry over redirect_to
    url.search = "";
    
    // If redirectTo contained query params itself, we need to parse them.
    // It's cleaner to just construct a new URL using the origin and redirectTo string
    try {
      const targetUrl = new URL(redirectTo, request.nextUrl.origin);
      return NextResponse.redirect(targetUrl);
    } catch {
      // Fallback
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  // If refresh failed (e.g. refresh token expired or revoked), send them to login.
  // We should try to guess the locale from the redirect_to path, or default.
  const localeMatch = redirectTo.match(/^\/([a-z]{2})(?:\/|$)/);
  const locale = localeMatch ? localeMatch[1] : DEFAULT_LOCALE;

  const url = request.nextUrl.clone();
  url.pathname = buildLocalizedHref(SIGN_IN_ROUTE, locale);
  url.search = "";
  
  // Optionally clear cookies here as a fallback, though refreshSession handles it usually
  const response = NextResponse.redirect(url);
  response.cookies.delete("token");
  response.cookies.delete("refreshToken");

  return response;
}
