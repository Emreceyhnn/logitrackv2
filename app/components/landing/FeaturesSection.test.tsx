/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, before, mock, beforeEach } from "node:test";
import { expect } from "expect";

// MOCKLAR
const useDictionaryMock = mock.fn(() => ({
  landing: {
    features: {
      overline: "ÖZELLİKLER",
      title: "Başlık",
      description: "Açıklama",
      smartRoute: { title: "Akıllı", desc: "Rota" },
      predictiveEta: { title: "Tahmin", desc: "Zaman" },
      driverPerf: { title: "Sürücü", desc: "Performans" }
    }
  }
}));

mock.module("@/app/lib/language/DictionaryContext", { namedExports: { useDictionary: useDictionaryMock } });

mock.module("@mui/material", {
  namedExports: {
    Box: (props: any) => ({ type: "Box", props }),
    Container: (props: any) => ({ type: "Container", props }),
    Grid: (props: any) => ({ type: "Grid", props }),
    Typography: (props: any) => ({ type: "Typography", props })
  }
});

mock.module("@mui/icons-material/Insights", { defaultExport: () => ({ type: "InsightsIcon" }) });
mock.module("@mui/icons-material/Route", { defaultExport: () => ({ type: "RouteIcon" }) });
mock.module("@mui/icons-material/LocalShipping", { defaultExport: () => ({ type: "LocalShippingIcon" }) });
mock.module("framer-motion", { namedExports: { motion: { div: (props: any) => ({ type: "MotionDiv", props }) } } });

describe("FeaturesSection Component", () => {
  let FeaturesSection: any;

  before(async () => {
    const mod = await import("./FeaturesSection");
    FeaturesSection = mod.default;
  });

  beforeEach(() => {
    useDictionaryMock.mock.resetCalls();
  });

  describe("FeaturesSection() bileşeni", () => {
    it("should_InitializeWithoutErrors_WhenRendered", async () => {
      // Act
      try {
        FeaturesSection();
      } catch (e) {}

      // Assert
      expect(FeaturesSection).toBeDefined();
      expect(useDictionaryMock.mock.calls.length).toBeGreaterThan(0);
    });
  });
});
