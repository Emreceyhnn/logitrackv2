/* eslint-disable @typescript-eslint/no-explicit-any */
import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import React from "react";

// Mock child component
mock.module("../../../components/dashboard/DashboardLayoutClient.tsx", {
  defaultExport: ({ children }: any) => <div data-testid="dashboard-layout-client">{children}</div>,
});
mock.module("../../../lib/actions/theme.ts", {
  namedExports: { getUserTheme: mock.fn(async () => "dark") }
});
mock.module("../../../lib/auth-middleware.ts", {
  namedExports: { getAuthenticatedUser: mock.fn(async () => null) }
});
mock.module("../../../lib/theme/themeProviders.tsx", {
  defaultExport: ({ children }: any) => <div data-testid="theme-provider">{children}</div>,
});
mock.module("../../../lib/context/UserContext.tsx", {
  namedExports: { UserProvider: ({ children }: any) => <div data-testid="user-provider">{children}</div>, }
});

describe("DashboardLayout Component", () => {
  let DashboardLayout: any;

  before(async () => {
    const mod = await import("./layout");
    DashboardLayout = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  describe("DashboardLayout() Render Testleri", () => {
    it("should_RenderDashboardLayoutClient_WithChildren", async () => {
      // Act
      const LayoutComponent = await DashboardLayout({ children: <div data-testid="child-content">Test Child</div> });
      render(LayoutComponent);

      // Assert basic renders
      await waitFor(() => {
        expect(screen.getByTestId("dashboard-layout-client")).toBeTruthy();
        expect(screen.getByTestId("child-content")).toBeTruthy();
      });
    });
  });
});
