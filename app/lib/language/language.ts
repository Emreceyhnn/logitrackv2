import { cache } from "react";

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  tr: () => import("./dictionaries/tr.json").then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;
export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["en"]>>;

/**
 * getDictionary is wrapped with React's `cache()` so that within a single
 * request, calling it multiple times (e.g. once in generateMetadata and once
 * in the layout body) returns the same promise — the JSON is only parsed once.
 */
export const getDictionary = cache(async (lang: string): Promise<Dictionary> => {
  const targetLang = (
    dictionaries.hasOwnProperty(lang) ? lang : "en"
  ) as Locale;

  return dictionaries[targetLang]();
});

export function formatMessage(
  template: string,
  values: Record<string, string | number | boolean>
): string {
  return template.replace(/{(\w+)}/g, (match, key) => {
    return values[key] !== undefined ? String(values[key]) : match;
  });
}
