/* eslint-disable @typescript-eslint/no-explicit-any */
import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// 1. Mock Contexts & Utils
const useDictionaryMock = mock.fn(() => ({
  common: {
    edit: "Edit",
    delete: "Delete",
  },
  drivers: {
    tabs: {
      overview: "Overview",
      documents: "Documents",
    }
  }
}));

mock.module("@/app/lib/language/DictionaryContext", {
  namedExports: { useDictionary: useDictionaryMock },
});

mock.module("@/app/lib/priorityColor", {
  namedExports: { 
    getStatusMeta: mock.fn(() => ({ paletteKey: "success", color: "green", label: "Active" }))
  },
});

// Mock Tabs
mock.module("./overviewTab", {
  defaultExport: () => <div data-testid="overview-tab">Overview Content</div>,
});
mock.module("./documentsTab", {
  defaultExport: () => <div data-testid="documents-tab">Documents Content</div>,
});

// 2. Mock Theme
const customTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2", dark: "#115293" } as any,
    success: { main: "#2e7d32" } as any,
  }
});

const mockAlpha = { main_00: "rgba()", main_02: "rgba()", main_03: "rgba()", main_05: "rgba()", main_10: "rgba()", main_15: "rgba()", main_20: "rgba()", main_30: "rgba()" };
(customTheme.palette.primary as any)._alpha = mockAlpha;
(customTheme.palette.success as any)._alpha = mockAlpha;
(customTheme.palette as any).divider_alpha = mockAlpha;
(customTheme.palette.background as any).paper_alpha = mockAlpha;
(customTheme.palette.text as any).secondary_alpha = mockAlpha;
(customTheme.palette.common as any) = { white_alpha: mockAlpha, black_alpha: mockAlpha };

import * as originalMui from "@mui/material";
const useThemeMock = mock.fn(() => customTheme);
mock.module("@mui/material", {
  namedExports: {
    ...originalMui,
    useTheme: useThemeMock,
  },
});

describe("DriverDialog RTL Component", () => {
  let DriverDialog: any;

  before(async () => {
    const mod = await import("./index");
    DriverDialog = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  const MOCK_DRIVER = {
    id: "driver-1",
    status: "ACTIVE",
    employeeId: "EMP-001",
    phone: "1234567890",
    user: {
      name: "John",
      surname: "Doe",
      email: "john@example.com",
    }
  };

  describe("DriverDialog() bileşeni", () => {
    it("should_RenderOverviewTab_ByDefault", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <DriverDialog open={true} onClose={() => {}} driverData={MOCK_DRIVER} />
        </ThemeProvider>
      );

      // Assert
      expect(screen.getByText("John Doe")).toBeTruthy();
      expect(screen.getByTestId("overview-tab")).toBeTruthy();
    });

    it("should_SwitchToDocumentsTab_WhenClicked", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <DriverDialog open={true} onClose={() => {}} driverData={MOCK_DRIVER} />
        </ThemeProvider>
      );

      const docsTab = screen.getByRole("tab", { name: "Documents" });
      fireEvent.click(docsTab);

      // Assert
      expect(screen.getByTestId("documents-tab")).toBeTruthy();
    });
  });
});
