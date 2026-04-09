import languages from "./languages.json";

// 1. JSON yapısına göre otomatik bir tip oluşturuyoruz
export type Dictionary = (typeof languages)["en"];

// 2. Desteklenen dilleri tip olarak belirliyoruz
export type Locale = keyof typeof languages;

export function getDictionary(lang: string): Dictionary {
  // Eğer gelen dil JSON içinde yoksa varsayılan olarak 'en' döndür
  const targetLang = (languages.hasOwnProperty(lang) ? lang : "en") as Locale;

  return languages[targetLang] as Dictionary;
}

/**
 * Mesaj içerisindeki değişkenleri (örn: {field}) gerçek değerlerle değiştirir.
 */
export function formatMessage(template: string, values: Record<string, any>): string {
  return template.replace(/{(\w+)}/g, (match, key) => {
    return values[key] !== undefined ? String(values[key]) : match;
  });
}
