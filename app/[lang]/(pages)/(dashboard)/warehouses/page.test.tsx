import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import React from "react";

// 1. Mock Server-Side Data Fetching
const mockGetWarehousesWithDashboardData = mock.fn(async () => ({
  warehouses: [],
}));

mock.module("@/app/lib/controllers/warehouse", {
  namedExports: { getWarehousesWithDashboardData: mockGetWarehousesWithDashboardData },
});

// 2. Mock Components
mock.module("./components/WarehouseContent", {
  defaultExport: () => <div data-testid="warehouse-content">Warehouse Content</div>,
});

describe("WarehousePage Component", () => {
  let WarehousePage: any;

  before(async () => {
    const mod = await import("./page");
    WarehousePage = mod.default;
  });

  afterEach(() => {
    cleanup();
    mockGetWarehousesWithDashboardData.mock.resetCalls();
  });

  describe("WarehousePage() Render Testleri", () => {
    it("should_RenderWarehouseContent_WithHydratedState", async () => {
      // Act
      const PageComponent = await WarehousePage();
      render(PageComponent);

      // Assert basic renders
      await waitFor(() => {
        expect(screen.getByTestId("warehouse-content")).toBeTruthy();
      });

      // Verify server side prefetching was called
      expect(mockGetWarehousesWithDashboardData.mock.calls.length).toBe(1);
    });
  });
});
