import enDict from "./dictionaries/en.json";
import trDict from "./dictionaries/tr.json";

/* -------------------------------------------------------------------------- */
/*  Shared i18next configuration (server + client safe)                         */
/* -------------------------------------------------------------------------- */

export const defaultNS = "translation" as const;
export const fallbackLng = "en" as const;
export const supportedLngs = ["en", "tr"] as const;

/**
 * Resources object that maps locale codes to their translation dictionaries.
 * The existing JSON files are nested objects — i18next handles them natively.
 */
export const resources = {
  en: { [defaultNS]: enDict },
  tr: { [defaultNS]: trDict },
} as const;

/**
 * Shared init options (without React-specific plugins).
 * Used by both server and client i18next instances.
 */
export function getSharedInitOptions(lang: string) {
  const resolvedLang = (supportedLngs as readonly string[]).includes(lang)
    ? lang
    : fallbackLng;

  return {
    resources,
    lng: resolvedLang,
    fallbackLng,
    supportedLngs: [...supportedLngs],
    defaultNS,
    ns: [defaultNS],
    interpolation: {
      escapeValue: false, // React already escapes output
      prefix: "{",
      suffix: "}",
    },
  } as const;
}
