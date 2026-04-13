const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  tr: () => import("./dictionaries/tr.json").then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;
export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["en"]>>;

export async function getDictionary(lang: string): Promise<Dictionary> {
  const targetLang = (dictionaries.hasOwnProperty(lang) ? lang : "en") as Locale;

  return dictionaries[targetLang]();
}


/**
 * Mesaj içerisindeki değişkenleri (örn: {field}) gerçek değerlerle değiştirir.
 */
export function formatMessage(template: string, values: Record<string, string | number | boolean>): string {
  return template.replace(/{(\w+)}/g, (match, key) => {
    return values[key] !== undefined ? String(values[key]) : match;
  });
}
