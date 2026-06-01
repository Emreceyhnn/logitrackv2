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
      editTitle: "Edit Warehouse",
      locationTitle: "Location",
      capacityTitle: "Capacity",
      updateButton: "Update",
      steps: { basicInfo: "Basic", location: "Location", capacity: "Capacity" }
    }
  },
  toasts: { loading: "Loading", successEdit: "Updated", errorGeneric: "Error" }
}));

const useUserMock = mock.fn(() => ({
  user: { companyId: "comp-123" }
}));

const updateWarehouseMock = mock.fn();

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
    CircularProgress: (props: any) => ({ type: "CircularProgress", props }),
  }
});

mock.module("@mui/icons-material/Close", { defaultExport: () => ({ type: "CloseIcon" }) });

import * as originalReact from "react";

mock.module("react", {
  namedExports: {
    ...originalReact,
    useState: (init: any) => [init, mock.fn()],
    useEffect: (fn: any) => fn(),
    useRef: (init: any) => ({ current: init })
  }
});

mock.module("../../../../lib/controllers/warehouse.ts", {
  namedExports: { updateWarehouse: updateWarehouseMock }
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

describe("EditWarehouseDialog Component", () => {
  let EditWarehouseDialog: any;

  before(async () => {
    const mod = await import("./index");
    EditWarehouseDialog = mod.default;
  });

  beforeEach(() => {
    useThemeMock.mock.resetCalls();
    useDictionaryMock.mock.resetCalls();
    useUserMock.mock.resetCalls();
    updateWarehouseMock.mock.resetCalls();
  });

  describe("EditWarehouseDialog() bileşeni", () => {
    it("should_ReturnDialogElement_WhenRenderedWithWarehouseData", async () => {
      // Act
      const element = EditWarehouseDialog({ 
        open: true, 
        onClose: () => {}, 
        onSuccess: () => {},
        warehouseData: { id: "wh-1", name: "Main WH", operatingHours: "08:00 - 18:00" } 
      });
      
      // Assert
      expect(element).toBeDefined();
    });

    it("should_ReturnNull_WhenWarehouseDataIsMissing", async () => {
      // Act
      const element = EditWarehouseDialog({ 
        open: true, 
        onClose: () => {}, 
        onSuccess: () => {},
        warehouseData: null 
      });
      
      // Assert
      expect(element).toBeNull();
    });
  });
});
