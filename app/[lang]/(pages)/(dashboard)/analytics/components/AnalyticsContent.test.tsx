/* eslint-disable @typescript-eslint/no-explicit-any */
import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";

// Mock Hooks
mock.module("@/app/hooks/useAnalytics", {
  namedExports: { 
    useAnalyticsData: mock.fn(() => ({
      state: {
        loading: false,
        data: {
          performance: {},
          forecast: {},
          costs: {}
        }
      }
    }))
  },
});

// Mock child components
mock.module("@/app/components/dashboard/analytics/AnalyticsHeader", {
  defaultExport: () => <div data-testid="analytics-header">Header</div>,
});
mock.module("@/app/components/dashboard/analytics/PerformanceGauges", {
  defaultExport: () => <div data-testid="performance-gauges">Gauges</div>,
});
mock.module("@/app/components/dashboard/analytics/CostAnalysisCharts", {
  defaultExport: () => <div data-testid="cost-analysis">Costs</div>,
});
mock.module("@/app/components/dashboard/analytics/ForecastingWidget", {
  defaultExport: () => <div data-testid="forecasting-widget">Forecast</div>,
});

describe("AnalyticsContent Component", () => {
  let AnalyticsContent: any;

  before(async () => {
    const mod = await import("./AnalyticsContent");
    AnalyticsContent = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  describe("AnalyticsContent() Render Testleri", () => {
    it("should_RenderAnalyticsElements_Correctly_WhenDataIsLoaded", async () => {
      // Act
      render(<AnalyticsContent />);

      // Assert basic renders
      expect(screen.getByTestId("analytics-header")).toBeTruthy();
      expect(screen.getByTestId("performance-gauges")).toBeTruthy();
      expect(screen.getByTestId("cost-analysis")).toBeTruthy();
      expect(screen.getByTestId("forecasting-widget")).toBeTruthy();
    });
  });
});
