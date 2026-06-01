/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, before, mock, beforeEach } from "node:test";
import { expect } from "expect";

// 1. MOCK'LAR
const useThemeMock = mock.fn(() => ({
  palette: {
    mode: "light",
    background: { paper: "white" },
    primary: { main: "blue", _alpha: { main_20: "" } },
    text: { primary: "black", secondary: "gray" },
    action: { hover: "gray" },
    divider_alpha: { main_05: "" }
  }
}));

const useDictionaryMock = mock.fn(() => ({
  common: { step: "Step", next: "Next", back: "Back", cancel: "Cancel" },
  warehouses: {
    dialogs: {
      addTitle: "Add Warehouse",
      locationTitle: "Location",
      capacityTitle: "Capacity",
      createButton: "Create",
      steps: { basicInfo: "Basic", location: "Location", capacity: "Capacity" }
    }
  },
  toasts: { loading: "Loading", successAdd: "Added", errorGeneric: "Error" }
}));

const useUserMock = mock.fn(() => ({
  user: { companyId: "comp-123" }
}));

const createWarehouseMock = mock.fn();

mock.module("@mui/material", {
  namedExports: { 
    useTheme: useThemeMock,
    Dialog: (props: any) => ({ type: "Dialog", props }),
    DialogContent: (props: any) => ({ type: "DialogContent", props }),
    DialogActions: (props: any) => ({ type: "DialogActions", props }),
    Button: (props: any) => ({ type: "Button", props }),
    Typography: (props: any) => ({ type: "Typography", props }),
    Box: (props: any) => ({ type: "Box", props }),
    Stack: (props: any) => ({ type: "Stack", props }),
    IconButton: (props: any) => ({ type: "IconButton", props }),
    Stepper: (props: any) => ({ type: "Stepper", props }),
    Step: (props: any) => ({ type: "Step", props }),
    StepLabel: (props: any) => ({ type: "StepLabel", props }),
  }
});

mock.module("@mui/icons-material/Close", { defaultExport: () => ({ type: "CloseIcon" }) });

mock.module("sonner", {
  namedExports: {
    toast: { promise: mock.fn() }
  }
});

import * as originalReact from "react";

mock.module("react", {
  namedExports: {
    ...originalReact,
    useState: (init: any) => [init, mock.fn()]
  }
});

mock.module("../../../../lib/controllers/warehouse.ts", {
  namedExports: { createWarehouse: createWarehouseMock }
});

mock.module("../../../../hooks/useUser.ts", {
  namedExports: { useUser: useUserMock }
});

mock.module("../../../../lib/language/DictionaryContext.tsx", {
  namedExports: { useDictionary: useDictionaryMock }
});

mock.module("./sections/BasicInfoSection.tsx", { defaultExport: () => ({ type: "BasicInfoSection" }) });
mock.module("./sections/LocationSection.tsx", { defaultExport: () => ({ type: "LocationSection" }) });
mock.module("./sections/CapacitySection.tsx", { defaultExport: () => ({ type: "CapacitySection" }) });
mock.module("../../../googleMaps/GoogleMapsProvider.tsx", {
  namedExports: { GoogleMapsProvider: (props: any) => ({ type: "GoogleMapsProvider", props }) }
});

describe("AddWarehouseDialog Component", () => {
  let AddWarehouseDialog: any;

  before(async () => {
    const mod = await import("./index");
    AddWarehouseDialog = mod.default;
  });

  beforeEach(() => {
    useThemeMock.mock.resetCalls();
    useDictionaryMock.mock.resetCalls();
    useUserMock.mock.resetCalls();
    createWarehouseMock.mock.resetCalls();
  });

  describe("AddWarehouseDialog() bileşeni", () => {
    it("should_ReturnDialogElement_WhenRendered", async () => {
      // Act
      const element = AddWarehouseDialog({ open: true, onClose: () => {}, onSuccess: () => {} });
      
      // Assert
      expect(element).toBeDefined();
    });
  });
});
