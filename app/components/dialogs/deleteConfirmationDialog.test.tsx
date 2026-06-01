import { describe, it, before, mock, beforeEach } from "node:test";
import { expect } from "expect";

// 1. MOCK'LAR
const useThemeMock = mock.fn(() => ({
  palette: {
    mode: "light",
    background: { paper: "white" },
    error: { main: "red", dark: "darkred", _alpha: { main_10: "", main_20: "", main_30: "" } },
    divider: "gray",
  }
}));

const useDictionaryMock = mock.fn(() => ({
  common: {
    thisActionCannotBeUndone: "This action cannot be undone",
    cancel: "Cancel",
    deleting: "Deleting...",
    confirmDelete: "Confirm Delete"
  }
}));

mock.module("@mui/material", {
  namedExports: { 
    useTheme: useThemeMock,
    Dialog: (props: unknown) => ({ type: "Dialog", props }),
    DialogContent: (props: unknown) => ({ type: "DialogContent", props }),
    Button: (props: unknown) => ({ type: "Button", props }),
    Typography: (props: unknown) => ({ type: "Typography", props }),
    Box: (props: unknown) => ({ type: "Box", props }),
    Stack: (props: unknown) => ({ type: "Stack", props }),
    IconButton: (props: unknown) => ({ type: "IconButton", props })
  }
});

mock.module("@mui/icons-material", {
  namedExports: {
    Warning: () => ({ type: "WarningIcon" }),
    Close: () => ({ type: "CloseIcon" }),
  }
});

mock.module("@/app/lib/language/DictionaryContext", {
  namedExports: { useDictionary: useDictionaryMock }
});

describe("DeleteConfirmationDialog Component", () => {
  let DeleteConfirmationDialog: React.ElementType;

  before(async () => {
    const mod = await import("./deleteConfirmationDialog");
    DeleteConfirmationDialog = mod.default;
  });

  beforeEach(() => {
    useThemeMock.mock.resetCalls();
    useDictionaryMock.mock.resetCalls();
  });

  describe("DeleteConfirmationDialog() bileşeni", () => {
    it("should_ReturnDialogElement_WhenRendered", async () => {
      // Act
      const element = DeleteConfirmationDialog({ 
        open: true, 
        onClose: () => {}, 
        onConfirm: () => {}, 
        title: "Delete Item",
        description: "Are you sure you want to delete?",
        loading: false 
      });
      
      // Assert
      expect(element).toBeDefined();
      expect(typeof element.type).toBe("function");
      expect(element.props.open).toBe(true);
      expect(useThemeMock.mock.calls.length).toBe(1);
    });

    it("should_ReturnDialogElement_WhenLoadingIsTrue", async () => {
      // Act
      const element = DeleteConfirmationDialog({ 
        open: true, 
        onClose: () => {}, 
        onConfirm: () => {}, 
        title: "Delete Item",
        description: "Are you sure you want to delete?",
        loading: true 
      });
      
      // Assert
      expect(element).toBeDefined();
    });
  });
});
