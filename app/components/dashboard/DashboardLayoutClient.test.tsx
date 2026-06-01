/* eslint-disable @typescript-eslint/no-explicit-any */
import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// 1. Mock Contexts & Utils
const MOCK_USER = {
  id: "user-1",
  email: "test@example.com",
  name: "Test User",
  role: "ADMIN"
};

mock.module("../../lib/context/UserContext", {
  namedExports: { 
    useUserContext: mock.fn(() => ({ user: MOCK_USER }))
  },
});

// Mock child components
mock.module("../sidebar", {
  defaultExport: () => <div data-testid="sidebar">Sidebar</div>,
});
mock.module("./DashboardHeader", {
  defaultExport: ({ user }: any) => <div data-testid="header">Header for {user?.name}</div>,
});

// 2. Mock Theme
const customTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2", dark: "#115293" } as any,
  }
});

(customTheme.palette.background as any).dashboardBg = "#f5f5f5";

import * as originalMui from "@mui/material";
const useThemeMock = mock.fn(() => customTheme);
mock.module("@mui/material", {
  namedExports: {
    ...originalMui,
    useTheme: useThemeMock,
  },
});

describe("DashboardLayoutClient RTL Component", () => {
  let DashboardLayoutClient: any;

  before(async () => {
    const mod = await import("./DashboardLayoutClient");
    DashboardLayoutClient = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  describe("DashboardLayoutClient() bileşeni", () => {
    it("should_RenderLayoutWithSidebarAndHeader_WhenMounted", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <DashboardLayoutClient>
            <div data-testid="page-content">Page Content</div>
          </DashboardLayoutClient>
        </ThemeProvider>
      );

      // Assert basic renders
      expect(screen.getByTestId("sidebar")).toBeTruthy();
      expect(screen.getByTestId("header")).toBeTruthy();
      expect(screen.getByText("Header for Test User")).toBeTruthy();
      expect(screen.getByTestId("page-content")).toBeTruthy();
    });
  });
});
