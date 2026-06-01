/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, before, mock, beforeEach } from "node:test";
import { expect } from "expect";
import { renderToString } from "react-dom/server";
import React from "react";

// MOCKLAR
const useDictionaryMock = mock.fn(() => ({
  maps: { clickToMark: "Click" }
}));

mock.module("../../lib/language/DictionaryContext.tsx", { namedExports: { useDictionary: useDictionaryMock } });

mock.module("@react-google-maps/api", {
  namedExports: {
    GoogleMap: ({ children }: any) => <div data-testid="GoogleMap">{children}</div>,
    MarkerF: () => <div data-testid="MarkerF" />
  }
});

describe("MapPicker Component", () => {
  let MapPicker: any;

  before(async () => {
    const mod = await import("./MapPicker");
    MapPicker = mod.MapPicker || mod.default;
  });

  beforeEach(() => {
    useDictionaryMock.mock.resetCalls();
  });

  describe("MapPicker() bileşeni", () => {
    it("should_InitializeWithoutErrors_WhenRendered", async () => {
      let error = null;
      let html = "";
      try {
        html = renderToString(<MapPicker />);
      } catch (e) {
        error = e;
      }
      
      expect(error).toBeNull();
      expect(html).toContain("data-testid=\"GoogleMap\"");
    });
  });
});
