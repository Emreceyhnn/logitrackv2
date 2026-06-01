import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// 1. Mock Contexts & Utils
const useDictionaryMock = mock.fn(() => ({
  routes: {
    title: "Routes",
    subtitle: "Manage routes",
    addRoute: "Add Route",
    active: "Active",
    inProgress: "In Progress",
    completedToday: "Completed",
    delayed: "Delayed",
    deleteDesc: "Delete route?",
  },
  common: {
    delete: "Delete"
  }
}));

mock.module("@/app/lib/language/DictionaryContext", {
  namedExports: { useDictionary: useDictionaryMock },
});

const useUserMock = mock.fn(() => ({ user: { id: "u1" } }));
mock.module("@/app/hooks/useUser", {
  namedExports: { useUser: useUserMock },
});

const mockRefetch = mock.fn(async () => {});
const mockDeleteMutateAsync = mock.fn(async () => {});

mock.module("@/app/hooks/useRoutes", {
  namedExports: { 
    useRoutesWithDashboard: mock.fn(() => ({
      data: {
        routes: [{ id: "r1", name: "Route 1" }],
        stats: { active: 1, inProgress: 1, completedToday: 0, delayed: 0 },
        statsTrends: {},
        efficiency: {},
        mapData: [],
        totalCount: 1
      },
      isLoading: false,
      refetch: mockRefetch,
    })),
    useRouteMutations: mock.fn(() => ({
      deleteRoute: { mutateAsync: mockDeleteMutateAsync, isPending: false }
    }))
  },
});

// Mock child components
mock.module("@/app/components/cards/KpiCards", {
  defaultExport: () => <div data-testid="kpi-cards">KPI Cards</div>,
});
mock.module("@/app/components/dashboard/routes/routesMainMap", {
  defaultExport: () => <div data-testid="main-map">Map</div>,
});
mock.module("@/app/components/dashboard/routes/routeEfficiency", {
  defaultExport: () => <div data-testid="route-efficiency">Efficiency</div>,
});
mock.module("@/app/components/dashboard/routes/routeTable", {
  defaultExport: ({ onDelete }: any) => (
    <div data-testid="route-table">
      <button onClick={() => onDelete("r1")}>Delete r1</button>
    </div>
  ),
});

mock.module("@/app/components/dialogs/routes/edit-route-dialog", {
  defaultExport: () => <div data-testid="edit-dialog">Edit Dialog</div>,
});
mock.module("@/app/components/dialogs/deleteConfirmationDialog", {
  defaultExport: ({ open, onConfirm }: any) => open ? (
    <div data-testid="delete-dialog">
      <button onClick={onConfirm}>Confirm Delete</button>
    </div>
  ) : null,
});
mock.module("@/app/components/dialogs/routes/addRouteDialog", {
  defaultExport: () => <div data-testid="add-dialog">Add Dialog</div>,
});

// 2. Mock Theme
const customTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" } as any,
    info: { main: "#0288d1" } as any,
    success: { main: "#2e7d32" } as any,
    error: { main: "#d32f2f" } as any,
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

describe("RoutesContent Component", () => {
  let RoutesContent: any;

  before(async () => {
    const mod = await import("./routesContent");
    RoutesContent = mod.default;
  });

  afterEach(() => {
    cleanup();
    mockRefetch.mock.resetCalls();
    mockDeleteMutateAsync.mock.resetCalls();
  });

  describe("RoutesContent() Render Testleri", () => {
    it("should_RenderDashboardElements_Correctly", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <RoutesContent />
        </ThemeProvider>
      );

      // Assert basic renders
      expect(screen.getByTestId("kpi-cards")).toBeTruthy();
      expect(screen.getByTestId("main-map")).toBeTruthy();
      expect(screen.getByTestId("route-efficiency")).toBeTruthy();
      expect(screen.getByTestId("route-table")).toBeTruthy();
    });

    it("should_OpenDeleteDialog_WhenDeleteClicked", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <RoutesContent />
        </ThemeProvider>
      );

      const deleteBtn = screen.getByText("Delete r1");
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
