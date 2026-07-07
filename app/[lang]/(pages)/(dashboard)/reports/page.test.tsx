 
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// 1. Mock Server-Side Data Fetching
const mockGetReportsDataAction = mock.fn(async () => ({}));

mock.module("../../../../lib/controllers/reports.ts", {
  namedExports: { getReportsDataAction: mockGetReportsDataAction },
});

// 2. Mock Components
mock.module("./components/ReportsContent.tsx", {
  defaultExport: () => <div data-testid="reports-content">Reports Content</div>,
});

describe("ReportsPage Component", () => {
  let ReportsPage: any;

  before(async () => {
    const mod = await import("./page");
    ReportsPage = mod.default;
  });

  afterEach(() => {
    cleanup();
    mockGetReportsDataAction.mock.resetCalls();
  });

  describe("ReportsPage() Render Testleri", () => {
    it("should_RenderReportsContent_WithHydratedState", async () => {
      // Act
      const PageComponent = await ReportsPage();
      render(
        <QueryClientProvider client={new QueryClient()}>
          {PageComponent}
        </QueryClientProvider>
      );

      // Assert basic renders
      await waitFor(() => {
        expect(screen.getByTestId("reports-content")).toBeTruthy();
      });

      // Verify server side prefetching was called
      expect(mockGetReportsDataAction.mock.calls.length).toBe(1);
    });
  });
});
