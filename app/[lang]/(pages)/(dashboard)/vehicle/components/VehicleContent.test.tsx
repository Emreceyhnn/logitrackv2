/* eslint-disable @typescript-eslint/no-explicit-any */
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
  vehicles: {
    title: "Vehicles",
    subtitle: "Manage vehicles",
    addVehicle: "Add Vehicle",
    tabs: { vehicles: "Vehicles", trailers: "Trailers" },
    kpis: {
      totalVehicles: "Total",
      available: "Available",
      inService: "In Service",
      onTrip: "On Trip",
      openIssues: "Issues",
      docsExpiring: "Docs"
    }
  },
  trailers: {
    title: "Trailers",
    subtitle: "Manage trailers",
    addTrailer: "Add Trailer"
  },
  common: {
    confirmDelete: "Delete",
    deleteDocumentDesc: "Delete item?"
  }
}));

mock.module("@/app/lib/language/DictionaryContext", {
  namedExports: { useDictionary: useDictionaryMock },
});

const mockRefetch = mock.fn(async () => {});
const mockDeleteMutateAsync = mock.fn(async () => {});
const mockDeleteTrailerMut = mock.fn(async () => {});
const mockDetachTrailerMut = mock.fn(async () => {});

mock.module("@/app/hooks/useVehicles", {
  namedExports: { 
    useVehicleWithDashboard: mock.fn(() => ({
      data: {
        vehicles: [{ id: "v1", plate: "123-ABC" }],
        vehiclesKpis: { totalVehicles: 10 },
        kpiTrends: {},
        expiringDocs: [],
        plannedServices: [],
        vehiclesCapacity: []
      },
      isLoading: false,
      isFetching: false,
      refetch: mockRefetch,
    })),
    useVehicleMutations: mock.fn(() => ({
      deleteVehicle: { mutateAsync: mockDeleteMutateAsync, isPending: false }
    }))
  },
});

mock.module("@/app/hooks/useTrailers", {
  namedExports: { 
    useTrailers: mock.fn(() => ({
      data: {
        trailers: [],
        meta: {}
      },
      isLoading: false,
      isFetching: false,
    })),
    useTrailerMutations: mock.fn(() => ({
      deleteTrailer: { mutateAsync: mockDeleteTrailerMut, isPending: false },
      assignTrailer: { mutateAsync: mockDetachTrailerMut, isPending: false }
    }))
  },
});

// Mock child components
mock.module("@/app/components/cards/KpiCards", {
  defaultExport: () => <div data-testid="kpi-cards">KPI Cards</div>,
});
mock.module("@/app/components/dashboard/vehicle/vehicleTable", {
  defaultExport: ({ actions }: any) => (
    <div data-testid="vehicle-table">
      <button onClick={() => actions.onDelete("v1")}>Delete v1</button>
    </div>
  ),
});
mock.module("@/app/components/dashboard/vehicle/trailerTable", {
  defaultExport: () => <div data-testid="trailer-table">Trailer Table</div>,
});
mock.module("@/app/components/dashboard/vehicle/documentCalenderCard", {
  defaultExport: () => <div data-testid="doc-card">Doc Card</div>,
});
mock.module("@/app/components/dashboard/vehicle/maxLoad", {
  defaultExport: () => <div data-testid="max-load">Max Load</div>,
});
mock.module("@/app/components/dialogs/vehicle/addVehicleDialog", {
  defaultExport: () => <div data-testid="add-vehicle-dialog">Add Dialog</div>,
});
mock.module("@/app/components/dialogs/vehicle/editVehicleDialog", {
  defaultExport: () => <div data-testid="edit-vehicle-dialog">Edit Dialog</div>,
});
mock.module("@/app/components/dialogs/vehicle/vehicleDetailsDialog", {
  defaultExport: () => <div data-testid="vehicle-dialog">Details Dialog</div>,
});
mock.module("@/app/components/dialogs/vehicle/addTrailerDialog", {
  defaultExport: () => <div data-testid="add-trailer-dialog">Add Trailer</div>,
});
mock.module("@/app/components/dialogs/vehicle/editTrailerDialog", {
  defaultExport: () => <div data-testid="edit-trailer-dialog">Edit Trailer</div>,
});
mock.module("@/app/components/dialogs/vehicle/trailerAssignmentDialog", {
  defaultExport: () => <div data-testid="trailer-assignment">Trailer Assignment</div>,
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
    primary: { main: "#1976d2", _alpha: { main_15: "#ccc", main_20: "#ccc" } } as any,
    success: { main: "#2e7d32" } as any,
    warning: { main: "#ed6c02" } as any,
    error: { main: "#d32f2f" } as any,
    info: { main: "#0288d1" } as any,
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

describe("VehicleContent Component", () => {
  let VehicleContent: any;

  before(async () => {
    const mod = await import("./VehicleContent");
    VehicleContent = mod.default;
  });

  afterEach(() => {
    cleanup();
    mockRefetch.mock.resetCalls();
    mockDeleteMutateAsync.mock.resetCalls();
  });

  describe("VehicleContent() Render Testleri", () => {
    it("should_RenderDashboardElements_Correctly", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <VehicleContent />
        </ThemeProvider>
      );

      // Assert basic renders
      expect(screen.getByTestId("kpi-cards")).toBeTruthy();
      expect(screen.getByTestId("vehicle-table")).toBeTruthy();
      expect(screen.getByTestId("doc-card")).toBeTruthy();
      expect(screen.getByTestId("max-load")).toBeTruthy();
    });

    it("should_OpenDeleteDialog_WhenDeleteClicked", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <VehicleContent />
        </ThemeProvider>
      );

      const deleteBtn = screen.getByText("Delete v1");
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
