/* eslint-disable @typescript-eslint/no-explicit-any */
import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import React from "react";

const mockDict = {
  dashboard: {
    overview: {
      shipmentVolume: {
        title: "Shipment Volume",
        noHistory: "No shipment history",
        shipmentsCount: "{count} Shipments",
      },
    },
  },
};

mock.module("../../../lib/language/DictionaryContext.tsx", {
  namedExports: { useDictionary: () => mockDict },
});

mock.module("../../cards/card.tsx", {
  defaultExport: ({ children }: any) => <div data-testid="custom-card">{children}</div>,
});

mock.module("../../charts/TimeRangeSelector.tsx", {
  defaultExport: ({ value, onChange }: any) => (
    <div data-testid="time-range-selector">
      <span>{value}</span>
      <button onClick={() => onChange("1m")}>Set 1m</button>
    </div>
  ),
});

mock.module("@mui/x-charts", {
  namedExports: {
    BarChart: ({ series, xAxis }: any) => (
      <div data-testid="bar-chart">
        {xAxis?.[0]?.data?.map((date: string, i: number) => (
          <div key={date} data-testid={`bar-${date}`}>
            {series?.[0]?.data[i]}
          </div>
        ))}
      </div>
    ),
  },
});

describe("ShipmentVolumeCard RTL Component", () => {
  let ShipmentVolumeCard: any;

  before(async () => {
    const mod = await import("./onTimeTrends");
    ShipmentVolumeCard = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  // Data represents 10 days
  const mockValues = Array.from({ length: 10 }).map((_, i) => ({
    date: `2026-05-0${i + 1}`,
    count: i * 10,
  }));

  describe("ShipmentVolumeCard() bileşeni", () => {
    it("should_ReturnNull_WhenValuesIsNull", async () => {
      const { container } = render(<ShipmentVolumeCard values={null as any} />);
      expect(container.firstChild).toBeNull();
    });

    it("should_RenderEmptyState_WhenValuesIsEmpty", async () => {
      render(<ShipmentVolumeCard values={[]} />);
      expect(screen.getByText("No shipment history")).toBeTruthy();
    });

    it("should_RenderBarChart_WithDefault1wRange", async () => {
      render(<ShipmentVolumeCard values={mockValues} />);
      
      expect(screen.getByText("Shipment Volume")).toBeTruthy();
      expect(screen.getByTestId("bar-chart")).toBeTruthy();
      
      // Default is 1w (7 days). So from array of length 10, it slices the last 7
      // 10 - 7 = 3. Elements index 3 to 9 (length 7). First should be date '2026-05-04'
      expect(screen.getByTestId("bar-2026-05-04")).toBeTruthy();
      expect(screen.queryByTestId("bar-2026-05-03")).toBeNull();
    });

    it("should_UpdateTimeRange_AndRefilterData_WhenSelectorChanges", async () => {
      render(<ShipmentVolumeCard values={mockValues} />);
      
      // 2026-05-01 is out of 1w range
      expect(screen.queryByTestId("bar-2026-05-01")).toBeNull();

      // Change time range to 1m
      fireEvent.click(screen.getByText("Set 1m"));

      // 1m > 10 days, so it should render all elements
      expect(screen.getByTestId("bar-2026-05-01")).toBeTruthy();
    });
  });
});
