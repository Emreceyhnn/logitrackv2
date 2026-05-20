
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
    "sign-in": "oturuk-ac",
    "sign-up": "kayit-ol",
    "features": "ozellikler",
    "pricing": "fiyatlandirma",
    "about": "hakkimizda",
    "how-it-works": "nasil-calisir"
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
    "how-it-works": "how-it-works"
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
