import { describe, it, before, mock } from "node:test";
import { expect } from "expect";
import { renderToString } from "react-dom/server";
import React from "react";

mock.module("next/image", { defaultExport: () => () => <div data-testid="Image" /> });

mock.module("@react-google-maps/api", {
  namedExports: {
    GoogleMap: ({ children }: any) => <div data-testid="GoogleMap">{children}</div>,
    MarkerF: () => <div data-testid="MarkerF" />,
    OverlayView: ({ children }: any) => <div data-testid="OverlayView">{children}</div>
  }
});

describe("MapWithMarker Component", () => {
  let MapWithMarker: any;

  before(async () => {
    const mod = await import("./MapWithMarker");
    MapWithMarker = mod.MapWithMarker || mod.default;
  });

  describe("MapWithMarker() bileşeni", () => {
    it("should_InitializeWithoutErrors_WhenRendered", async () => {
      let error = null;
      let html = "";
      try {
        html = renderToString(<MapWithMarker markers={[{ position: { lat: 1, lng: 1 }, type: "vehicle" }]} />);
      } catch (e) {
        error = e;
      }
      
      expect(error).toBeNull();
      expect(html).toContain("data-testid=\"GoogleMap\"");
    });
  });
});
