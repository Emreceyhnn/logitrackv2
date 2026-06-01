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
    next: "Next",
    save: "Save",
    errorOccurred: "Error",
  },
  inventory: {
    dialogs: {
      addTitle: "Add Inventory",
      addSubtitle: "Add new product",
      steps: {
        details: "Details",
        storage: "Storage",
        review: "Review",
      }
    }
  },
  toasts: {
    loading: "Loading...",
    successAdd: "Item Added",
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

mock.module("../../../../lib/controllers/warehouse.ts", {
  namedExports: { 
    addInventoryItem: mock.fn(async () => ({}))
  },
});

mock.module("../../../../hooks/useUser.ts", {
  namedExports: { 
    useUser: mock.fn(() => ({ user: { currency: "USD" } }))
  },
});

mock.module("../../../../lib/actions/upload.ts", {
  namedExports: { 
    uploadImageAction: mock.fn(async () => ({ url: "https://example.com/image.png" }))
  },
});

// Mock Sections
mock.module("./sections/ItemDetailsSection.tsx", {
  defaultExport: () => <div data-testid="item-details-section">Item Details</div>,
});
mock.module("./sections/StorageLevelsSection.tsx", {
  defaultExport: () => <div data-testid="storage-levels-section">Storage Levels</div>,
});
mock.module("./sections/ReviewSection.tsx", {
  defaultExport: () => <div data-testid="review-section">Review</div>,
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

describe("AddInventoryDialog RTL Component", () => {
  let AddInventoryDialog: any;

  before(async () => {
    const mod = await import("./index");
    AddInventoryDialog = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  describe("AddInventoryDialog() bileşeni", () => {
    it("should_RenderWizard_AndDisplayFirstStep", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <AddInventoryDialog open={true} onClose={() => {}} />
        </ThemeProvider>
      );

      // Assert basic renders
      expect(screen.getByText("Add Inventory")).toBeTruthy();
      expect(screen.getByTestId("item-details-section")).toBeTruthy();
    });
  });
});
