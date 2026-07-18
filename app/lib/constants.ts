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
  "/warehouse-worker",
  // Requires a signed-in user, but must NOT be in COMPANY_REQUIRED_ROUTES —
  // it is the destination for users without a company (loop otherwise).
  "/onboarding",
  // Requires a signed-in user but NOT dashboard access — it is the "awaiting
  // access" screen shown to a user whose entitlement is still NONE (e.g. the
  // self-serve trial grant failed at signup, or a manual approval is pending).
  // Must NOT be company-required or access-gated, else the proxy loops.
  "/pending-access",
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
  "/warehouse-worker",
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

/**
 * Sensible regional defaults suggested per UI locale, so a Turkish user isn't
 * greeted with UTC + USD (the neutral fallback). Only a *default* — every field
 * stays freely editable. `currency` is constrained to SupportedCurrency
 * (USD/EUR/TRY/GBP), which is why locales outside that set fall back to USD.
 */
type RegionalDefaults = { timezone: string; currency: string };

const NEUTRAL_REGIONAL_DEFAULTS: RegionalDefaults = {
  timezone: "UTC",
  currency: "USD",
};

export const LOCALE_REGIONAL_DEFAULTS: Record<string, RegionalDefaults> = {
  tr: { timezone: "Europe/Istanbul", currency: "TRY" },
  en: NEUTRAL_REGIONAL_DEFAULTS,
};

/** Regional defaults for a locale, falling back to the neutral defaults. */
export function getRegionalDefaults(
  locale: string | undefined
): RegionalDefaults {
  return (
    (locale ? LOCALE_REGIONAL_DEFAULTS[locale] : undefined) ??
    NEUTRAL_REGIONAL_DEFAULTS
  );
}
