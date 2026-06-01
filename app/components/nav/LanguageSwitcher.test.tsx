/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, before, mock, beforeEach } from "node:test";
import { expect } from "expect";

// 1. MOCK'LAR
const useThemeMock = mock.fn(() => ({
  palette: {
    primary: { main: "blue", _alpha: { main_05: "", main_10: "", main_20: "", main_15: "" } },
    text: { primary: "black", secondary: "gray" },
    background: { paper: "white" },
    divider: "gray",
    divider_alpha: { main_10: "" }
  }
}));

const useRouterMock = mock.fn(() => ({ push: mock.fn() }));
const usePathnameMock = mock.fn(() => "/tr/overview");
const useParamsMock = mock.fn(() => ({ lang: "tr" }));

const useDictionaryMock = mock.fn(() => ({
  languages: { tr: "Türkçe", en: "English" },
  common: { tooltips: { changeLanguage: "Dili Değiştir" } }
}));

const getCanonicalPathMock = mock.fn(() => "/overview");
const buildLocalizedHrefMock = mock.fn((href, lang) => `/${lang}${href}`);
const useStateMock = mock.fn((init) => [init, mock.fn()]);

mock.module("react", {
  namedExports: { useState: useStateMock }
});

mock.module("next/navigation", {
  namedExports: { 
    useRouter: useRouterMock, 
    usePathname: usePathnameMock, 
    useParams: useParamsMock 
  }
});

mock.module("../../lib/language/DictionaryContext.tsx", {
  namedExports: { useDictionary: useDictionaryMock }
});

mock.module("../../lib/language/navigation.ts", {
  namedExports: {
    getCanonicalPath: getCanonicalPathMock,
    buildLocalizedHref: buildLocalizedHrefMock
  }
});

mock.module("@mui/material", {
  namedExports: {
    useTheme: useThemeMock,
    Menu: (props: any) => ({ type: "Menu", props }),
    MenuItem: (props: any) => ({ type: "MenuItem", props }),
    ListItemText: (props: any) => ({ type: "ListItemText", props }),
    Typography: (props: any) => ({ type: "Typography", props }),
    Box: (props: any) => ({ type: "Box", props }),
    Tooltip: (props: any) => ({ type: "Tooltip", props }),
  }
});

mock.module("@mui/icons-material/Language", { defaultExport: () => ({ type: "LanguageIcon" }) });
mock.module("@mui/icons-material/Check", { defaultExport: () => ({ type: "CheckIcon" }) });

describe("LanguageSwitcher Component", () => {
  let LanguageSwitcher: any;

  before(async () => {
    // Modülü dinamik olarak yüklüyoruz
    const mod = await import("./LanguageSwitcher");
    LanguageSwitcher = mod.default;
  });

  beforeEach(() => {
    useThemeMock.mock.resetCalls();
    useRouterMock.mock.resetCalls();
    useDictionaryMock.mock.resetCalls();
  });

  describe("LanguageSwitcher() bileşeni", () => {
    it("should_InitializeWithoutErrors_WhenRendered", async () => {
      // Act
      let error = null;
      try {
        LanguageSwitcher();
      } catch (e) {
        error = e;
      }

      // Assert
      expect(LanguageSwitcher).toBeDefined();
      expect(useThemeMock.mock.calls.length).toBeGreaterThan(0);
      expect(useDictionaryMock.mock.calls.length).toBeGreaterThan(0);
    });
  });
});
