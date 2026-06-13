"use client";

import { createContext, useContext, useState, useMemo, useCallback } from "react";
import i18next, { type i18n as I18nInstance } from "i18next";
import { I18nextProvider, initReactI18next, useTranslation } from "react-i18next";
import { getSharedInitOptions, resources, defaultNS } from "./i18n";
import {
  getCanonicalPath,
  buildLocalizedHref,
} from "./navigation";
import type { Dictionary } from "./language";

/* -------------------------------------------------------------------------- */
/*  Client-side i18next singleton                                               */
/* -------------------------------------------------------------------------- */

let clientInstance: I18nInstance | null = null;

function getOrCreateClientI18n(lang: string): I18nInstance {
  if (clientInstance) {
    if (clientInstance.language !== lang) {
      clientInstance.changeLanguage(lang);
    }
    return clientInstance;
  }

  const instance = i18next.createInstance();
  instance.use(initReactI18next).init({
    ...getSharedInitOptions(lang),
    react: {
      useSuspense: false,
    },
  });

  clientInstance = instance;
  return instance;
}

/* -------------------------------------------------------------------------- */
/*  Language context — reactive lang + dict                                      */
/* -------------------------------------------------------------------------- */

interface LanguageContextValue {
  /** Current active locale code */
  lang: string;
  /** Full dictionary object for backward-compatible `dict.section.key` access */
  dict: Dictionary;
  /**
   * Switch language instantly — no full page reload.
   * Updates i18next, dict, URL, cookie and localStorage in one call.
   */
  changeLanguage: (newLang: string) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

/* -------------------------------------------------------------------------- */
/*  Helper: get dictionary from bundled resources                                */
/* -------------------------------------------------------------------------- */

function getDictFromResources(lang: string): Dictionary {
  const res = (resources as Record<string, Record<string, unknown>>);
  return (res[lang]?.[defaultNS] ?? res["en"][defaultNS]) as Dictionary;
}

/* -------------------------------------------------------------------------- */
/*  Helper: persist language preference                                         */
/* -------------------------------------------------------------------------- */

function persistLanguage(lang: string) {
  // Cookie — needed by middleware (proxy.ts) for locale detection
  document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000; SameSite=Lax`;

  // localStorage — instant client-side reads + persistence
  try {
    localStorage.setItem("logitrack-language", lang);
  } catch {
    // localStorage unavailable (SSR, private browsing edge-case)
  }
}

/* -------------------------------------------------------------------------- */
/*  Helper: update URL without triggering full Next.js navigation                */
/* -------------------------------------------------------------------------- */

function updateUrlForLanguage(currentPathname: string, oldLang: string, newLang: string) {
  const segments = currentPathname.split("/");
  const pathWithoutLang = "/" + segments.slice(2).join("/");

  // Convert current localized path → canonical → new localized path
  const canonical = getCanonicalPath(pathWithoutLang, oldLang);
  const newPathname = buildLocalizedHref(canonical, newLang);

  // Use replaceState to update URL cosmetically — NO server round-trip
  window.history.replaceState(
    { ...window.history.state, as: newPathname, url: newPathname },
    "",
    newPathname
  );
}

/* -------------------------------------------------------------------------- */
/*  Provider                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * `DictionaryProvider` wraps:
 *  1. `I18nextProvider` — making `useTranslation()` available for new code
 *  2. `LanguageContext` — provides reactive `lang`, `dict`, and `changeLanguage()`
 *
 * Language switching is **instant** — no full page navigation required.
 */
export function DictionaryProvider({
  dict: serverDict,
  lang: serverLang,
  children,
}: {
  dict: Dictionary;
  lang: string;
  children: React.ReactNode;
}) {
  const i18nInstance = useMemo(() => getOrCreateClientI18n(serverLang), [serverLang]);

  const [lang, setLang] = useState(serverLang);
  const [dict, setDict] = useState(serverDict);

  const changeLanguage = useCallback(
    (newLang: string) => {
      if (newLang === lang) return;

      // 1. Switch i18next language — instant, resources are already bundled
      i18nInstance.changeLanguage(newLang);

      // 2. Update dictionary context for useDictionary() consumers
      const newDict = getDictFromResources(newLang);
      setDict(newDict);

      // 3. Update lang state
      setLang(newLang);

      // 4. Update URL without triggering full navigation
      const currentPathname = window.location.pathname;
      updateUrlForLanguage(currentPathname, lang, newLang);

      // 5. Persist preference (cookie + localStorage)
      persistLanguage(newLang);
    },
    [lang, i18nInstance]
  );

  const contextValue = useMemo<LanguageContextValue>(
    () => ({ lang, dict, changeLanguage }),
    [lang, dict, changeLanguage]
  );

  return (
    <I18nextProvider i18n={i18nInstance}>
      <LanguageContext.Provider value={contextValue}>
        {children}
      </LanguageContext.Provider>
    </I18nextProvider>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hooks                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Returns the full `{ lang, dict, changeLanguage }` context.
 * Use `changeLanguage(newLang)` for instant language switching.
 */
export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a DictionaryProvider");
  return ctx;
}

/**
 * Legacy hook — returns the full Dictionary object for `dict.section.key` access.
 * All existing consumer components use this hook and require zero changes.
 */
export function useDictionary(): Dictionary {
  const ctx = useContext(LanguageContext);
  if (!ctx)
    throw new Error("useDictionary must be used within a DictionaryProvider");
  return ctx.dict;
}

/**
 * Modern hook — wraps react-i18next's `useTranslation()`.
 */
export function useAppTranslation() {
  return useTranslation();
}
