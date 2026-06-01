/* eslint-disable @typescript-eslint/no-explicit-any */
import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import React from "react";

// 1. Mock Server-Side Data Fetching
const mockGetOverviewDashboardData = mock.fn(async () => ({
  stats: { activeShipments: 10 },
}));

mock.module("../../../../lib/controllers/overview.ts", {
  namedExports: { getOverviewDashboardData: mockGetOverviewDashboardData },
});

// 2. Mock Components
mock.module("./components/OverviewContent.tsx", {
  defaultExport: () => <div data-testid="overview-content">Overview Content</div>,
});

describe("OverviewPage Component", () => {
  let OverviewPage: any;

  before(async () => {
    const mod = await import("./page");
    OverviewPage = mod.default;
  });

  afterEach(() => {
    cleanup();
    mockGetOverviewDashboardData.mock.resetCalls();
  });

  describe("OverviewPage() Render Testleri", () => {
    it("should_RenderOverviewContent_WithHydratedState", async () => {
      // Act
      const PageComponent = await OverviewPage();
      render(PageComponent);

      // Assert basic renders
      await waitFor(() => {
        expect(screen.getByTestId("overview-content")).toBeTruthy();
      });

      // Verify server side prefetching was called
      expect(mockGetOverviewDashboardData.mock.calls.length).toBe(1);
    });
  });
});
