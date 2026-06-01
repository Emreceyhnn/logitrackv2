/* eslint-disable @typescript-eslint/no-explicit-any */
import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";

// 1. Mocks
const mockDict = {
  drivers: {
    dashboard: {
      ratings: "Ratings",
      weeklyHours: "Weekly Hours",
      ratingsLabel: "Rating (0-5)",
      hours: "Hours",
      hoursThisWeek: "Hours This Week",
    },
  },
  sidebar: {
    drivers: "Drivers",
  },
};

mock.module("../../../lib/language/DictionaryContext.tsx", {
  namedExports: { useDictionary: () => mockDict },
});

mock.module("../../skeletons/AnalyticsSkeleton.tsx", {
  defaultExport: ({ title }: any) => <div data-testid="analytics-skeleton">{title}</div>,
});

mock.module("../../cards/card.tsx", {
  defaultExport: ({ children }: any) => <div data-testid="custom-card">{children}</div>,
});

// Mock Recharts BarChart
mock.module("@mui/x-charts/BarChart", {
  namedExports: {
    BarChart: ({ series, xAxis }: any) => (
      <div data-testid="bar-chart">
        <div data-testid="x-axis-data">
          {xAxis?.[0]?.data?.join(",")}
        </div>
        <div data-testid="series-data">
          {series?.[0]?.data?.join(",")}
        </div>
      </div>
    ),
  },
});

describe("DriverPerformanceCharts RTL Component", () => {
  let DriverPerformanceCharts: any;

  before(async () => {
    const mod = await import("./driverPerformanceCharts");
    DriverPerformanceCharts = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  const mockData = [
    { name: "John Doe", rating: 4.5, workingHours: 40 },
    { name: "Jane Smith", rating: 4.8, workingHours: 35 },
  ];

  describe("DriverPerformanceCharts() bileşeni", () => {
    it("should_RenderSkeletons_WhenLoadingIsTrue", async () => {
      render(<DriverPerformanceCharts data={mockData} loading={true} />);
      const skeletons = screen.getAllByTestId("analytics-skeleton");
      expect(skeletons.length).toBe(2);
      expect(screen.getByText("Ratings")).toBeTruthy();
      expect(screen.getByText("Weekly Hours")).toBeTruthy();
    });

    it("should_RenderSkeletons_WhenDataIsUndefined", async () => {
      render(<DriverPerformanceCharts data={undefined} loading={false} />);
      expect(screen.getAllByTestId("analytics-skeleton").length).toBe(2);
    });

    it("should_RenderBarCharts_WithCorrectMappedData", async () => {
      render(<DriverPerformanceCharts data={mockData} loading={false} />);
      
      const charts = screen.getAllByTestId("bar-chart");
      expect(charts.length).toBe(2);

      // X-axis for both charts should contain names
      const xAxisElements = screen.getAllByTestId("x-axis-data");
      expect(xAxisElements[0].textContent).toBe("John Doe,Jane Smith");
      expect(xAxisElements[1].textContent).toBe("John Doe,Jane Smith");

      // Series data
      const seriesElements = screen.getAllByTestId("series-data");
      // Ratings chart
      expect(seriesElements[0].textContent).toBe("4.5,4.8");
      // Hours chart
      expect(seriesElements[1].textContent).toBe("40,35");
    });
  });
});
