 
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
