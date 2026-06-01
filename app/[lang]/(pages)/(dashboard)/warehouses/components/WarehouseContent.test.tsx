/* eslint-disable @typescript-eslint/no-explicit-any */
import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// 1. Mock Contexts & Utils
const useDictionaryMock = mock.fn(() => ({
  warehouses: {
    title: "Warehouses",
    subtitle: "Manage warehouses",
    addWarehouse: "Add Warehouse",
    deleteTitle: "Delete",
    deleteDesc: "Delete {name}?",
    kpi: {
      totalWarehouses: "Total Warehouses",
      inventorySkus: "SKUs",
      totalItems: "Total Items",
      palletCapacity: "Pallets",
      stockedVolume: "Volume",
    }
  },
  toasts: {
    successDelete: "Deleted",
    errorGeneric: "Error",
  }
}));

mock.module("@/app/lib/language/DictionaryContext", {
  namedExports: { useDictionary: useDictionaryMock },
});

const mockMutateAsync = mock.fn(async () => {});
mock.module("@/app/hooks/useWarehouses", {
  namedExports: { 
    useWarehousesWithDashboard: mock.fn(() => ({
      data: {
        warehouses: [{ id: "wh-1", name: "Main HQ" }],
        stats: { totalWarehouses: 1 },
        totalCount: 1,
      },
      isLoading: false,
      refetch: mock.fn(),
    })),
    useWarehouseMutations: mock.fn(() => ({
      deleteWarehouse: { mutateAsync: mockMutateAsync, isPending: false }
    }))
  },
});

mock.module("sonner", {
  namedExports: { toast: { success: mock.fn(), error: mock.fn() } },
});

// Mock child components
mock.module("@/app/components/cards/KpiCards", {
  defaultExport: ({ kpis }: any) => <div data-testid="kpi-cards">KPI Cards {kpis.length}</div>,
});
mock.module("@/app/components/dashboard/warehouse/warehouseList", {
  defaultExport: ({ onDelete }: any) => (
    <div data-testid="warehouse-list">
      <button onClick={() => onDelete("wh-1")}>Delete WH-1</button>
    </div>
  ),
});
mock.module("@/app/components/dashboard/warehouse/capacityUtilization", {
  defaultExport: () => <div data-testid="capacity-chart">Capacity Chart</div>,
});
mock.module("@/app/components/dashboard/warehouse/recentStockMovements", {
  defaultExport: () => <div data-testid="movements-table">Movements Table</div>,
});

mock.module("@/app/components/googleMaps/GoogleMapsProvider", {
  namedExports: { GoogleMapsProvider: ({ children }: any) => <div data-testid="gmaps-provider">{children}</div> },
});
mock.module("@/app/components/dialogs/warehouse/addWarehouseDialog", {
  defaultExport: () => <div data-testid="add-dialog">Add Dialog</div>,
});
mock.module("@/app/components/dialogs/warehouse/warehouseDetailsDialog", {
  defaultExport: () => <div data-testid="details-dialog">Details Dialog</div>,
});
mock.module("@/app/components/dialogs/warehouse/editWarehouseDialog", {
  defaultExport: () => <div data-testid="edit-dialog">Edit Dialog</div>,
});
mock.module("@/app/components/dialogs/deleteConfirmationDialog", {
  defaultExport: ({ open, onConfirm }: any) => open ? (
    <div data-testid="delete-dialog">
      <button onClick={onConfirm}>Confirm Delete</button>
    </div>
  ) : null,
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

describe("WarehouseContent RTL Component", () => {
  let WarehouseContent: any;

  before(async () => {
    const mod = await import("./WarehouseContent");
    WarehouseContent = mod.default;
  });

  afterEach(() => {
    cleanup();
    mockMutateAsync.mock.resetCalls();
  });

  describe("WarehouseContent() bileşeni", () => {
    it("should_RenderDashboardElements_Correctly", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <WarehouseContent />
        </ThemeProvider>
      );

      // Assert basic renders
      expect(screen.getByText("Warehouses")).toBeTruthy();
      expect(screen.getByTestId("kpi-cards")).toBeTruthy();
      expect(screen.getByTestId("warehouse-list")).toBeTruthy();
      expect(screen.getByTestId("capacity-chart")).toBeTruthy();
      expect(screen.getByTestId("movements-table")).toBeTruthy();
    });

    it("should_TriggerDeleteMutation_WhenDeleteConfirmed", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <WarehouseContent />
        </ThemeProvider>
      );

      // Simulate clicking delete on the table row
      const deleteBtn = screen.getByText("Delete WH-1");
      fireEvent.click(deleteBtn);

      // Dialog opens
      await waitFor(() => {
        expect(screen.getByTestId("delete-dialog")).toBeTruthy();
      });

      // Click confirm
      const confirmBtn = screen.getByText("Confirm Delete");
      fireEvent.click(confirmBtn);

      await waitFor(() => {
        expect(mockMutateAsync.mock.calls.length).toBe(1);
        expect(mockMutateAsync.mock.calls[0].arguments[0]).toBe("wh-1");
      });
    });
  });
});
