import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// 1. Mock Contexts
const useDictionaryMock = mock.fn(() => ({
  common: {
    cancel: "Cancel",
    next: "Next",
    save: "Save",
    back: "Back",
  },
  shipments: {
    dialogs: {
      addTitle: "Add Shipment",
      cargoTitle: "Cargo Details",
      addSubtitle: "Add a new shipment",
      steps: {
        logistics: "Logistics",
        cargo: "Cargo",
      },
      fields: {
        exceedsTrailerWeight: "Exceeds weight",
        exceedsTrailerVolume: "Exceeds volume",
      },
    },
  },
  toasts: {
    loading: "Loading",
    successAdd: "Success",
    errorGeneric: "Error",
  },
  validation: {
    genericFormError: "Form Error",
  },
}));

const mockUser = { id: "u1", currency: "USD" };
const useUserMock = mock.fn(() => ({
  user: mockUser,
}));

mock.module("@/app/lib/language/DictionaryContext", {
  namedExports: { useDictionary: useDictionaryMock },
});

mock.module("@/app/hooks/useUser", {
  namedExports: { useUser: useUserMock },
});

// 2. Mock Controllers
const getWarehousesMock = mock.fn(async () => []);
const getCustomersMock = mock.fn(async () => []);
const getInventoryMock = mock.fn(async () => []);
const getTrailersMock = mock.fn(async () => ({ trailers: [], pagination: {} }));
const createShipmentMock = mock.fn(async () => ({}));

mock.module("@/app/lib/controllers/warehouse", {
  namedExports: { getWarehouses: getWarehousesMock },
});

mock.module("@/app/lib/controllers/customer", {
  namedExports: { getCustomers: getCustomersMock },
});

mock.module("@/app/lib/controllers/inventory", {
  namedExports: { getInventory: getInventoryMock },
});

mock.module("@/app/lib/controllers/trailer", {
  namedExports: { getTrailers: getTrailersMock },
});

mock.module("@/app/lib/controllers/shipments", {
  namedExports: { createShipment: createShipmentMock },
});

import * as Yup from "yup";
mock.module("@/app/lib/validationSchema", {
  namedExports: {
    addShipmentValidationSchema: () => Yup.object(),
    editShipmentValidationSchema: () => Yup.object(),
  },
});

// 3. Mock External Libraries and Providers
mock.module("sonner", {
  namedExports: { toast: { promise: mock.fn(), error: mock.fn() } },
});

mock.module("@/app/components/googleMaps/GoogleMapsProvider", {
  namedExports: { GoogleMapsProvider: ({ children }: any) => <div data-testid="maps-provider">{children}</div> },
});

// 4. Mock Sub-Sections
mock.module("./sections/BasicInfoSection", { defaultExport: () => <div data-testid="basic-info-section" /> });
mock.module("./sections/LogisticsSection", { defaultExport: () => <div data-testid="logistics-section" /> });
mock.module("./sections/CargoSection", { defaultExport: () => <div data-testid="cargo-section" /> });
mock.module("./sections/InventorySection", { defaultExport: () => <div data-testid="inventory-section" /> });
mock.module("./sections/StopsSection", { defaultExport: () => <div data-testid="stops-section" /> });

// 5. Mock Theme
const customTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" } as any,
    divider_alpha: { main_05: "rgba()" } as any,
  }
});
(customTheme.palette.primary as any)._alpha = { main_30: "rgba()", main_40: "rgba()", main_02: "rgba()", main_05: "rgba()", main_10: "rgba()", main_20: "rgba()" };
(customTheme.palette.error as any)._alpha = { main_10: "rgba()", main_05: "rgba()", main_20: "rgba()" };
(customTheme.palette.warning as any)._alpha = { main_10: "rgba()", main_05: "rgba()", main_20: "rgba()" };

import * as originalMui from "@mui/material";
const useThemeMock = mock.fn(() => customTheme);
mock.module("@mui/material", {
  namedExports: {
    ...originalMui,
    useTheme: useThemeMock,
  },
});

describe("AddShipmentDialog RTL Component", () => {
  let AddShipmentDialog: any;

  before(async () => {
    const mod = await import("./index");
    AddShipmentDialog = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  describe("AddShipmentDialog() bileşeni", () => {
    it("should_RenderDialogElements_WhenOpen", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <AddShipmentDialog open={true} onClose={() => {}} onSuccess={() => {}} />
        </ThemeProvider>
      );

      // Assert
      expect(screen.getByText(/Add Shipment/i)).toBeTruthy();
      expect(screen.getByText(/Logistics/i)).toBeTruthy();
      expect(screen.getByText(/Cargo/i)).toBeTruthy();
      
      // Step 1 Sub-components
      expect(screen.getByTestId("basic-info-section")).toBeTruthy();
      expect(screen.getByTestId("logistics-section")).toBeTruthy();
      expect(screen.getByTestId("stops-section")).toBeTruthy();
      
      expect(screen.getByText(/Next/i)).toBeTruthy();
    });
  });
});
