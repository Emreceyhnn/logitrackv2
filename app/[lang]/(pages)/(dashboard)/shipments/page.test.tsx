/* eslint-disable @typescript-eslint/no-explicit-any */
import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import React from "react";

// 1. Mock Server-Side Data Fetching
const mockGetShipmentsWithDashboardData = mock.fn(async () => ({
  shipments: [],
}));

mock.module("@/app/lib/controllers/shipments", {
  namedExports: { getShipmentsWithDashboardData: mockGetShipmentsWithDashboardData },
});

// 2. Mock Components
mock.module("./components/shipmentsContent", {
  defaultExport: () => <div data-testid="shipments-content">Shipments Content</div>,
});

describe("ShipmentsPage Component", () => {
  let ShipmentsPage: any;

  before(async () => {
    const mod = await import("./page");
    ShipmentsPage = mod.default;
  });

  afterEach(() => {
    cleanup();
    mockGetShipmentsWithDashboardData.mock.resetCalls();
  });

  describe("ShipmentsPage() Render Testleri", () => {
    it("should_RenderShipmentsContent_WithHydratedState", async () => {
      // Act
      const PageComponent = await ShipmentsPage();
      render(PageComponent);

      // Assert basic renders
      await waitFor(() => {
        expect(screen.getByTestId("shipments-content")).toBeTruthy();
      });

      // Verify server side prefetching was called
      expect(mockGetShipmentsWithDashboardData.mock.calls.length).toBe(1);
    });
  });
});
