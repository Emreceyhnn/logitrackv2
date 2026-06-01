/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, before, mock, beforeEach } from "node:test";
import { expect } from "expect";
import { renderToString } from "react-dom/server";
import React from "react";

// MOCKLAR
const useDictionaryMock = mock.fn(() => ({
  maps: { apiError: "Error", apiErrorDesc: "Desc", initializing: "Init" }
}));

const useJsApiLoaderMock = mock.fn(() => ({ isLoaded: true, loadError: null }));

mock.module("../../lib/language/DictionaryContext", { namedExports: { useDictionary: useDictionaryMock } });
mock.module("@react-google-maps/api", { namedExports: { useJsApiLoader: useJsApiLoaderMock } });

mock.module("@mui/material", {
  namedExports: {
    useTheme: mock.fn(() => ({
      palette: {
        error: { _alpha: { main_05: "", main_20: "" } },
        primary: { main: "blue" }
      }
    })),
    Box: ({ children }: any) => <div data-testid="Box">{children}</div>,
    CircularProgress: () => <div data-testid="CircularProgress" />,
    Typography: ({ children }: any) => <div data-testid="Typography">{children}</div>
  }
});

mock.module("@mui/icons-material/WarningAmber", { defaultExport: () => () => <div data-testid="WarningAmberIcon" /> });

describe("GoogleMapsProvider Component", () => {
  let GoogleMapsProvider: any;

  before(async () => {
    const mod = await import("./GoogleMapsProvider");
    GoogleMapsProvider = mod.GoogleMapsProvider || mod.default;
  });

  beforeEach(() => {
    useDictionaryMock.mock.resetCalls();
    useJsApiLoaderMock.mock.resetCalls();
  });

  describe("GoogleMapsProvider() bileşeni", () => {
    it("should_RenderChildren_WhenLoaded", async () => {
      let error = null;
      let html = "";
      try {
        html = renderToString(<GoogleMapsProvider><div>TestChild</div></GoogleMapsProvider>);
      } catch (e) {
        error = e;
      }
      
      expect(error).toBeNull();
      expect(html).toContain("TestChild");
    });
  });
});
