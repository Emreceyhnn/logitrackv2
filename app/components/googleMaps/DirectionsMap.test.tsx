import { describe, it, before, mock, beforeEach } from "node:test";
import { expect } from "expect";
import { renderToString } from "react-dom/server";
import React from "react";
global.React = React;
(global as any).window = { google: { maps: { SymbolPath: { CIRCLE: 0 } } } };

// MOCKLAR
const useDictionaryMock = mock.fn(() => ({
  maps: { calculatingRoute: "Calculating", unableCalculateRoute: "Error" }
}));

mock.module("../../lib/language/DictionaryContext", { namedExports: { useDictionary: useDictionaryMock } });
mock.module("next/image", { defaultExport: () => () => <div data-testid="Image" /> });

mock.module("@react-google-maps/api", {
  namedExports: {
    GoogleMap: ({ children }: any) => <div data-testid="GoogleMap">{children}</div>,
    DirectionsRenderer: () => <div data-testid="DirectionsRenderer" />,
    Marker: () => <div data-testid="Marker" />,
    OverlayView: ({ children }: any) => <div data-testid="OverlayView">{children}</div>
  }
});

describe("DirectionsMap Component", () => {
  let DirectionsMap: any;

  before(async () => {
    const mod = await import("./DirectionsMap");
    DirectionsMap = mod.DirectionsMap || mod.default;
  });

  beforeEach(() => {
    useDictionaryMock.mock.resetCalls();
  });

  describe("DirectionsMap() bileşeni", () => {
    it("should_InitializeWithoutErrors_WhenRendered", async () => {
      let error = null;
      let html = "";
      try {
        html = renderToString(<DirectionsMap origin={{ lat: 1, lng: 1 }} destination={{ lat: 2, lng: 2 }} />);
      } catch (e) {
        error = e;
      }
      
      expect(error).toBeNull();
      expect(html).toContain("data-testid=\"GoogleMap\"");
    });
  });
});
