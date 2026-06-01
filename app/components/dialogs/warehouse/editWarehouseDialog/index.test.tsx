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
    Dialog: (props: unknown) => ({ type: "Dialog", props }),
    DialogContent: (props: unknown) => ({ type: "DialogContent", props }),
    DialogActions: (props: unknown) => ({ type: "DialogActions", props }),
    Button: (props: unknown) => ({ type: "Button", props }),
    Typography: (props: unknown) => ({ type: "Typography", props }),
    Box: (props: unknown) => ({ type: "Box", props }),
    Stack: (props: unknown) => ({ type: "Stack", props }),
    IconButton: (props: unknown) => ({ type: "IconButton", props }),
    Stepper: (props: unknown) => ({ type: "Stepper", props }),
    Step: (props: unknown) => ({ type: "Step", props }),
    StepLabel: (props: unknown) => ({ type: "StepLabel", props }),
    CircularProgress: (props: unknown) => ({ type: "CircularProgress", props }),
  }
});

mock.module("@mui/icons-material/Close", { defaultExport: () => ({ type: "CloseIcon" }) });

import * as originalReact from "react";

mock.module("react", {
  namedExports: {
    ...originalReact,
    useState: (init: unknown) => [init, mock.fn()],
    useEffect: (fn: unknown) => fn(),
    useRef: (init: unknown) => ({ current: init })
  }
});

mock.module("@/app/lib/controllers/warehouse", {
  namedExports: { updateWarehouse: updateWarehouseMock }
});

mock.module("@/app/hooks/useUser", {
  namedExports: { useUser: useUserMock }
});

mock.module("@/app/lib/language/DictionaryContext", {
  namedExports: { useDictionary: useDictionaryMock }
});

mock.module("./sections/BasicInfoSection", { defaultExport: () => ({ type: "BasicInfoSection" }) });
mock.module("./sections/LocationSection", { defaultExport: () => ({ type: "LocationSection" }) });
mock.module("./sections/CapacitySection", { defaultExport: () => ({ type: "CapacitySection" }) });
mock.module("@/app/components/googleMaps/GoogleMapsProvider", {
  namedExports: { GoogleMapsProvider: (props: unknown) => ({ type: "GoogleMapsProvider", props }) }
});

describe("EditWarehouseDialog Component", () => {
  let EditWarehouseDialog: React.ElementType;

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
