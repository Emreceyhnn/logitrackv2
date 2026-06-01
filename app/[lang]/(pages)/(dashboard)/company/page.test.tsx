/* eslint-disable @typescript-eslint/no-explicit-any */
import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import React from "react";

// 1. Mock Server-Side Data Fetching
const mockGetCompanyWithDashboardData = mock.fn(async () => ({
  stats: { users: 5 },
}));

mock.module("../../../../lib/controllers/company.ts", {
  namedExports: { getCompanyWithDashboardData: mockGetCompanyWithDashboardData },
});

// 2. Mock Components
mock.module("./components/CompanyContent.tsx", {
  defaultExport: () => <div data-testid="company-content">Company Content</div>,
});

describe("CompanyPage Component", () => {
  let CompanyPage: any;

  before(async () => {
    const mod = await import("./page");
    CompanyPage = mod.default;
  });

  afterEach(() => {
    cleanup();
    mockGetCompanyWithDashboardData.mock.resetCalls();
  });

  describe("CompanyPage() Render Testleri", () => {
    it("should_RenderCompanyContent_WithHydratedState", async () => {
      // Act
      const PageComponent = await CompanyPage();
      render(PageComponent);

      // Assert basic renders
      await waitFor(() => {
        expect(screen.getByTestId("company-content")).toBeTruthy();
      });

      // Verify server side prefetching was called
      expect(mockGetCompanyWithDashboardData.mock.calls.length).toBe(1);
    });
  });
});
