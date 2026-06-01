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
  drivers: {
    title: "Drivers",
    subtitle: "Manage drivers",
    addDriver: "Add Driver",
    totalDrivers: "Total",
    onDuty: "On Duty",
    offDuty: "Off Duty",
    complianceIssues: "Issues",
    safetyRating: "Safety",
    efficiencyRating: "Efficiency",
    deleteTitle: "Delete",
    deleteDesc: "Delete driver?",
  },
  common: { loading: "Loading" }
}));

mock.module("@/app/lib/language/DictionaryContext", {
  namedExports: { useDictionary: useDictionaryMock },
});

const mockRefetch = mock.fn(async () => {});
const mockDeleteMutateAsync = mock.fn(async () => {});

mock.module("@/app/hooks/useDrivers", {
  namedExports: { 
    useDriverWithDashboard: mock.fn(() => ({
      data: {
        drivers: [{ id: "d1", name: "Driver 1" }],
        meta: { total: 1 },
        driversKpis: {},
        kpiTrends: {},
        performanceCharts: {}
      },
      isLoading: false,
      refetch: mockRefetch,
    })),
    useDriverMutations: mock.fn(() => ({
      deleteDriver: { mutateAsync: mockDeleteMutateAsync, isPending: false }
    }))
  },
});

// Mock child components
mock.module("@/app/components/cards/KpiCards", {
  defaultExport: () => <div data-testid="kpi-cards">KPI Cards</div>,
});
mock.module("@/app/components/dashboard/driver/driverTable", {
  defaultExport: ({ onDelete }: unknown) => (
    <div data-testid="driver-table">
      <button onClick={() => onDelete("d1")}>Delete D1</button>
    </div>
  ),
});
mock.module("@/app/components/dashboard/driver/driverPerformanceCharts", {
  defaultExport: () => <div data-testid="performance-charts">Charts</div>,
});

mock.module("@/app/components/dialogs/driver/addDriverDialog", {
  defaultExport: () => <div data-testid="add-dialog">Add Dialog</div>,
});
mock.module("@/app/components/dialogs/driver/editDriverDialog", {
  defaultExport: () => <div data-testid="edit-dialog">Edit Dialog</div>,
});
mock.module("@/app/components/dialogs/driver", {
  defaultExport: () => <div data-testid="driver-dialog">Details Dialog</div>,
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
    success: { main: "#2e7d32" } as unknown,
    warning: { main: "#ed6c02" } as unknown,
    error: { main: "#d32f2f" } as unknown,
    info: { main: "#0288d1" } as unknown,
    kpi: { violet: "#ccc" } as unknown,
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

describe("DriverContent Component", () => {
  let DriverContent: React.ElementType;

  before(async () => {
    const mod = await import("./DriverContent");
    DriverContent = mod.default;
  });

  afterEach(() => {
    cleanup();
    mockRefetch.mock.resetCalls();
    mockDeleteMutateAsync.mock.resetCalls();
  });

  describe("DriverContent() Render Testleri", () => {
    it("should_RenderDashboardElements_Correctly", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <DriverContent />
        </ThemeProvider>
      );

      // Assert basic renders
      expect(screen.getByTestId("kpi-cards")).toBeTruthy();
      expect(screen.getByTestId("driver-table")).toBeTruthy();
      expect(screen.getByTestId("performance-charts")).toBeTruthy();
    });

    it("should_OpenDeleteDialog_WhenDeleteClicked", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <DriverContent />
        </ThemeProvider>
      );

      const deleteBtn = screen.getByText("Delete D1");
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
