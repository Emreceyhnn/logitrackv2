import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import React from "react";

// 1. Mock Server-Side Data Fetching
const mockGetRoutesWithDashboardData = mock.fn(async () => ({
  routes: [],
}));

mock.module("@/app/lib/controllers/routes", {
  namedExports: { getRoutesWithDashboardData: mockGetRoutesWithDashboardData },
});

// 2. Mock Components
mock.module("./components/routesContent", {
  defaultExport: () => <div data-testid="routes-content">Routes Content</div>,
});

describe("RoutesPage Component", () => {
  let RoutesPage: React.ElementType;

  before(async () => {
    const mod = await import("./page");
    RoutesPage = mod.default;
  });

  afterEach(() => {
    cleanup();
    mockGetRoutesWithDashboardData.mock.resetCalls();
  });

  describe("RoutesPage() Render Testleri", () => {
    it("should_RenderRoutesContent_WithHydratedState", async () => {
      // Act
      const PageComponent = await RoutesPage();
      render(PageComponent);

      // Assert basic renders
      await waitFor(() => {
        expect(screen.getByTestId("routes-content")).toBeTruthy();
      });

      // Verify server side prefetching was called
      expect(mockGetRoutesWithDashboardData.mock.calls.length).toBe(1);
    });
  });
});
