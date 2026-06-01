/* eslint-disable @typescript-eslint/no-explicit-any */
import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// 1. Mock Contexts & Utils
const useDictionaryMock = mock.fn(() => ({
  company: {
    title: "Company",
    subtitle: "Manage company details",
    addMember: "Add Member",
    kpi: {
      totalUsers: "Users",
      vehicles: "Vehicles",
      drivers: "Drivers",
      warehouses: "Warehouses",
      customers: "Customers",
      shipments: "Shipments"
    }
  }
}));

mock.module("@/app/lib/language/DictionaryContext", {
  namedExports: { useDictionary: useDictionaryMock },
});

const mockRefetch = mock.fn(async () => {});
const mockDeleteMutateAsync = mock.fn(async () => {});

mock.module("@/app/hooks/useCompany", {
  namedExports: { 
    useCompanyWithDashboard: mock.fn(() => ({
      data: {
        profile: {},
        stats: { users: 5 },
        statsTrends: {},
        members: [],
        totalCount: 0,
        meta: {}
      },
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    })),
    useCompanyMutations: mock.fn(() => ({
      deleteMember: { mutateAsync: mockDeleteMutateAsync }
    }))
  },
});

// Mock child components
mock.module("@/app/components/cards/KpiCards", {
  defaultExport: ({ kpis }: any) => <div data-testid="kpi-cards">KPI Cards</div>,
});
mock.module("@/app/components/dashboard/company/companyInfoCard", {
  defaultExport: () => <div data-testid="company-info-card">Company Info</div>,
});
mock.module("@/app/components/dashboard/company/companyMembersTable", {
  defaultExport: () => <div data-testid="company-members-table">Members Table</div>,
});
mock.module("@/app/components/dialogs/company/AddCompanyMemberDialog", {
  defaultExport: ({ open, onClose }: any) => open ? (
    <div data-testid="add-member-dialog">
      <button onClick={onClose}>Close</button>
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
    error: { main: "#d32f2f" } as any,
    kpi: { pink: "#ccc", violet: "#ccc" } as any,
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

describe("CompanyContent Component", () => {
  let CompanyContent: any;

  before(async () => {
    const mod = await import("./CompanyContent");
    CompanyContent = mod.default;
  });

  afterEach(() => {
    cleanup();
    mockRefetch.mock.resetCalls();
    mockDeleteMutateAsync.mock.resetCalls();
  });

  describe("CompanyContent() Render Testleri", () => {
    it("should_RenderDashboardElements_Correctly", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <CompanyContent />
        </ThemeProvider>
      );

      // Assert basic renders
      expect(screen.getByText("Company")).toBeTruthy();
      expect(screen.getByTestId("kpi-cards")).toBeTruthy();
      expect(screen.getByTestId("company-info-card")).toBeTruthy();
      expect(screen.getByTestId("company-members-table")).toBeTruthy();
    });

    it("should_OpenAddMemberDialog_WhenAddButtonClicked", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <CompanyContent />
        </ThemeProvider>
      );

      const addBtn = screen.getByRole("button", { name: "Add Member" });
      fireEvent.click(addBtn);

      await waitFor(() => {
        expect(screen.getByTestId("add-member-dialog")).toBeTruthy();
      });
    });
  });
});
