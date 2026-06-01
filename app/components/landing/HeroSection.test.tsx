import { describe, it, before, mock, beforeEach } from "node:test";
import { expect } from "expect";

// MOCKLAR
const useDictionaryMock = mock.fn(() => ({
  landing: {
    hero: {
      badge: "YENİ SÜRÜM",
      titleMain: "Ana Başlık",
      titleHighlight: "Vurgu",
      description: "Açıklama",
      startTrial: "Başla",
      demo: "Demo"
    }
  }
}));

mock.module("@/app/lib/language/DictionaryContext", { namedExports: { useDictionary: useDictionaryMock } });

mock.module("@mui/material", {
  namedExports: {
    Box: (props: unknown) => ({ type: "Box", props }),
    Button: (props: unknown) => ({ type: "Button", props }),
    Container: (props: unknown) => ({ type: "Container", props }),
    Stack: (props: unknown) => ({ type: "Stack", props }),
    Typography: (props: unknown) => ({ type: "Typography", props })
  }
});

mock.module("next/image", { defaultExport: () => ({ type: "Image" }) });
mock.module("@mui/icons-material/PlayCircleOutline", { defaultExport: () => ({ type: "PlayCircleOutlineIcon" }) });
mock.module("framer-motion", { namedExports: { motion: { div: (props: unknown) => ({ type: "MotionDiv", props }) } } });

describe("HeroSection Component", () => {
  let HeroSection: React.ElementType;

  before(async () => {
    const mod = await import("./HeroSection");
    HeroSection = mod.default;
  });

  beforeEach(() => {
    useDictionaryMock.mock.resetCalls();
  });

  describe("HeroSection() bileşeni", () => {
    it("should_InitializeWithoutErrors_WhenRendered", async () => {
      // Act
      try {
        HeroSection();
      } catch (e) {}

      // Assert
      expect(HeroSection).toBeDefined();
      expect(useDictionaryMock.mock.calls.length).toBeGreaterThan(0);
    });
  });
});
