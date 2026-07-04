/* eslint-disable @typescript-eslint/no-explicit-any */
import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// 1. Mocks
const mockRouterPush = mock.fn();
mock.module("next/navigation", {
  namedExports: {
    useRouter: () => ({ push: mockRouterPush }),
  },
});

const mockDict = {
  dashboard: {
    overview: {
      actionRequired: {
        title: "Action Required",
        pendingCount: "{count} Pending",
        allClear: "All Clear",
      },
    },
  },
};

mock.module("../../../lib/language/DictionaryContext.tsx", {
  namedExports: {
    useDictionary: () => mockDict,
    useLanguage: () => ({ lang: "en", dict: mockDict }),
  },
});

mock.module("../../cards/card.tsx", {
  defaultExport: ({ children }: any) => <div data-testid="custom-card">{children}</div>,
});

// Custom theme with alpha tokens
const customTheme = createTheme({
  palette: {
    mode: "light",
    error: { main: "#f44336" } as any,
    warning: { main: "#ff9800" } as any,
    secondary: { main: "#9c27b0" } as any,
    info: { main: "#2196f3" } as any,
    success: { main: "#4caf50" } as any,
  },
});

(customTheme.palette.error as any)._alpha = { main_10: "rgba(244,67,54,0.1)" };
(customTheme.palette.warning as any)._alpha = { main_10: "rgba(255,152,0,0.1)" };
(customTheme.palette.secondary as any)._alpha = { main_10: "rgba(156,39,176,0.1)" };
(customTheme.palette.info as any)._alpha = { main_10: "rgba(33,150,243,0.1)" };
(customTheme.palette.success as any)._alpha = { main_10: "rgba(76,175,80,0.1)" };

import * as originalMui from "@mui/material";
mock.module("@mui/material", {
  namedExports: {
    ...originalMui,
    useTheme: mock.fn(() => customTheme),
  },
});

describe("ActionRequiredCard RTL Component", () => {
  let ActionRequiredCard: any;

  before(async () => {
    const mod = await import("./actionRequiredCard");
    ActionRequiredCard = mod.default;
  });

  afterEach(() => {
    cleanup();
    mockRouterPush.mock.resetCalls();
  });

  const mockAlerts = [
    { type: "SHIPMENT_DELAY", title: "Shipment 101", message: "Delayed by 2 hours", link: "/shipment/101" },
    { type: "vehicle", title: "Truck Beta", message: "Needs maintenance", link: "/vehicle/beta" },
    { type: "driver", title: "John Doe", message: "License expiring", link: "/driver/john" },
    { type: "DOCUMENT_DUE", title: "Invoice", message: "Due today", link: "/document/1" },
    { type: "warehouse", title: "Dock A", message: "Full capacity", link: "/warehouse/a" },
  ];

  describe("ActionRequiredCard() bileşeni", () => {
    it("should_RenderAllClearState_WhenAlertsIsEmpty", async () => {
      render(
        <ThemeProvider theme={customTheme}>
          <ActionRequiredCard alerts={[]} />
        </ThemeProvider>
      );
      expect(screen.getByText("Action Required")).toBeTruthy();
      expect(screen.getByText("All Clear")).toBeTruthy();
    });

    it("should_RenderAlertsList_WithCorrectData", async () => {
      render(
        <ThemeProvider theme={customTheme}>
          <ActionRequiredCard alerts={mockAlerts as any} />
        </ThemeProvider>
      );

      // Check title and pending count
      expect(screen.getByText("Action Required")).toBeTruthy();
      expect(screen.getByText("5 Pending")).toBeTruthy();

      // Check alerts
      expect(screen.getByText("Shipment 101")).toBeTruthy();
      expect(screen.getByText("Delayed by 2 hours")).toBeTruthy();
      expect(screen.getByText("Truck Beta")).toBeTruthy();
      expect(screen.getByText("John Doe")).toBeTruthy();
      expect(screen.getByText("Invoice")).toBeTruthy();
      expect(screen.getByText("Dock A")).toBeTruthy();
    });

    it("should_NavigateToLink_WhenAlertIsClicked", async () => {
      render(
        <ThemeProvider theme={customTheme}>
          <ActionRequiredCard alerts={mockAlerts as any} />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByText("Shipment 101"));
      expect(mockRouterPush.mock.calls.length).toBe(1);
      expect(mockRouterPush.mock.calls[0].arguments[0]).toBe("/shipment/101");
    });
  });
});
