/* eslint-disable @typescript-eslint/no-explicit-any */
import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import React from "react";

// 1. Mock Server-Side Data Fetching
const mockGetInventoryWithDashboardData = mock.fn(async () => ({
  items: [],
}));

mock.module("@/app/lib/controllers/inventory", {
  namedExports: { getInventoryWithDashboardData: mockGetInventoryWithDashboardData },
});

// 2. Mock Components
mock.module("./components/InventoryContent", {
  defaultExport: () => <div data-testid="inventory-content">Inventory Content</div>,
});

describe("InventoryPage Component", () => {
  let InventoryPage: any;

  before(async () => {
    const mod = await import("./page");
    InventoryPage = mod.default;
  });

  afterEach(() => {
    cleanup();
    mockGetInventoryWithDashboardData.mock.resetCalls();
  });

  describe("InventoryPage() Render Testleri", () => {
    it("should_RenderInventoryContent_WithHydratedState", async () => {
      // Act
      const PageComponent = await InventoryPage();
      render(PageComponent);

      // Assert basic renders
      await waitFor(() => {
        expect(screen.getByTestId("inventory-content")).toBeTruthy();
      });

      // Verify server side prefetching was called
      expect(mockGetInventoryWithDashboardData.mock.calls.length).toBe(1);
    });
  });
});
