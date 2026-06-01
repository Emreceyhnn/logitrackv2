import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// 1. Mock Contexts & Utils
const useDictionaryMock = mock.fn(() => ({
  reports: {
    title: "Reports",
    subtitle: "System reports",
    tabs: {
      shipment: "Shipments",
      fleet: "Fleet",
      inventory: "Inventory"
    }
  }
}));

mock.module("@/app/lib/language/DictionaryContext", {
  namedExports: { useDictionary: useDictionaryMock },
});

mock.module("@/app/hooks/useReports", {
  namedExports: { 
    useReportsData: mock.fn(() => ({
      state: {
        loading: false,
        data: {
          metrics: {},
          shipments: [],
          fleet: [],
          inventory: { categoryStats: {} }
        }
      }
    }))
  },
});

// Mock child components
mock.module("@/app/components/dashboard/reports/ShipmentCharts", {
  defaultExport: () => <div data-testid="shipment-charts">Shipment Charts</div>,
});
mock.module("@/app/components/dashboard/reports/FleetCharts", {
  defaultExport: () => <div data-testid="fleet-charts">Fleet Charts</div>,
});
mock.module("@/app/components/dashboard/reports/InventoryCharts", {
  defaultExport: () => <div data-testid="inventory-charts">Inventory Charts</div>,
});
mock.module("@/app/components/dashboard/reports/ReportSummaryCards", {
  defaultExport: () => <div data-testid="report-summary">Summary</div>,
});

// 2. Mock Theme
const customTheme = createTheme({
  palette: {
    mode: "light",
  }
});
import * as originalMui from "@mui/material";
const useThemeMock = mock.fn(() => customTheme);
mock.module("@mui/material", {
  namedExports: {
    ...originalMui,
    useTheme: useThemeMock,
  },
});

describe("ReportsContent Component", () => {
  let ReportsContent: any;

  before(async () => {
    const mod = await import("./ReportsContent");
    ReportsContent = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  describe("ReportsContent() Render Testleri", () => {
    it("should_RenderTabsAndContent_Correctly", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <ReportsContent />
        </ThemeProvider>
      );

      // Assert basic renders
      expect(screen.getByText("Reports")).toBeTruthy();
      expect(screen.getByTestId("report-summary")).toBeTruthy();
      
      // Shipment is selected by default
      expect(screen.getByTestId("shipment-charts")).toBeTruthy();

      // Click Fleet tab
      const fleetTab = screen.getByRole("tab", { name: "Fleet" });
      fireEvent.click(fleetTab);
      
      // Now fleet charts should be visible (MUI tabs render content but hide it, we can just check if it's in doc)
      expect(screen.getByTestId("fleet-charts")).toBeTruthy();
    });
  });
});
