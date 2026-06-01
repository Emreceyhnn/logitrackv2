import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const mockDict = {
  dashboard: {
    overview: {
      fuelConsumption: {
        title: "Fuel Consumption",
      },
    },
  },
  fuel: {
    noLogs: "No fuel logs found",
  },
};

mock.module("@/app/lib/language/DictionaryContext", {
  namedExports: { useDictionary: () => mockDict },
});

mock.module("../../cards/card", {
  defaultExport: ({ children }: { children?: React.ReactNode }) => <div data-testid="custom-card">{children}</div>,
});

mock.module("../../charts/TimeRangeSelector", {
  defaultExport: ({ value, onChange }: unknown) => (
    <div data-testid="time-range-selector">
      <span>{value}</span>
      <button onClick={() => onChange("1m")}>Set 1m</button>
    </div>
  ),
});

mock.module("@mui/x-charts", {
  namedExports: {
    BarChart: ({ series, xAxis }: unknown) => (
      <div data-testid="bar-chart">
        {xAxis?.[0]?.data?.map((plate: string, i: number) => (
          <div key={plate} data-testid={`bar-${plate}`}>
            {series?.[0]?.data[i]}
          </div>
        ))}
      </div>
    ),
  },
});

describe("FuelByVehicleCard RTL Component", () => {
  let FuelByVehicleCard: React.ElementType;

  before(async () => {
    const mod = await import("./fuelByVehicleCard");
    FuelByVehicleCard = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  const generateLogs = (daysAgo: number, plate: string, amount: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return { id: Math.random().toString(), plate, amount, date: date.toISOString() };
  };

  const mockLogs = [
    generateLogs(2, "TRUCK-A", 100),
    generateLogs(5, "TRUCK-A", 50), // Total 150 (within 1w)
    generateLogs(10, "TRUCK-B", 200), // Within 2w
    generateLogs(25, "TRUCK-C", 300), // Within 1m
  ];

  describe("FuelByVehicleCard() bileşeni", () => {
    it("should_ReturnNull_WhenLogsIsNull", async () => {
      const { container } = render(<FuelByVehicleCard logs={null} />);
      expect(container.firstChild).toBeNull();
    });

    it("should_RenderEmptyState_WhenNoLogsInTimeRange", async () => {
      // By default time range is "1w". So TRUCK-B and TRUCK-C are filtered out.
      // If we pass an array with only old logs, it should show empty state.
      render(<FuelByVehicleCard logs={[generateLogs(10, "TRUCK-X", 100)]} />);
      expect(screen.getByText("No fuel logs found")).toBeTruthy();
    });

    it("should_RenderBarChart_WithAggregatedData_WithinDefault1wRange", async () => {
      render(<FuelByVehicleCard logs={mockLogs} />);
      
      expect(screen.getByText("Fuel Consumption")).toBeTruthy();
      expect(screen.getByTestId("bar-chart")).toBeTruthy();
      // Only TRUCK-A is within 1w
      expect(screen.getByTestId("bar-TRUCK-A").textContent).toBe("150");
      expect(screen.queryByTestId("bar-TRUCK-B")).toBeNull();
    });

    it("should_UpdateTimeRange_AndRefilterData_WhenSelectorChanges", async () => {
      render(<FuelByVehicleCard logs={mockLogs} />);
      
      // TRUCK-C is out of 1w range
      expect(screen.queryByTestId("bar-TRUCK-C")).toBeNull();

      // Change time range to 1m
      fireEvent.click(screen.getByText("Set 1m"));

      // TRUCK-A (150), TRUCK-B (200), TRUCK-C (300) should now be in 1m range
      expect(screen.getByTestId("bar-TRUCK-C").textContent).toBe("300");
      expect(screen.getByTestId("bar-TRUCK-B").textContent).toBe("200");
    });
  });
});
