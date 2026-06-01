/* eslint-disable @typescript-eslint/no-explicit-any */
import "global-jsdom/register";
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
    nextStep: "Next Step",
    fillRequired: "Fill Required",
  },
  customers: {
    dialogs: {
      addTitle: "Add Customer",
      successAdd: "Created successfully",
      errorAdd: "Creation failed",
      steps: {
        identity: "Identity",
        contact: "Contact",
      }
    },
    registerNewPartner: "Register New Partner",
    addCustomer: "Add Customer",
  },
  toasts: {
    loading: "Creating...",
  }
}));

mock.module("../../../../lib/language/DictionaryContext.tsx", {
  namedExports: { useDictionary: useDictionaryMock },
});

mock.module("../../../../hooks/useUser.ts", {
  namedExports: { useUser: mock.fn(() => ({ user: { id: "user-1" } })) },
});

mock.module("../../../googleMaps/GoogleMapsProvider.tsx", {
  namedExports: { GoogleMapsProvider: ({ children }: any) => <div data-testid="gmaps-provider">{children}</div> },
});

const toastMock = {
  success: mock.fn(),
  error: mock.fn(),
  promise: mock.fn(async (promise) => await promise),
};

mock.module("sonner", {
  namedExports: { toast: toastMock },
});

mock.module("../../../../lib/controllers/customer.ts", {
  namedExports: { 
    createCustomer: mock.fn(async () => ({}))
  },
});

mock.module("../../../../lib/validationSchema.ts", {
  namedExports: {
    addCustomerValidationSchema: mock.fn(() => ({
      validate: async () => true,
    }))
  }
});

// Mock Sections
mock.module("./sections/IdentitySection.tsx", {
  defaultExport: () => <div data-testid="identity-section">Identity Content</div>,
});
mock.module("./sections/ContactSection.tsx", {
  defaultExport: () => <div data-testid="contact-section">Contact Content</div>,
});

// 2. Mock Theme
const customTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2", dark: "#115293" } as any,
    background: { default: "#0B0F19" } as any,
  }
});

const mockAlpha = { main_03: "rgba()", main_05: "rgba()", main_08: "rgba()", main_10: "rgba()", main_20: "rgba()", main_25: "rgba()", main_30: "rgba()", main_40: "rgba()", main_50: "rgba()", main_60: "rgba()" };
(customTheme.palette.primary as any)._alpha = mockAlpha;
(customTheme.palette as any).divider_alpha = mockAlpha;
(customTheme.palette.background as any).default_alpha = mockAlpha;
(customTheme.palette.common as any) = { white_alpha: mockAlpha };

import * as originalMui from "@mui/material";
const useThemeMock = mock.fn(() => customTheme);
mock.module("@mui/material", {
  namedExports: {
    ...originalMui,
    useTheme: useThemeMock,
  },
});

describe("AddCustomerDialog RTL Component", () => {
  let AddCustomerDialog: any;

  before(async () => {
    const mod = await import("./index");
    AddCustomerDialog = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  describe("AddCustomerDialog() bileşeni", () => {
    it("should_RenderWizard_AndDisplayIdentityStep", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <AddCustomerDialog open={true} onClose={() => {}} />
        </ThemeProvider>
      );

      // Assert basic renders
      expect(screen.getByText("Add Customer")).toBeTruthy();
      expect(screen.getByTestId("identity-section")).toBeTruthy();
    });

    it("should_TransitionToContactStep_WhenNextIsClicked", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <AddCustomerDialog open={true} onClose={() => {}} />
        </ThemeProvider>
      );

      const nextButton = screen.getByText("Next Step");
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByTestId("contact-section")).toBeTruthy();
      });
    });
  });
});
