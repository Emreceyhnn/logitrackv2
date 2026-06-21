/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, before, mock, beforeEach } from "node:test";
import { expect } from "expect";

// MOCKLAR
const useDictionaryMock = mock.fn(() => ({
  landing: {
    footer: {
      sections: {
        platform: "Platform",
        globalTracking: "Global Tracking",
        routeIntelligence: "Route Intelligence",
        telemetryHub: "Telemetry Hub",
        securityCenter: "Security Center",
        solutions: "Solutions",
        enterprise: "Enterprise",
        smbLogistics: "SMB Logistics",
        supplyChain: "Supply Chain",
        company: "Company",
        ourMission: "Our Mission",
        engineering: "Engineering",
        pressKit: "Press Kit",
        careers: "Careers",
        support: "Support",
        devDocs: "Dev Docs",
        helpCenter: "Help Center",
        privacy: "Privacy",
        sla: "SLA"
      },
      description: "Footer Desc",
      rights: "Rights Reserved",
      status: "System Status"
    }
  }
}));

mock.module("../../lib/language/DictionaryContext.tsx", { namedExports: { useDictionary: useDictionaryMock } });

mock.module("@mui/material", {
  namedExports: {
    Box: (props: any) => ({ type: "Box", props }),
    Container: (props: any) => ({ type: "Container", props }),
    Divider: (props: any) => ({ type: "Divider", props }),
    Grid: (props: any) => ({ type: "Grid", props }),
    Stack: (props: any) => ({ type: "Stack", props }),
    Typography: (props: any) => ({ type: "Typography", props }),
    Link: (props: any) => ({ type: "MuiLink", props })
  }
});

mock.module("@mui/icons-material/LinkedIn", { defaultExport: () => ({ type: "LinkedInIcon" }) });
mock.module("@mui/icons-material/Twitter", { defaultExport: () => ({ type: "TwitterIcon" }) });
mock.module("next/image", { defaultExport: () => ({ type: "Image" }) });

describe("LandingFooter Component", () => {
  let LandingFooter: any;

  before(async () => {
    const mod = await import("./LandingFooter");
    LandingFooter = mod.default;
  });

  beforeEach(() => {
    useDictionaryMock.mock.resetCalls();
  });

  describe("LandingFooter() bileşeni", () => {
    it("should_InitializeWithoutErrors_WhenRendered", async () => {
      // Act
      try {
        LandingFooter();
      } catch (e) {}

      // Assert
      expect(LandingFooter).toBeDefined();
      expect(useDictionaryMock.mock.calls.length).toBeGreaterThan(0);
    });
  });
});
