 
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// 1. Mock Server-Side Data Fetching
const mockGetAnalyticsDashboardData = mock.fn(async () => ({
  performance: {},
}));

mock.module("../../../../lib/controllers/analytics.ts", {
  namedExports: { getAnalyticsDashboardData: mockGetAnalyticsDashboardData },
});

// 2. Mock Components
mock.module("./components/AnalyticsContent.tsx", {
  defaultExport: () => <div data-testid="analytics-content">Analytics Content</div>,
});

describe("AnalyticsPage Component", () => {
  let AnalyticsPage: unknown;

  before(async () => {
    const mod = await import("./page");
    AnalyticsPage = mod.default;
  });

  afterEach(() => {
    cleanup();
    mockGetAnalyticsDashboardData.mock.resetCalls();
  });

  describe("AnalyticsPage() Render Testleri", () => {
    it("should_RenderAnalyticsContent_WithHydratedState", async () => {
      // Act
      const PageComponent = await AnalyticsPage();
      render(
        <QueryClientProvider client={queryClient}>
          {PageComponent}
        </QueryClientProvider>
      );

      // Assert basic renders
      await waitFor(() => {
        expect(screen.getByTestId("analytics-content")).toBeTruthy();
      });

      // Verify server side prefetching was called
      expect(mockGetAnalyticsDashboardData.mock.calls.length).toBe(1);
    });
  });
});
