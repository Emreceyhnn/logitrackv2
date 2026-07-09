 
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// 1. Mock Contexts & Utils
const useDictionaryMock = mock.fn(() => ({
  common: {
    cancel: "Cancel",
    back: "Back",
    next: "Next",
    save: "Save",
    errorOccurred: "Error",
  },
  drivers: {
    dialogs: {
      addTitle: "Add Driver",
    },
    subtitle: "Add new driver",
    tabs: {
      personalInfo: "Personal Info",
      operationalInfo: "Operational Info",
    }
  },
  toasts: {
    loading: "Loading...",
  }
}));

mock.module("../../../../lib/language/DictionaryContext.tsx", {
  namedExports: { useDictionary: useDictionaryMock },
});

const toastMock = {
  success: mock.fn(),
  error: mock.fn(),
  promise: mock.fn(async (promise) => await promise),
};

mock.module("sonner", {
  namedExports: { toast: toastMock },
});

mock.module("../../../../lib/controllers/driver.ts", {
  namedExports: { 
    createDriver: mock.fn(async () => ({})),
    getEligibleUsersForDriver: mock.fn(async () => [])
  },
});

mock.module("../../../../lib/actions/upload.ts", {
  namedExports: { 
    uploadImageAction: mock.fn(async () => ({ url: "https://example.com/image.png" }))
  },
});

mock.module("../../../../lib/validationSchema.ts", {
  namedExports: {
    addDriverValidationSchema: mock.fn(() => ({
      validate: async () => true,
    }))
  }
});

// Mock Sections
mock.module("./firstStep.tsx", {
  defaultExport: () => <div data-testid="first-step-section">First Step Content</div>,
});
mock.module("./secondStep.tsx", {
  defaultExport: () => <div data-testid="second-step-section">Second Step Content</div>,
});

// 2. Mock Theme
const customTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2", dark: "#115293" } as unknown,
    background: { midnight: { main: "#0B0F19" } } as unknown,
  }
});

const mockAlpha = { main_05: "rgba()", main_10: "rgba()", main_20: "rgba()", main_30: "rgba()", main_50: "rgba()" };
(customTheme.palette.primary as unknown)._alpha = mockAlpha;
(customTheme.palette as unknown).divider_alpha = mockAlpha;
(customTheme.palette.common as unknown) = { white_alpha: mockAlpha };

import * as originalMui from "@mui/material";
const useThemeMock = mock.fn(() => customTheme);
mock.module("@mui/material", {
  namedExports: {
    ...originalMui,
    useTheme: useThemeMock,
  },
});

describe("AddDriverDialog RTL Component", () => {
  let AddDriverDialog: unknown;

  before(async () => {
    const mod = await import("./index");
    AddDriverDialog = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  describe("AddDriverDialog() bileşeni", () => {
    it("should_RenderWizard_AndDisplayFirstStep", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <AddDriverDialog open={true} onClose={() => {}} />
        </ThemeProvider>
      );

      // Assert basic renders
      expect(screen.getByText("Add Driver")).toBeTruthy();
      expect(screen.getByTestId("first-step-section")).toBeTruthy();
    });

    it("should_TransitionToSecondStep_WhenNextIsClicked", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <AddDriverDialog open={true} onClose={() => {}} />
        </ThemeProvider>
      );

      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByTestId("second-step-section")).toBeTruthy();
      });
    });
  });
});
