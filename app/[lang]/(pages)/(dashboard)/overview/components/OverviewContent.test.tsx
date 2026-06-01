import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// 1. Mock Contexts & Utils
const useDictionaryMock = mock.fn(() => ({
  overview: {
    title: "Overview",
    activeShipments: "Active",
    delayedShipments: "Delayed",
    vehiclesOnTrip: "On Trip",
    vehiclesInService: "In Service",
    availableVehicles: "Available",
    activeDrivers: "Drivers",
    warehouses: "Warehouses",
    inventorySkus: "SKUs"
  },
  common: {
    lastUpdated: "Last Updated",
    refreshDashboard: "Refresh"
  }
}));

mock.module("@/app/lib/language/DictionaryContext", {
  namedExports: { useDictionary: useDictionaryMock },
});

const mockRefetch = mock.fn(async () => {});
mock.module("@/app/hooks/useOverview", {
  namedExports: { 
    useOverviewData: mock.fn(() => ({
      data: {
        stats: { activeShipments: 10 },
        statsTrends: {},
        mapData: [],
        dailyOps: {},
        fuelLogs: [],
        shipmentStatus: {},
        alerts: [],
        warehouseCapacity: {},
        picksAndPacks: {},
        shipmentVolume: {},
        lowStockItems: []
      },
      isLoading: false,
      refetch: mockRefetch,
    }))
  },
});

mock.module("@/app/hooks/useDateSettings", {
  namedExports: { 
    useDateSettings: mock.fn(() => ({
      timezone: "UTC",
      dateFormat: "DD/MM/YYYY"
    }))
  },
});

// Mock child components
mock.module("@/app/components/cards/KpiCards", {
  defaultExport: ({ kpis }: any) => <div data-testid="kpi-cards">KPI Cards {kpis.length}</div>,
});
mock.module("@/app/components/dashboard/overview/dailyOperations", {
  defaultExport: () => <div data-testid="daily-ops">Daily Ops</div>,
});
mock.module("@/app/components/dashboard/overview/fuelByVehicleCard", {
  defaultExport: () => <div data-testid="fuel-logs">Fuel Logs</div>,
});
mock.module("@/app/components/dashboard/overview/shipmentsByStatusCard", {
  defaultExport: () => <div data-testid="shipment-status">Shipment Status</div>,
});
mock.module("@/app/components/dashboard/overview/actionRequiredCard", {
  defaultExport: () => <div data-testid="alerts">Alerts</div>,
});
mock.module("@/app/components/dashboard/overview/warehouseCapacityCard", {
  defaultExport: () => <div data-testid="warehouse-cap">Warehouse Capacity</div>,
});
mock.module("@/app/components/dashboard/overview/picsPacksDailyCard", {
  defaultExport: () => <div data-testid="picks-packs">Picks Packs</div>,
});
mock.module("@/app/components/dashboard/overview/onTimeTrends", {
  defaultExport: () => <div data-testid="shipment-volume">Shipment Volume</div>,
});
mock.module("@/app/components/dashboard/overview/inventoryCard", {
  defaultExport: () => <div data-testid="low-stock">Low Stock</div>,
});
mock.module("@/app/components/dashboard/overview/overViewMapCard", {
  defaultExport: () => <div data-testid="overview-map">Overview Map</div>,
});

// 2. Mock Theme
const customTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2", dark: "#115293" } as any,
    info: { main: "#0288d1" } as any,
    secondary: { main: "#9c27b0" } as any,
    warning: { main: "#ed6c02" } as any,
    success: { main: "#2e7d32" } as any,
    error: { main: "#d32f2f" } as any,
    kpi: { violet: "#ccc", indigo: "#ccc", sky: "#ccc" } as any,
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

describe("OverviewContent Component", () => {
  let OverviewContent: any;

  before(async () => {
    const mod = await import("./OverviewContent");
    OverviewContent = mod.default;
  });

  afterEach(() => {
    cleanup();
    mockRefetch.mock.resetCalls();
  });

  describe("OverviewContent() Render Testleri", () => {
    it("should_RenderDashboardElements_Correctly", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <OverviewContent />
        </ThemeProvider>
      );

      // Assert basic renders
      expect(screen.getByText("Overview")).toBeTruthy();
      expect(screen.getByTestId("kpi-cards")).toBeTruthy();
      expect(screen.getByTestId("daily-ops")).toBeTruthy();
      expect(screen.getByTestId("fuel-logs")).toBeTruthy();
      expect(screen.getByTestId("shipment-status")).toBeTruthy();
      expect(screen.getByTestId("alerts")).toBeTruthy();
      expect(screen.getByTestId("warehouse-cap")).toBeTruthy();
      expect(screen.getByTestId("picks-packs")).toBeTruthy();
      expect(screen.getByTestId("shipment-volume")).toBeTruthy();
      expect(screen.getByTestId("low-stock")).toBeTruthy();
      expect(screen.getByTestId("overview-map")).toBeTruthy();
    });

    it("should_CallRefetch_WhenRefreshButtonClicked", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <OverviewContent />
        </ThemeProvider>
      );

      // Refresh button is identified by the tooltip title or icon, we can use getByTestId if we add one or getByRole
      const refreshBtn = screen.getByRole("button", { name: "Refresh" });
      fireEvent.click(refreshBtn);

      await waitFor(() => {
        expect(mockRefetch.mock.calls.length).toBe(1);
      });
    });
  });
});
