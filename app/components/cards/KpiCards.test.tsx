/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, before, mock } from "node:test";
import { expect } from "expect";
import { renderToString } from "react-dom/server";
import React from "react";
global.React = React;

// MOCKLAR
mock.module("framer-motion", {
  namedExports: {
    motion: { div: ({ children }: any) => <div data-testid="MotionDiv">{children}</div> }
  }
});

mock.module("../cards/StatCard.tsx", { defaultExport: () => <div data-testid="StatCard" /> });

mock.module("@mui/material", {
  namedExports: {
    Box: ({ children }: any) => <div data-testid="Box">{children}</div>,
    Card: ({ children }: any) => <div data-testid="Card">{children}</div>,
    Skeleton: () => <div data-testid="Skeleton" />,
    Stack: ({ children }: any) => <div data-testid="Stack">{children}</div>,
    useTheme: mock.fn(() => ({
      palette: {
        background: { paper_alpha: { main_80: "" } },
        divider: "",
        divider_alpha: { main_10: "" },
        common: { black_alpha: { main_20: "" } }
      }
    }))
  }
});

describe("KpiCards Component", () => {
  let KpiCards: any;

  before(async () => {
    const mod = await import("./KpiCards");
    KpiCards = mod.default;
  });

  const mockKpis = [{ label: "KPI 1", value: 100, icon: <span />, color: "red" }];

  describe("KpiCards() bileşeni", () => {
    it("should_RenderStatCards_WhenNotLoading", async () => {
      let error = null;
      let html = "";
      try {
        html = renderToString(<KpiCards kpis={mockKpis} loading={false} />);
      } catch (e) {
        error = e;
      }
      
      expect(error).toBeNull();
      expect(html).toContain("data-testid=\"StatCard\"");
    });

    it("should_RenderSkeletons_WhenLoading", async () => {
      let error = null;
      let html = "";
      try {
        html = renderToString(<KpiCards kpis={mockKpis} loading={true} />);
      } catch (e) {
        error = e;
      }
      
      expect(error).toBeNull();
      expect(html).toContain("data-testid=\"Skeleton\"");
    });
  });
});
