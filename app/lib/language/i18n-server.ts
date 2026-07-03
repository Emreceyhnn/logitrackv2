import { createInstance, type i18n as I18nInstance, type TFunction } from "i18next";
import {
  resources,
  defaultNS,
  fallbackLng,
  supportedLngs,
  getSharedInitOptions,
} from "./i18n";

/* -------------------------------------------------------------------------- */
/*  Server-side i18next factory                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Create a **disposable** i18next instance for server-side usage.
 *
 * Every call returns a fresh instance so there is no shared mutable state
 * between concurrent requests (important for Next.js Server Components).
 *
 * Usage in Server Components / `generateMetadata`:
 * ```ts
 * const { t, i18n } = await getServerTranslation(lang);
 * const title = t("landing.metaTitle");
 * ```
 */
export async function getServerTranslation(
  lang: string
): Promise<{ t: TFunction; i18n: I18nInstance }> {
  const instance = createInstance();
  await instance.init(getSharedInitOptions(lang));

  return { t: instance.t, i18n: instance };
}

/**
 * Convenience: get the full resource bundle for a given language.
 * This returns the same shape as the old `getDictionary()` output,
 * so existing Server Components that pass `dict` as a prop still work.
 */
export function getServerDictionary(
  lang: string
): (typeof resources)[typeof fallbackLng][typeof defaultNS] {
  const resolvedLang = (supportedLngs as readonly string[]).includes(lang)
    ? (lang as (typeof supportedLngs)[number])
    : fallbackLng;

  return resources[resolvedLang][defaultNS];
}
