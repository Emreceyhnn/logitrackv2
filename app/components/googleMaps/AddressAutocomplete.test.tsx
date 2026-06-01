import { describe, it, before, mock, beforeEach } from "node:test";
import { expect } from "expect";
import { renderToString } from "react-dom/server";
import React from "react";

// MOCKLAR
const useDictionaryMock = mock.fn(() => ({
  maps: { searchAddress: "Search" }
}));

mock.module("@/app/lib/language/DictionaryContext", { namedExports: { useDictionary: useDictionaryMock } });

mock.module("@mui/material", {
  namedExports: {
    useTheme: mock.fn(() => ({
      palette: {
        primary: { main: "blue", _alpha: { main_30: "" } },
        text: { secondary: "gray", darkBlue: { _alpha: { main_50: "" } } },
        divider_alpha: { main_10: "" }
      }
    })),
    TextField: () => <div data-testid="TextField" />
  }
});

mock.module("@react-google-maps/api", {
  namedExports: { Autocomplete: ({ children }: { children?: React.ReactNode }) => <div data-testid="Autocomplete">{children}</div> }
});

describe("AddressAutocomplete Component", () => {
  let AddressAutocomplete: React.ElementType;

  before(async () => {
    const mod = await import("./AddressAutocomplete");
    AddressAutocomplete = mod.AddressAutocomplete || mod.default;
  });

  beforeEach(() => {
    useDictionaryMock.mock.resetCalls();
  });

  describe("AddressAutocomplete() bileşeni", () => {
    it("should_InitializeWithoutErrors_WhenRendered", async () => {
      let error = null;
      let html = "";
      try {
        html = renderToString(<AddressAutocomplete />);
      } catch (e) {
        error = e;
      }
      
      expect(error).toBeNull();
      expect(html).toContain("data-testid=\"Autocomplete\"");
    });
  });
});
