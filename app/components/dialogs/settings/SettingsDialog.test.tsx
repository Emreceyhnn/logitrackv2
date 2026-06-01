import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// 1. Mock Contexts
const useDictionaryMock = mock.fn(() => ({
  settings: {
    dialogs: {
      success: {
        regional: "Regional settings saved",
        notifications: "Notifications saved",
      },
      tabs: {
        localization: "Localization",
        signals: "Signals",
        visualEngine: "Visual Engine",
      },
    },
  },
}));

const useUserContextMock = mock.fn(() => ({
  user: {
    id: "u1",
    currency: "USD",
    timezone: "UTC",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    notifEmailShipment: true,
    notifEmailMaint: true,
    notifEmailWeekly: false,
    notifPushAssignment: true,
    notifPushDelay: true,
  },
}));

mock.module("@/app/lib/language/DictionaryContext", {
  namedExports: { useDictionary: useDictionaryMock },
});

mock.module("@/app/lib/context/UserContext", {
  namedExports: { useUserContext: useUserContextMock },
});

// 2. Mock next/navigation
const useRouterMock = mock.fn(() => ({ push: mock.fn(), refresh: mock.fn() }));
const usePathnameMock = mock.fn(() => "/tr/dashboard");
const useParamsMock = mock.fn(() => ({ lang: "tr" }));

mock.module("next/navigation", {
  namedExports: {
    useRouter: useRouterMock,
    usePathname: usePathnameMock,
    useParams: useParamsMock,
  },
});

// 3. Mock External Libraries and API Controllers
mock.module("sonner", {
  namedExports: { toast: { success: mock.fn(), error: mock.fn() } },
});

mock.module("@/app/lib/controllers/users", {
  namedExports: {
    updateUserRegionalSettings: mock.fn(async () => ({})),
    updateUserNotificationSettings: mock.fn(async () => ({})),
  },
});

mock.module("@/app/lib/language/navigation", {
  namedExports: {
    getLocalizedPath: mock.fn(() => "/en/dashboard"),
    getCanonicalPath: mock.fn(() => "/dashboard"),
  },
});

mock.module("framer-motion", {
  namedExports: {
    motion: {
      div: ({ children }: { children?: React.ReactNode }) => <div data-testid="motion-div">{children}</div>,
    },
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  },
});

// 4. Mock Subcomponents
mock.module("./components/SettingsHeader", { defaultExport: () => <div data-testid="settings-header" /> });
mock.module("./components/RegionalTab", { defaultExport: () => <div data-testid="regional-tab" /> });
mock.module("./components/NotificationsTab", { defaultExport: () => <div data-testid="notifications-tab" /> });
mock.module("./components/AppearanceTab", { defaultExport: () => <div data-testid="appearance-tab" /> });

// 5. Mock Theme
const customTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" } as unknown,
    divider_alpha: { main_08: "rgba()" } as unknown,
  }
});
(customTheme.palette.primary as unknown)._alpha = { main_50: "rgba()" };

import * as originalMui from "@mui/material";
const useThemeMock = mock.fn(() => customTheme);
mock.module("@mui/material", {
  namedExports: {
    ...originalMui,
    useTheme: useThemeMock,
  },
});

// 6. Mock localStorage
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: mock.fn(() => "dark"),
    setItem: mock.fn(),
    removeItem: mock.fn(),
    clear: mock.fn(),
  },
  writable: true
});

describe("SettingsDialog RTL Component", () => {
  let SettingsDialog: React.ElementType;

  before(async () => {
    const mod = await import("./SettingsDialog");
    SettingsDialog = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  describe("SettingsDialog() bileşeni", () => {
    it("should_RenderSettingsDialog_AndDefaultToRegionalTab", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <SettingsDialog open={true} onClose={() => {}} />
        </ThemeProvider>
      );

      // Assert
      expect(screen.getByTestId("settings-header")).toBeTruthy();
      
      // Check tabs
      expect(screen.getByText(/Localization/i)).toBeTruthy();
      expect(screen.getByText(/Signals/i)).toBeTruthy();
      expect(screen.getByText(/Visual Engine/i)).toBeTruthy();

      // Check default active tab component
      expect(screen.getByTestId("regional-tab")).toBeTruthy();
      expect(screen.queryByTestId("notifications-tab")).toBeNull();
      expect(screen.queryByTestId("appearance-tab")).toBeNull();
    });
  });
});
