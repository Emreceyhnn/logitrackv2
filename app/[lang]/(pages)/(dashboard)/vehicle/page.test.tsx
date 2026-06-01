/* eslint-disable @typescript-eslint/no-explicit-any */
import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import React from "react";

// 1. Mock Server-Side Data Fetching
const mockGetVehiclesWithDashboard = mock.fn(async () => ({
  vehicles: [],
}));

mock.module("../../../../lib/controllers/vehicle", {
  namedExports: { getVehiclesWithDashboard: mockGetVehiclesWithDashboard },
});

// 2. Mock Components
mock.module("./components/VehicleContent", {
  defaultExport: () => <div data-testid="vehicle-content">Vehicle Content</div>,
});

describe("VehiclePage Component", () => {
  let VehiclePage: any;

  before(async () => {
    const mod = await import("./page");
    VehiclePage = mod.default;
  });

  afterEach(() => {
    cleanup();
    mockGetVehiclesWithDashboard.mock.resetCalls();
  });

  describe("VehiclePage() Render Testleri", () => {
    it("should_RenderVehicleContent_WithHydratedState", async () => {
      // Act
      const PageComponent = await VehiclePage();
      render(PageComponent);

      // Assert basic renders
      await waitFor(() => {
        expect(screen.getByTestId("vehicle-content")).toBeTruthy();
      });

      // Verify server side prefetching was called
      expect(mockGetVehiclesWithDashboard.mock.calls.length).toBe(1);
    });
  });
});
