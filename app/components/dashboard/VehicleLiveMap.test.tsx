/* eslint-disable @typescript-eslint/no-explicit-any */
import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// 1. Mock Contexts & Utils
const useDictionaryMock = mock.fn(() => ({
  dashboard: {
    fleet: {
      status: "Status",
      activeUnits: "Active Units",
      totalFleet: "Total Fleet",
      fleetId: "Fleet ID",
      currentOperator: "Operator",
      noDriver: "No Driver",
      kmh: "km/h",
      signal: "Signal",
      live: "Live",
      syncing: "Syncing",
    }
  }
}));

mock.module("../../lib/language/DictionaryContext.tsx", {
  namedExports: { useDictionary: useDictionaryMock },
});

const getVehiclesMock = mock.fn(async () => [
  {
    id: "veh-1",
    plate: "34 ABC 123",
    brand: "Ford",
    model: "Transit",
    fleetNo: "F-001",
    currentLat: 41.0,
    currentLng: 29.0,
    driver: null,
  }
]);

mock.module("../../lib/controllers/vehicle.ts", {
  namedExports: { 
    getVehicles: getVehiclesMock
  },
});

mock.module("../../hooks/useVehicleTracking.ts", {
  namedExports: { 
    useAllVehiclesTracking: mock.fn(() => ({
      vehicleLocations: {
        "veh-1": { lat: 41.1, lng: 29.1, speed: 60 }
      }
    }))
  },
});

mock.module("../googleMaps/MapWithMarker.tsx", {
  namedExports: { 
    MapWithMarker: ({ markers, onMarkerClick }: any) => (
      <div data-testid="map-mock">
        {markers.map((m: any) => (
          <button key={m.id} onClick={() => onMarkerClick(m)} data-testid={`marker-${m.id}`}>
            Marker {m.label}
          </button>
        ))}
      </div>
    )
  },
});

mock.module("../dialogs/vehicle/vehicleDetailsDialog/index.tsx", {
  defaultExport: () => <div data-testid="vehicle-dialog">Vehicle Dialog</div>,
});

// 2. Mock Theme
const customTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2", dark: "#115293" } as any,
    success: { main: "#4caf50" } as any,
  }
});

import * as originalMui from "@mui/material";
const useThemeMock = mock.fn(() => customTheme);
mock.module("@mui/material", {
  namedExports: {
    ...originalMui,
    useTheme: useThemeMock,
  },
});

describe("VehicleLiveMap RTL Component", () => {
  let VehicleLiveMap: any;

  before(async () => {
    const mod = await import("./VehicleLiveMap");
    VehicleLiveMap = mod.VehicleLiveMap;
  });

  afterEach(() => {
    cleanup();
    getVehiclesMock.mock.resetCalls();
  });

  describe("VehicleLiveMap() bileşeni", () => {
    it("should_LoadAndRenderVehicles_OnMap", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <VehicleLiveMap />
        </ThemeProvider>
      );

      // Wait for loading to finish and map to render
      await waitFor(() => {
        expect(screen.getByTestId("map-mock")).toBeTruthy();
        expect(screen.getByTestId("marker-veh-1")).toBeTruthy();
        expect(screen.getByText("Marker 34 ABC 123")).toBeTruthy();
      });
      
      // Also check the fleet stats panel
      expect(screen.getByText("Active Units")).toBeTruthy();
      // Total fleet length is 1
      expect(screen.getAllByText("1").length).toBeGreaterThan(0);
    });
  });
});
