import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";

// Mock utilities
mock.module("@/app/lib/language/language", {
  namedExports: {
    getDictionary: mock.fn(async () => ({ landing: { metaTitle: "LogiTrack" } }))
  }
});
mock.module("@/app/lib/actions/theme", {
  namedExports: { getUserTheme: mock.fn(async () => "dark") }
});
mock.module("@/app/lib/auth-middleware", {
  namedExports: { getAuthenticatedUser: mock.fn(async () => null) }
});

// Mock providers and components
mock.module("@/app/lib/theme/themeProviders", { defaultExport: ({ children }: any) => <div data-testid="theme-provider">{children}</div> });
mock.module("@/app/lib/language/DictionaryContext", { namedExports: { DictionaryProvider: ({ children }: any) => <div data-testid="dict-provider">{children}</div> } });
mock.module("@/app/lib/context/UserContext", { namedExports: { UserProvider: ({ children }: any) => <div data-testid="user-provider">{children}</div> } });
mock.module("@/app/components/seo/JsonLd", { defaultExport: () => <script data-testid="json-ld" /> });
mock.module("@vercel/speed-insights/next", { namedExports: { SpeedInsights: () => <div data-testid="speed-insights" /> } });

describe("RootLayout Component", () => {
  let RootLayout: any;

  before(async () => {
    const mod = await import("./layout");
    RootLayout = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  describe("RootLayout() Render Testleri", () => {
    it("should_RenderProvidersAndChildren_Correctly", async () => {
      // Act
      const element = await RootLayout({
        children: <div data-testid="child-content">Root Content</div>,
        params: Promise.resolve({ lang: "en" })
      });
      render(element);

      // Assert
      expect(screen.getByTestId("theme-provider")).toBeTruthy();
      expect(screen.getByTestId("dict-provider")).toBeTruthy();
      expect(screen.getByTestId("user-provider")).toBeTruthy();
      expect(screen.getByTestId("child-content")).toBeTruthy();
      expect(screen.getByTestId("json-ld")).toBeTruthy();
      expect(screen.getByTestId("speed-insights")).toBeTruthy();
    });
  });
});
