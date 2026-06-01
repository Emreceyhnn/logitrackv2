/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, before, mock, beforeEach } from "node:test";
import { expect } from "expect";
import { renderToString } from "react-dom/server";
import React from "react";
global.React = React;

// MOCKLAR
const useDictionaryMock = mock.fn(() => ({
  maps: {
    demo: {
      title: "Title", subtitle: "Sub", addressTitle: "Addr", addressDesc: "Desc",
      lat: "Lat", lng: "Lng", address: "Address", selected: "Selected",
      pickerTitle: "Picker", pickerDesc: "Desc", picked: "Picked",
      routeTitle: "Route", routeDesc: "Desc"
    }
  }
}));

mock.module("../../lib/language/DictionaryContext.tsx", { namedExports: { useDictionary: useDictionaryMock } });

mock.module("./GoogleMapsProvider.tsx", { namedExports: { GoogleMapsProvider: ({ children }: any) => <div data-testid="GoogleMapsProvider">{children}</div> } });
mock.module("./AddressAutocomplete.tsx", { namedExports: { AddressAutocomplete: () => <div data-testid="AddressAutocomplete" /> } });
mock.module("./MapWithMarker.tsx", { namedExports: { MapWithMarker: () => <div data-testid="MapWithMarker" /> } });
mock.module("./DirectionsMap", { namedExports: { DirectionsMap: () => <div data-testid="DirectionsMap" /> } });
mock.module("./MapPicker", { namedExports: { MapPicker: () => <div data-testid="MapPicker" /> } });

describe("maps Component", () => {
  let GoogleMapDemo: any;

  before(async () => {
    const mod = await import("./maps");
    GoogleMapDemo = mod.default;
  });

  beforeEach(() => {
    useDictionaryMock.mock.resetCalls();
  });

  describe("GoogleMapDemo() bileşeni", () => {
    it("should_InitializeWithoutErrors_WhenRendered", async () => {
      let error = null;
      let html = "";
      try {
        html = renderToString(<GoogleMapDemo />);
      } catch (e) {
        error = e;
      }
      
      expect(error).toBeNull();
      expect(html).toContain("data-testid=\"GoogleMapsProvider\"");
    });
  });
});
