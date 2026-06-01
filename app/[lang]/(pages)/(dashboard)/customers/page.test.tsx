import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import React from "react";

// 1. Mock Server-Side Data Fetching
const mockGetCustomersWithDashboardData = mock.fn(async () => ({
  customers: [],
}));

mock.module("@/app/lib/controllers/customer", {
  namedExports: { getCustomersWithDashboardData: mockGetCustomersWithDashboardData },
});

// 2. Mock Components
mock.module("./components/CustomerContent", {
  defaultExport: () => <div data-testid="customer-content">Customer Content</div>,
});

describe("CustomersPage Component", () => {
  let CustomersPage: any;

  before(async () => {
    const mod = await import("./page");
    CustomersPage = mod.default;
  });

  afterEach(() => {
    cleanup();
    mockGetCustomersWithDashboardData.mock.resetCalls();
  });

  describe("CustomersPage() Render Testleri", () => {
    it("should_RenderCustomerContent_WithHydratedState", async () => {
      // Act
      const PageComponent = await CustomersPage();
      render(PageComponent);

      // Assert basic renders
      await waitFor(() => {
        expect(screen.getByTestId("customer-content")).toBeTruthy();
      });

      // Verify server side prefetching was called
      expect(mockGetCustomersWithDashboardData.mock.calls.length).toBe(1);
    });
  });
});
