import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Mock next/navigation
mock.module("next/navigation", {
  namedExports: {
    useSearchParams: mock.fn(() => ({
      get: mock.fn(() => null)
    }))
  }
});

// 1. Mock Contexts & Utils
const useDictionaryMock = mock.fn(() => ({
  shipments: {
    title: "Shipments",
    subtitle: "Manage shipments",
    addShipment: "Add Shipment",
    dashboard: {
      totalShipments: "Total",
      activeShipments: "Active",
      delayedShipments: "Delayed",
      inTransit: "In Transit"
    },
    deleteTitle: "Delete",
    deleteDesc: "Delete {id}?"
  }
}));

mock.module("@/app/lib/language/DictionaryContext", {
  namedExports: { useDictionary: useDictionaryMock },
});

const mockRefetch = mock.fn(async () => {});
const mockDeleteMutateAsync = mock.fn(async () => {});

mock.module("@/app/hooks/useShipments", {
  namedExports: { 
    useShipmentsWithDashboard: mock.fn(() => ({
      data: {
        shipments: [{ id: "s1", trackingId: "TRK-1" }],
        stats: { total: 10, active: 5, delayed: 0, inTransit: 2 },
        statsTrends: {},
        totalCount: 1,
        volumeData: [],
        statusData: []
      },
      isLoading: false,
      refetch: mockRefetch,
    })),
    useShipmentMutations: mock.fn(() => ({
      deleteShipment: { mutateAsync: mockDeleteMutateAsync, isPending: false }
    }))
  },
});

// Mock child components
mock.module("@/app/components/cards/KpiCards", {
  defaultExport: () => <div data-testid="kpi-cards">KPI Cards</div>,
});
mock.module("@/app/components/dashboard/shipments/shipmentTable", {
  defaultExport: ({ actions }: unknown) => (
    <div data-testid="shipment-table">
      <button onClick={() => actions.onDelete("s1")}>Delete s1</button>
    </div>
  ),
});
mock.module("@/app/components/dashboard/shipments/ShipmentAnalytics", {
  defaultExport: () => <div data-testid="shipment-analytics">Analytics</div>,
});
mock.module("@/app/components/dialogs/shipment/shipmentDetailDialog", {
  defaultExport: () => <div data-testid="detail-dialog">Details Dialog</div>,
});
mock.module("@/app/components/dialogs/shipment/edit-shipment-dialog", {
  defaultExport: () => <div data-testid="edit-dialog">Edit Dialog</div>,
});
mock.module("@/app/components/dialogs/shipment/addShipmentDialog", {
  defaultExport: () => <div data-testid="add-dialog">Add Dialog</div>,
});
mock.module("@/app/components/dialogs/deleteConfirmationDialog", {
  defaultExport: ({ open, onConfirm }: unknown) => open ? (
    <div data-testid="delete-dialog">
      <button onClick={onConfirm}>Confirm Delete</button>
    </div>
  ) : null,
});

// 2. Mock Theme
const customTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" } as unknown,
    info: { main: "#0288d1" } as unknown,
    success: { main: "#2e7d32" } as unknown,
    error: { main: "#d32f2f" } as unknown,
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

describe("ShipmentContent Component", () => {
  let ShipmentContent: React.ElementType;

  before(async () => {
    const mod = await import("./shipmentsContent");
    ShipmentContent = mod.default;
  });

  afterEach(() => {
    cleanup();
    mockRefetch.mock.resetCalls();
    mockDeleteMutateAsync.mock.resetCalls();
  });

  describe("ShipmentContent() Render Testleri", () => {
    it("should_RenderDashboardElements_Correctly", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <ShipmentContent />
        </ThemeProvider>
      );

      // Assert basic renders
      expect(screen.getByTestId("kpi-cards")).toBeTruthy();
      expect(screen.getByTestId("shipment-table")).toBeTruthy();
      expect(screen.getByTestId("shipment-analytics")).toBeTruthy();
    });

    it("should_OpenDeleteDialog_WhenDeleteClicked", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <ShipmentContent />
        </ThemeProvider>
      );

      const deleteBtn = screen.getByText("Delete s1");
      fireEvent.click(deleteBtn);

      await waitFor(() => {
        expect(screen.getByTestId("delete-dialog")).toBeTruthy();
      });

      const confirmBtn = screen.getByText("Confirm Delete");
      fireEvent.click(confirmBtn);

      await waitFor(() => {
        expect(mockDeleteMutateAsync.mock.calls.length).toBe(1);
      });
    });
  });
});
