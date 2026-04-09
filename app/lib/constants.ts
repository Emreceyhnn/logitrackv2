export const LOCALES = ["tr", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "tr";

export const AUTH_ROUTES = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/forgot-password",
];

export const PROTECTED_ROUTES = [
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
  "/onboarding",
];

export const COMPANY_REQUIRED_ROUTES = [
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

export const DEFAULT_REDIRECT_AFTER_LOGIN = "/overview";
export const ONBOARDING_ROUTE = "/onboarding";
export const SIGN_IN_ROUTE = "/auth/sign-in";

export function localePath(locale: string, path: string): string {
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}
