 
import { describe, it, before, mock, beforeEach } from "node:test";
import { expect } from "expect";
import { renderToString } from "react-dom/server";
import React from "react";
global.React = React;

// MOCKLAR
const useDictionaryMock = mock.fn(() => ({
  common: { fromLastMonth: "FROM LAST MONTH" }
}));

mock.module("../../lib/language/DictionaryContext.tsx", { namedExports: { useDictionary: useDictionaryMock } });

mock.module("framer-motion", {
  namedExports: {
    motion: { div: ({ children }: any) => <div data-testid="MotionDiv">{children}</div> },
    AnimatePresence: ({ children }: any) => <div data-testid="AnimatePresence">{children}</div>
  }
});

mock.module("@mui/material", {
  namedExports: {
    Box: ({ children }: any) => <div data-testid="Box">{children}</div>,
    Card: ({ children }: any) => <div data-testid="Card">{children}</div>,
    Stack: ({ children }: any) => <div data-testid="Stack">{children}</div>,
    Typography: ({ children }: any) => <div data-testid="Typography">{children}</div>,
    useTheme: mock.fn(() => ({
      palette: {
        getColorAlpha: () => ({ main_20: "", main_05: "", main_30: "", main_50: "", main_10: "", main_40: "", main_60: "", main_15: "", main_12: "" }),
        success: { main: "" },
        error: { main: "" },
        background: { paper_alpha: { main_90: "", main_70: "" } },
        common: { black_alpha: { main_30: "" }, white_alpha: { main_10: "" } },
        text: { primary: "", primary_alpha: { main_40: "", main_35: "" } }
      }
    }))
  }
});

describe("StatCard Component", () => {
  let StatCard: any;

  before(async () => {
    const mod = await import("./StatCard");
    StatCard = mod.default;
  });

  beforeEach(() => {
    useDictionaryMock.mock.resetCalls();
  });

  describe("StatCard() bileşeni", () => {
    it("should_InitializeWithoutErrors_WhenRendered", async () => {
      let error = null;
      let html = "";
      try {
        html = renderToString(<StatCard title="Total" value="1,000" trend={{ value: 5, isUp: true }} />);
      } catch (e) {
        error = e;
      }
      
      expect(error).toBeNull();
      expect(html).toContain("Total");
      expect(html).toContain("1,000");
      expect(html).toContain("FROM LAST MONTH");
    });
  });
});
