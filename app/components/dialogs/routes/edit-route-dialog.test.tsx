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
      editTitle: "Edit Route",
      editSubtitle: "Modify route parameters",
      steps: {
        schedule: "Schedule",
        locations: "Locations",
        assignments: "Assignments",
      }
    }
  },
  toasts: {
    loading: "Loading...",
    successUpdate: "Updated",
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


mock.module("./addRouteDialog/firstStep.tsx", {
  defaultExport: () => <div data-testid="first-step">First Step</div>,
});
mock.module("./addRouteDialog/secondStep.tsx", {
  defaultExport: () => <div data-testid="second-step">Second Step</div>,
});
mock.module("./addRouteDialog/thirdStep.tsx", {
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

const MOCK_ROUTE = {
  id: "route-123",
  status: "PLANNED",
  name: "Morning Delivery",
  startTime: new Date().toISOString(),
  endTime: new Date().toISOString(),
  distanceKm: 120,
};

describe("EditRouteDialog RTL Component", () => {
  let EditRouteDialog: any;

  before(async () => {
    const mod = await import("./edit-route-dialog");
    EditRouteDialog = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  describe("EditRouteDialog() bileşeni", () => {
    it("should_RenderFormFields_AndPopulateWithRouteData", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <EditRouteDialog open={true} onClose={() => {}} route={MOCK_ROUTE} />
        </ThemeProvider>
      );

      // Assert
      expect(screen.getByText(/Edit Route/i)).toBeTruthy();
      
      // Step 1 should be active by default
      expect(screen.getByTestId("first-step")).toBeTruthy();
    });
  });
});
