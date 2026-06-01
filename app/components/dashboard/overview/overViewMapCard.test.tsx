/* eslint-disable @typescript-eslint/no-explicit-any */
import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";

mock.module("../../cards/card", {
  defaultExport: ({ children }: any) => <div data-testid="custom-card">{children}</div>,
});

mock.module("../../googleMaps/GoogleMapsProvider", {
  namedExports: {
    GoogleMapsProvider: ({ children }: any) => <div data-testid="gmaps-provider">{children}</div>,
  },
});

mock.module("../../googleMaps/MapWithMarker", {
  namedExports: {
    MapWithMarker: ({ markers }: any) => (
      <div data-testid="map-with-marker">
        {markers.map((m: any, i: number) => (
          <div key={i} data-testid={`marker-${m.label}`}>{m.type}</div>
        ))}
      </div>
    ),
  },
});

describe("OverviewMapCard RTL Component", () => {
  let OverviewMapCard: any;

  before(async () => {
    const mod = await import("./overViewMapCard");
    OverviewMapCard = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  const mockStats = [
    { type: "W", name: "Warehouse A", position: { lat: 10, lng: 20 } },
    { type: "V", name: "Vehicle 1", position: { lat: 11, lng: 21 } },
    { type: "C", name: "Customer X", position: { lat: 12, lng: 22 } },
    { type: "X", name: "Unknown", position: { lat: 13, lng: 23 } }, // Default
  ];

  describe("OverviewMapCard() bileşeni", () => {
    it("should_ReturnNull_WhenStatsIsNull", async () => {
      const { container } = render(<OverviewMapCard stats={null} />);
      expect(container.firstChild).toBeNull();
    });

    it("should_RenderMapWithMarkers_MappedToCorrectTypes", async () => {
      render(<OverviewMapCard stats={mockStats as any} />);
      
      expect(screen.getByTestId("gmaps-provider")).toBeTruthy();
      expect(screen.getByTestId("map-with-marker")).toBeTruthy();
      
      // Warehouse A should be 'warehouse'
      expect(screen.getByTestId("marker-Warehouse A").textContent).toBe("warehouse");
      // Vehicle 1 should be 'vehicle'
      expect(screen.getByTestId("marker-Vehicle 1").textContent).toBe("vehicle");
      // Customer X should be 'customer'
      expect(screen.getByTestId("marker-Customer X").textContent).toBe("customer");
      // Unknown should be 'default'
      expect(screen.getByTestId("marker-Unknown").textContent).toBe("default");
    });
  });
});
