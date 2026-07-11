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
  // Requires a signed-in user, but must NOT be in COMPANY_REQUIRED_ROUTES —
  // it is the destination for users without a company (loop otherwise).
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
export const SIGN_IN_ROUTE = "/auth/sign-in";

export function localePath(locale: string, path: string): string {
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}

export const COMMON_TIMEZONES = [
  {
    value: "America/Los_Angeles",
    label: "Los Angeles (GMT-08:00 / GMT-07:00)",
  },
  { value: "America/Chicago", label: "Chicago (GMT-06:00 / GMT-05:00)" },
  { value: "America/New_York", label: "New York (GMT-05:00 / GMT-04:00)" },
  { value: "America/Sao_Paulo", label: "Sao Paulo (GMT-03:00)" },
  { value: "UTC", label: "UTC (Universal Coordinated Time)" },
  { value: "Europe/London", label: "London (GMT+00:00 / GMT+01:00)" },
  { value: "Europe/Paris", label: "Paris (GMT+01:00 / GMT+02:00)" },
  { value: "Europe/Berlin", label: "Berlin (GMT+01:00 / GMT+02:00)" },
  { value: "Europe/Istanbul", label: "Istanbul (GMT+03:00)" },
  { value: "Asia/Dubai", label: "Dubai (GMT+04:00)" },
  { value: "Asia/Shanghai", label: "Shanghai (GMT+08:00)" },
  { value: "Asia/Singapore", label: "Singapore (GMT+08:00)" },
  { value: "Asia/Tokyo", label: "Tokyo (GMT+09:00)" },
  { value: "Australia/Sydney", label: "Sydney (GMT+10:00 / GMT+11:00)" },
  { value: "Pacific/Auckland", label: "Auckland (GMT+12:00 / GMT+13:00)" },
];
