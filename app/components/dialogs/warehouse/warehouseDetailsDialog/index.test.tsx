import { describe, it, before, mock, beforeEach } from "node:test";
import { expect } from "expect";

// 1. MOCK'LAR
const useThemeMock = mock.fn(() => ({
  palette: {
    primary: { main: "blue", _alpha: { main_10: "" } },
    divider_alpha: { main_10: "" }
  }
}));

const useDictionaryMock = mock.fn(() => ({
  warehouses: {
    dialogs: {
      details: { overview: "Overview", inventory: "Inventory" }
    }
  }
}));

mock.module("@mui/material", {
  namedExports: { 
    useTheme: useThemeMock,
    Dialog: (props: unknown) => ({ type: "Dialog", props }),
    DialogContent: (props: unknown) => ({ type: "DialogContent", props }),
    Avatar: (props: unknown) => ({ type: "Avatar", props }),
    Typography: (props: unknown) => ({ type: "Typography", props }),
    Box: (props: unknown) => ({ type: "Box", props }),
    Stack: (props: unknown) => ({ type: "Stack", props }),
    IconButton: (props: unknown) => ({ type: "IconButton", props }),
    Tab: (props: unknown) => ({ type: "Tab", props }),
    Tabs: (props: unknown) => ({ type: "Tabs", props }),
  }
});

mock.module("@mui/icons-material/Close", { defaultExport: () => ({ type: "CloseIcon" }) });
mock.module("@mui/icons-material/Storefront", { defaultExport: () => ({ type: "WarehouseIcon" }) });
mock.module("@mui/icons-material/LocationOn", { defaultExport: () => ({ type: "LocationOnIcon" }) });
mock.module("@mui/icons-material/Business", { defaultExport: () => ({ type: "BusinessIcon" }) });
mock.module("@mui/icons-material/Edit", { defaultExport: () => ({ type: "EditIcon" }) });

import * as originalReact from "react";

mock.module("react", {
  namedExports: {
    ...originalReact,
    useState: (init: unknown) => [init, mock.fn()]
  }
});

mock.module("@/app/lib/language/DictionaryContext", {
  namedExports: { useDictionary: useDictionaryMock }
});

mock.module("./overviewTab", { defaultExport: () => ({ type: "OverviewTab" }) });
mock.module("./inventoryTab", { defaultExport: () => ({ type: "InventoryTab" }) });
mock.module("../editWarehouseDialog", { defaultExport: () => ({ type: "EditWarehouseDialog" }) });

describe("WarehouseDetailsDialog Component", () => {
  let WarehouseDetailsDialog: React.ElementType;

  before(async () => {
    const mod = await import("./index");
    WarehouseDetailsDialog = mod.default;
  });

  beforeEach(() => {
    useThemeMock.mock.resetCalls();
    useDictionaryMock.mock.resetCalls();
  });

  describe("WarehouseDetailsDialog() bileşeni", () => {
    it("should_ReturnDialogElement_WhenRenderedWithWarehouseData", async () => {
      // Act
      const element = WarehouseDetailsDialog({ 
        open: true, 
        onClose: () => {}, 
        warehouseData: { id: "wh-1", name: "Main WH", code: "WH-001", city: "Istanbul", country: "Turkey" } 
      });
      
      // Assert
      expect(element).toBeDefined();
    });

    it("should_ReturnNull_WhenWarehouseDataIsMissing", async () => {
      // Act
      const element = WarehouseDetailsDialog({ 
        open: true, 
        onClose: () => {}, 
        warehouseData: null 
      });
      
      // Assert
      expect(element).toBeNull();
    });
  });
});
