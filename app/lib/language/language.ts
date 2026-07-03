import { cache } from "react";
import { getServerDictionary } from "./i18n-server";
import { resources, defaultNS, supportedLngs } from "./i18n";

/* -------------------------------------------------------------------------- */
/*  Types                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * The `Dictionary` type represents the full translation object for a single
 * locale. It is derived from the English resource bundle so that all consumer
 * components retain full IntelliSense for `dict.section.key` access.
 */
export type Dictionary = (typeof resources)["en"][typeof defaultNS];

export type Locale = (typeof supportedLngs)[number];

/* -------------------------------------------------------------------------- */
/*  getDictionary — server-side, React-cached                                   */
/* -------------------------------------------------------------------------- */

/**
 * getDictionary is wrapped with React's `cache()` so that within a single
 * request, calling it multiple times (e.g. once in generateMetadata and once
 * in the layout body) returns the same promise — the JSON is only parsed once.
 *
 * Internally this now pulls from the i18next resource bundle instead of
 * dynamic-importing JSON files on every call.
 */
export const getDictionary = cache(async (lang: string): Promise<Dictionary> => {
  return getServerDictionary(lang);
});

/* -------------------------------------------------------------------------- */
/*  formatMessage — backward-compatible interpolation helper                    */
/* -------------------------------------------------------------------------- */

/**
 * Simple `{key}` template interpolation.
 *
 * @deprecated Prefer using i18next's built-in interpolation via `t()`.
 *             This function is kept for backward compatibility with existing
 *             call-sites (e.g. validationSchema.ts).
 */
export function formatMessage(
  template: string,
  values: Record<string, string | number | boolean>
): string {
  return template.replace(/{(\w+)}/g, (match, key) => {
    return values[key] !== undefined ? String(values[key]) : match;
  });
}
