
export const routeTranslations: Record<string, Record<string, string>> = {
  tr: {
    "overview": "genel-bakis",
    // 'vehicles' and 'vehicle' both map to 'araclar' — sidebar uses /vehicle (Next.js folder)
    "vehicle": "araclar",
    "vehicles": "araclar",
    "drivers": "suruculer",
    "routes": "rotalar",
    "shipments": "sevkiyatlar",
    "warehouses": "depolar",
    "inventory": "envanter",
    "customers": "musteriler",
    "reports": "raporlar",
    "analytics": "analiz",
    "company": "sirket",
    "auth": "giris",
    "sign-in": "oturum-ac",
    "sign-up": "kayit-ol",
    "features": "ozellikler",
    "pricing": "fiyatlandirma",
    "about": "hakkimizda",
    "how-it-works": "nasil-calisir",
    "contact": "iletisim"
  },
  en: {
    "overview": "overview",
    // 'vehicles' and 'vehicle' both resolve to 'vehicle' — Next.js folder is 'vehicle'
    "vehicle": "vehicle",
    "vehicles": "vehicle",
    "drivers": "drivers",
    "routes": "routes",
    "shipments": "shipments",
    "warehouses": "warehouses",
    "inventory": "inventory",
    "customers": "customers",
    "reports": "reports",
    "analytics": "analytics",
    "company": "company",
    "auth": "auth",
    "sign-in": "sign-in",
    "sign-up": "sign-up",
    "features": "features",
    "pricing": "pricing",
    "about": "about",
    "how-it-works": "how-it-works",
    "contact": "contact"
  }
};

/**
 * Build reverse map: localized-slug → canonical-key.
 * We cache per-lang to avoid rebuilding on every call.
 */
const reverseMapCache: Record<string, Record<string, string>> = {};

function getReverseMap(lang: string): Record<string, string> {
  if (reverseMapCache[lang]) return reverseMapCache[lang];
  const map = Object.entries(routeTranslations[lang] || {}).reduce(
    (acc, [key, val]) => {
      // Only store first canonical key for a given slug (avoid overwriting)
      if (!acc[val]) acc[val] = key;
      return acc;
    },
    {} as Record<string, string>
  );
  reverseMapCache[lang] = map;
  return map;
}

/**
 * Translate a canonical (English-key-based) path to the localized URL slug.
 * e.g. getLocalizedPath('/vehicle', 'tr') → '/araclar'
 */
export function getLocalizedPath(path: string, lang: string): string {
  if (!path) return '/';
  if (!lang || lang === 'en') return path;

  const segments = path.split('/').filter(Boolean);
  const localizedSegments = segments.map((segment) => {
    return routeTranslations[lang]?.[segment] ?? segment;
  });

  return '/' + localizedSegments.join('/');
}

/**
 * Translate a localized URL slug back to its canonical (English-key-based) path.
 * e.g. getCanonicalPath('/araclar', 'tr') → '/vehicle'
 */
export function getCanonicalPath(path: string, lang: string): string {
  if (!path) return '/';
  if (!lang || lang === 'en') return path;

  const reverseMap = getReverseMap(lang);
  const segments = path.split('/').filter(Boolean);

  const canonicalSegments = segments.map((segment) => {
    return reverseMap[segment] ?? segment;
  });

  return '/' + canonicalSegments.join('/');
}

/**
 * Given a localized pathname (e.g. '/tr/araclar'), return the full localized URL.
 * Accepts paths with or without the leading locale prefix.
 */
export function buildLocalizedHref(canonicalPath: string, lang: string): string {
  const localized = getLocalizedPath(canonicalPath, lang);
  return `/${lang}${localized}`;
}

/**
 * Build a Next.js `alternates` metadata block (self canonical + per-locale
 * hreflang links, including x-default) for a public page, given its canonical
 * (English-key-based) path such as '/features' or '/' for the home page.
 * Each locale points at its own localized slug (e.g. /tr/ozellikler,
 * /en/features), which is what crawlers need for correct language targeting.
 */
export function buildSeoAlternates(
  canonicalPath: string,
  lang: string
): { canonical: string; languages: Record<string, string> } {
  const languages: Record<string, string> = {};
  for (const locale of Object.keys(routeTranslations)) {
    languages[locale] = buildLocalizedHref(canonicalPath, locale);
  }
  // x-default: send unmatched languages to the English variant.
  languages["x-default"] = buildLocalizedHref(canonicalPath, "en");

  return {
    canonical: buildLocalizedHref(canonicalPath, lang),
    languages,
  };
}

/**
 * Build a BreadcrumbList JSON-LD schema (Home → page) for a public landing
 * page. Lets search engines and AI answer engines render/understand the
 * page's position in the site hierarchy.
 */
export function buildBreadcrumbSchema(
  canonicalPath: string,
  pageName: string,
  lang: string,
  baseUrl: string
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${baseUrl}${buildLocalizedHref("/", lang)}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: pageName,
        item: `${baseUrl}${buildLocalizedHref(canonicalPath, lang)}`,
      },
    ],
  };
}

/**
 * True when a pathname sits inside the public Live Demo subtree
 * (/{lang}/demo/...), which anonymous visitors browse without a session.
 */
export function isDemoPathname(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return pathname.split('/').filter(Boolean)[1] === 'demo';
}

/**
 * The dashboard "home" a given pathname should return to.
 *
 * Demo pages must stay inside /{lang}/demo: the real /{lang}/overview is a
 * PROTECTED_ROUTE, so sending an anonymous demo visitor there makes the proxy
 * auth gate bounce them to the sign-in page (see proxy.ts). Demo route
 * segments are English-only (there is no /tr/demo/genel-bakis folder), so the
 * demo branch deliberately skips slug localization.
 */
export function buildDashboardHomeHref(pathname: string | null | undefined, lang: string): string {
  return isDemoPathname(pathname)
    ? `/${lang}/demo/overview`
    : buildLocalizedHref('/overview', lang);
}

/**
 * Check whether a localized pathname is 'active' for a given canonical path.
 * Supports exact match and optional prefix (startsWith) matching.
 */
export function isPathActive(
  pathname: string,
  canonicalPath: string,
  lang: string,
  exact = true
): boolean {
  const fullLocalized = buildLocalizedHref(canonicalPath, lang);
  if (exact) return pathname === fullLocalized;
  return pathname === fullLocalized || pathname.startsWith(fullLocalized + '/');
}
