
export const routeTranslations: Record<string, Record<string, string>> = {
  tr: {
    "overview": "genel-bakis",
    "vehicle": "araclar",
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
    "vehicle": "vehicle",
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

export function getLocalizedPath(path: string, lang: string): string {
  if (lang === 'en') return path;
  
  const segments = path.split('/').filter(Boolean);
  const localizedSegments = segments.map(segment => {
    return routeTranslations[lang]?.[segment] || segment;
  });
  
  return '/' + localizedSegments.join('/');
}

export function getCanonicalPath(path: string, lang: string): string {
  if (lang === 'en') return path;
  
  const segments = path.split('/').filter(Boolean);
  
  // Create reverse map for the current language
  const reverseMap = Object.entries(routeTranslations[lang] || {}).reduce((acc, [key, val]) => {
    acc[val] = key;
    return acc;
  }, {} as Record<string, string>);

  const canonicalSegments = segments.map(segment => {
    return reverseMap[segment] || segment;
  });
  
  return '/' + canonicalSegments.join('/');
}
