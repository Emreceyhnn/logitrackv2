/* eslint-disable @typescript-eslint/no-explicit-any */
import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// 1. Mock Contexts & Utils
const useDictionaryMock = mock.fn(() => ({
  routes: {
    dialogs: {
      addTitle: "Add Route",
      addSubtitle: "Create a new route",
      steps: {
        schedule: "Schedule",
        locations: "Locations",
        assignments: "Assignments",
      }
    }
  },
  toasts: {
    loading: "Loading...",
    successAdd: "Created",
    errorGeneric: "Error",
  },
  common: {
    cancel: "Cancel",
    save: "Save",
    back: "Back",
    next: "Next",
  },
  validation: {
    genericFormError: "Form Error",
  }
}));

mock.module("@/app/lib/language/DictionaryContext", {
  namedExports: { useDictionary: useDictionaryMock },
});

const toastMock = {
  success: mock.fn(),
  error: mock.fn(),
  info: mock.fn(),
  promise: mock.fn(async (promise) => await promise),
};

mock.module("sonner", {
  namedExports: { toast: toastMock },
});

mock.module("@/app/lib/controllers/routes", {
  namedExports: { createRoute: mock.fn(async () => ({})) },
});

mock.module("@/app/lib/controllers/shipments", {
  namedExports: { getShipments: mock.fn(async () => []) },
});

mock.module("@/app/lib/controllers/warehouse", {
  namedExports: { getWarehouses: mock.fn(async () => []) },
});

const useUserMock = mock.fn(() => ({
  user: { timezone: "UTC" }
}));
mock.module("@/app/hooks/useUser", {
  namedExports: { useUser: useUserMock },
});

// Mock Validation
mock.module("@/app/lib/validationSchema", {
  namedExports: { addRouteValidationSchema: () => ({}) },
});

// Mock Date Utils
mock.module("@/app/lib/utils/date", {
  namedExports: {
    toUTC: (d: any) => d,
  },
});

// Mock Subcomponents
mock.module("@/app/components/googleMaps/GoogleMapsProvider", {
  namedExports: { GoogleMapsProvider: ({ children }: any) => <>{children}</> },
});
mock.module("./firstStep", {
  defaultExport: () => <div data-testid="first-step">First Step</div>,
});
mock.module("./secondStep", {
  defaultExport: () => <div data-testid="second-step">Second Step</div>,
});
mock.module("./thirdStep", {
  defaultExport: () => <div data-testid="third-step">Third Step</div>,
});

// 2. Mock Theme
const customTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#1976d2", dark: "#115293" } as any,
  }
});

(customTheme.palette.primary as any)._alpha = { main_20: "rgba()" };
(customTheme.palette as any).divider_alpha = { main_05: "rgba()", main_10: "rgba()" };

import * as originalMui from "@mui/material";
const useThemeMock = mock.fn(() => customTheme);
mock.module("@mui/material", {
  namedExports: {
    ...originalMui,
    useTheme: useThemeMock,
  },
});

describe("AddRouteDialog RTL Component", () => {
  let AddRouteDialog: any;

  before(async () => {
    const mod = await import("./index");
    AddRouteDialog = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  describe("AddRouteDialog() bileşeni", () => {
    it("should_RenderAddRouteWizard_AtFirstStep", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <AddRouteDialog open={true} onClose={() => {}} />
        </ThemeProvider>
      );

      // Assert
      expect(screen.getByText(/Add Route/i)).toBeTruthy();
      
      // First step component should be rendered
      expect(screen.getByTestId("first-step")).toBeTruthy();
    });
  });
});
