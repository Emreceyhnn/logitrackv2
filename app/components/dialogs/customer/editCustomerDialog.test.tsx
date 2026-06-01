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
    saveChanges: "Save Changes",
  },
  customers: {
    dialogs: {
      editTitle: "Edit Customer",
      editSubtitle: "Editing {name}",
      successUpdate: "Updated successfully",
      errorUpdate: "Update failed",
      steps: {
        identity: "Identity",
        contact: "Contact",
      }
    },
    fields: {
      mainOffice: "Main Office"
    }
  },
  toasts: {
    loading: "Updating...",
  }
}));

mock.module("@/app/lib/language/DictionaryContext", {
  namedExports: { useDictionary: useDictionaryMock },
});

mock.module("@/app/hooks/useUser", {
  namedExports: { useUser: mock.fn(() => ({ user: { id: "user-1" } })) },
});

mock.module("@/app/components/googleMaps/GoogleMapsProvider", {
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

mock.module("@/app/lib/controllers/customer", {
  namedExports: { 
    updateCustomer: mock.fn(async () => ({}))
  },
});

mock.module("@/app/lib/validationSchema", {
  namedExports: {
    editCustomerValidationSchema: mock.fn(() => ({
      validate: async () => true,
    }))
  }
});

// Mock Sections
mock.module("./addCustomerDialog/sections/IdentitySection", {
  defaultExport: () => <div data-testid="identity-section">Identity Content</div>,
});
mock.module("./addCustomerDialog/sections/ContactSection", {
  defaultExport: () => <div data-testid="contact-section">Contact Content</div>,
});

// 2. Mock Theme
const customTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2", dark: "#115293" } as any,
  }
});

const mockAlpha = { main_05: "rgba()", main_10: "rgba()", main_20: "rgba()", main_30: "rgba()", main_50: "rgba()" };
(customTheme.palette.primary as any)._alpha = mockAlpha;
(customTheme.palette as any).divider_alpha = mockAlpha;
(customTheme.palette.common as any) = { white_alpha: mockAlpha };

import * as originalMui from "@mui/material";
const useThemeMock = mock.fn(() => customTheme);
mock.module("@mui/material", {
  namedExports: {
    ...originalMui,
    useTheme: useThemeMock,
  },
});

describe("EditCustomerDialog RTL Component", () => {
  let EditCustomerDialog: any;

  before(async () => {
    const mod = await import("./editCustomerDialog");
    EditCustomerDialog = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  const MOCK_CUSTOMER = {
    id: "cust-1",
    name: "Acme Corp",
    code: "CUST-001",
    industry: "Technology",
    taxId: "TAX-12345",
    email: "contact@acme.com",
    phone: "123-456-7890",
    locations: [],
  };

  describe("EditCustomerDialog() bileşeni", () => {
    it("should_RenderWizard_AndDisplayIdentityStep", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <EditCustomerDialog open={true} onClose={() => {}} onSuccess={() => {}} customer={MOCK_CUSTOMER} />
        </ThemeProvider>
      );

      // Assert basic renders
      expect(screen.getByText("Edit Customer")).toBeTruthy();
      expect(screen.getByText("Editing Acme Corp")).toBeTruthy();
      expect(screen.getByTestId("identity-section")).toBeTruthy();
    });

    it("should_TransitionToContactStep_WhenNextIsClicked", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <EditCustomerDialog open={true} onClose={() => {}} onSuccess={() => {}} customer={MOCK_CUSTOMER} />
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
