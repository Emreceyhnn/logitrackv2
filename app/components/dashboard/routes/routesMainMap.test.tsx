/* eslint-disable @typescript-eslint/no-explicit-any */
import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";

// 1. Mocks




import * as originalMui from "@mui/material";
mock.module("@mui/material", {
  namedExports: {
    ...originalMui,
    Skeleton: ({ variant }: any) => <div data-testid="loading-skeleton" data-variant={variant} />,
  }
});

describe("RoutesMainMap RTL Component", () => {
  let RoutesMainMap: any;

  before(async () => {
    const mod = await import("./routesMainMap");
    RoutesMainMap = mod.default;
  });

  afterEach(() => { cleanup(); });

  const mockMapData = [
    { name: "Truck Alpha", type: "V", position: { lat: 41.0, lng: 28.9 } },
    { name: "Warehouse HQ", type: "W", position: { lat: 41.1, lng: 29.0 } },
  ];

  describe("RoutesMainMap() bileşeni", () => {
    it("should_RenderLoadingSkeleton_WhenLoadingIsTrue", async () => {
      render(<RoutesMainMap mapData={[]} loading={true} />);
      expect(screen.getByTestId("loading-skeleton")).toBeTruthy();
    });

    it("should_RenderMarkersOnMap_ForEachMapDataEntry", async () => {
      render(<RoutesMainMap mapData={mockMapData} loading={false} />);

      expect(screen.getByTestId("map-with-marker")).toBeTruthy();
      // Vehicle marker (type "V" → markerType = "vehicle")
      expect(screen.getByTestId("marker-Truck Alpha").textContent).toBe("vehicle");
      // Other type → markerType = "default"
      expect(screen.getByTestId("marker-Warehouse HQ").textContent).toBe("default");
    });

    
  });
});
