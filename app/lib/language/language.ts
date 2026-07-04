import { cache } from "react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * The `Dictionary` type represents the full translation object for a single
 * locale. It is derived from the English JSON via a type-only import so that
 * all consumer components retain full IntelliSense for `dict.section.key`
 * access WITHOUT pulling the JSON into any bundle that imports this module.
 * (This file is imported by client-side code for `formatMessage`, so a value
 * import of the dictionaries here would ship ~260 kB of JSON to the browser.)
 */
export type Dictionary = typeof import("./dictionaries/en.json");

export const SUPPORTED_LOCALES = ["en", "tr"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

/* -------------------------------------------------------------------------- */
/*  getDictionary — server-side, React-cached                                   */
/* -------------------------------------------------------------------------- */

// Async loaders keep the JSON out of the initial bundle of any importer;
// the module is only materialized when getDictionary() actually runs
// (server components / metadata), never in the browser.
const dictionaryLoaders: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en.json").then((m) => m.default as unknown as Dictionary),
  tr: () => import("./dictionaries/tr.json").then((m) => m.default as unknown as Dictionary),
};

/**
 * getDictionary is wrapped with React's `cache()` so that within a single
 * request, calling it multiple times (e.g. once in generateMetadata and once
 * in the layout body) returns the same promise — the JSON is only parsed once.
 */
export const getDictionary = cache(async (lang: string): Promise<Dictionary> => {
  const resolved: Locale = (SUPPORTED_LOCALES as readonly string[]).includes(lang)
    ? (lang as Locale)
    : "en";
  return dictionaryLoaders[resolved]();
});

/* -------------------------------------------------------------------------- */
/*  formatMessage — backward-compatible interpolation helper                    */
/* -------------------------------------------------------------------------- */

/**
 * Simple `{key}` template interpolation.
 */
export function formatMessage(
  template: string,
  values: Record<string, string | number | boolean>
): string {
  return template.replace(/{(\w+)}/g, (match, key) => {
    return values[key] !== undefined ? String(values[key]) : match;
  });
}
