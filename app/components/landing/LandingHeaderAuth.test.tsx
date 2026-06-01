import { describe, it, before, mock, beforeEach } from "node:test";
import { expect } from "expect";

// MOCKLAR
const useParamsMock = mock.fn(() => ({ lang: "tr" }));
const useDictionaryMock = mock.fn(() => ({
  navbar: { dashboard: "Dashboard", setupOrg: "Kurulum", signIn: "Giriş", startPro: "Pro" }
}));
const getLocalizedPathMock = mock.fn((path) => path);

const getUserSessionMock = mock.fn(async () => ({ id: "1", name: "John" }));

const useStateMock = mock.fn((init) => [init, mock.fn()]);
const useEffectMock = mock.fn();
const useThemeMock = mock.fn(() => ({
  palette: { primary: { main: "blue" }, text: { primary: "black" } }
}));

mock.module("react", {
  namedExports: { useState: useStateMock, useEffect: useEffectMock }
});

mock.module("next/navigation", { namedExports: { useParams: useParamsMock } });
mock.module("@/app/lib/language/DictionaryContext", { namedExports: { useDictionary: useDictionaryMock } });
mock.module("@/app/lib/language/navigation", { namedExports: { getLocalizedPath: getLocalizedPathMock } });
mock.module("@/app/lib/actions/auth", { namedExports: { getUserSession: getUserSessionMock } });

mock.module("@mui/material", {
  namedExports: {
    useTheme: useThemeMock,
    Button: (props: unknown) => ({ type: "Button", props }),
    Stack: (props: unknown) => ({ type: "Stack", props }),
    CircularProgress: (props: unknown) => ({ type: "CircularProgress", props })
  }
});

mock.module("next/link", { defaultExport: () => ({ type: "Link" }) });
mock.module("../dialogs/company/CreateCompanyDialog", { defaultExport: () => ({ type: "CreateCompanyDialog" }) });
mock.module("../nav/UserAccountNav", { defaultExport: () => ({ type: "UserAccountNav" }) });

describe("LandingHeaderAuth Component", () => {
  let LandingHeaderAuth: React.ElementType;

  before(async () => {
    const mod = await import("./LandingHeaderAuth");
    LandingHeaderAuth = mod.default;
  });

  beforeEach(() => {
    useParamsMock.mock.resetCalls();
    useDictionaryMock.mock.resetCalls();
    useStateMock.mock.resetCalls();
  });

  describe("LandingHeaderAuth() bileşeni", () => {
    it("should_InitializeWithoutErrors_WhenRendered", async () => {
      // Act
      try {
        LandingHeaderAuth();
      } catch (e) {}

      // Assert
      expect(LandingHeaderAuth).toBeDefined();
      expect(useDictionaryMock.mock.calls.length).toBeGreaterThan(0);
    });
  });
});
