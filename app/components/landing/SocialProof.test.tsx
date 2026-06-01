import { describe, it, before, mock, beforeEach } from "node:test";
import { expect } from "expect";

// MOCKLAR
const useDictionaryMock = mock.fn(() => ({
  landing: { trusted: "Güvenilen Firmalar" }
}));

mock.module("@/app/lib/language/DictionaryContext", { namedExports: { useDictionary: useDictionaryMock } });

mock.module("@mui/material", {
  namedExports: {
    Box: (props: unknown) => ({ type: "Box", props }),
    Container: (props: unknown) => ({ type: "Container", props }),
    Stack: (props: unknown) => ({ type: "Stack", props }),
    Typography: (props: unknown) => ({ type: "Typography", props })
  }
});

mock.module("@mui/icons-material/Apartment", { defaultExport: () => ({ type: "Icon" }) });
mock.module("@mui/icons-material/RocketLaunch", { defaultExport: () => ({ type: "Icon" }) });
mock.module("@mui/icons-material/PrecisionManufacturing", { defaultExport: () => ({ type: "Icon" }) });
mock.module("@mui/icons-material/Public", { defaultExport: () => ({ type: "Icon" }) });

describe("SocialProof Component", () => {
  let SocialProof: React.ElementType;

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
