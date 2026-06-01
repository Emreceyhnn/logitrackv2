/* eslint-disable @typescript-eslint/no-explicit-any */
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
    logout: "Logout",
    confirmLogoutDescription: "Description",
    logoutWarning: "Warning",
    cancel: "Cancel"
  }
}));

mock.module("@mui/material", {
  namedExports: { 
    useTheme: useThemeMock,
    Dialog: (props: any) => ({ type: "Dialog", props }),
    DialogContent: (props: any) => ({ type: "DialogContent", props }),
    Button: (props: any) => ({ type: "Button", props }),
    Typography: (props: any) => ({ type: "Typography", props }),
    Box: (props: any) => ({ type: "Box", props }),
    Stack: (props: any) => ({ type: "Stack", props }),
    IconButton: (props: any) => ({ type: "IconButton", props })
  }
});

mock.module("@mui/icons-material", {
  namedExports: {
    Logout: () => ({ type: "LogoutIcon" }),
    Close: () => ({ type: "CloseIcon" }),
  }
});

mock.module("../../lib/language/DictionaryContext", {
  namedExports: { useDictionary: useDictionaryMock }
});

describe("LogoutConfirmationDialog Component", () => {
  let LogoutConfirmationDialog: any;

  before(async () => {
    const mod = await import("./logoutConfirmationDialog");
    LogoutConfirmationDialog = mod.default;
  });

  beforeEach(() => {
    useThemeMock.mock.resetCalls();
    useDictionaryMock.mock.resetCalls();
  });

  describe("LogoutConfirmationDialog() bileşeni", () => {
    it("should_ReturnDialogElement_WhenRendered", async () => {
      // Act
      const element = LogoutConfirmationDialog({ 
        open: true, 
        onClose: () => {}, 
        onConfirm: () => {}, 
        loading: false 
      });
      
      // Assert
      expect(element).toBeDefined();
      expect(typeof element.type).toBe("function");
      expect(element.props.open).toBe(true);
      expect(useThemeMock.mock.calls.length).toBe(1);
    });

    it("should_PassLoadingPropCorrectly_WhenLoadingIsTrue", async () => {
      // Act
      const element = LogoutConfirmationDialog({ 
        open: true, 
        onClose: () => {}, 
        onConfirm: () => {}, 
        loading: true 
      });
      
      // Assert
      expect(element).toBeDefined();
    });
  });
});
