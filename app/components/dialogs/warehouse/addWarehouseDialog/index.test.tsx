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
