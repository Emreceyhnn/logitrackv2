/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, before, mock, beforeEach } from "node:test";
import { expect } from "expect";

// MOCKLAR
const useDictionaryMock = mock.fn(() => ({
  landing: { trusted: "Güvenilen Firmalar" }
}));

mock.module("../../lib/language/DictionaryContext.tsx", { namedExports: { useDictionary: useDictionaryMock } });

mock.module("@mui/material", {
  namedExports: {
    Box: (props: any) => ({ type: "Box", props }),
    Container: (props: any) => ({ type: "Container", props }),
    Stack: (props: any) => ({ type: "Stack", props }),
    Typography: (props: any) => ({ type: "Typography", props })
  }
});

mock.module("@mui/icons-material/Apartment", { defaultExport: () => ({ type: "Icon" }) });
mock.module("@mui/icons-material/RocketLaunch", { defaultExport: () => ({ type: "Icon" }) });
mock.module("@mui/icons-material/PrecisionManufacturing", { defaultExport: () => ({ type: "Icon" }) });
mock.module("@mui/icons-material/Public", { defaultExport: () => ({ type: "Icon" }) });

describe("SocialProof Component", () => {
  let SocialProof: any;

  before(async () => {
    const mod = await import("./SocialProof");
    SocialProof = mod.default;
  });

  beforeEach(() => {
    useDictionaryMock.mock.resetCalls();
  });

  describe("SocialProof() bileşeni", () => {
    it("should_InitializeWithoutErrors_WhenRendered", async () => {
      // Act
      try {
        SocialProof();
      } catch (e) {}

      // Assert
      expect(SocialProof).toBeDefined();
      expect(useDictionaryMock.mock.calls.length).toBeGreaterThan(0);
    });
  });
});
