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


mock.module("./firstStep.tsx", {
  defaultExport: () => <div data-testid="first-step">First Step</div>,
});
mock.module("./secondStep.tsx", {
  defaultExport: () => <div data-testid="second-step">Second Step</div>,
});
mock.module("./thirdStep.tsx", {
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
