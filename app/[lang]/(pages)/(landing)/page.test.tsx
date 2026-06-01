/* eslint-disable @typescript-eslint/no-explicit-any */
import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";

// Mock next/dynamic
mock.module("next/dynamic", {
  defaultExport: (dynamicImport: any) => {
    return () => {
      dynamicImport(); // Execute the import function to satisfy test coverage if needed
      return <div data-testid="dynamic-component">Dynamic Component</div>;
    };
  },
});

// Mock static component
mock.module("@/app/components/landing/HeroSection", {
  defaultExport: () => <div data-testid="hero-section">Hero Section</div>,
});

// Mock dynamic components (so their import() doesn't fail if they don't exist yet, or just let next/dynamic mock handle it. Next/dynamic mock calls the import, so we need to mock the files)
mock.module("@/app/components/landing/SocialProof", { defaultExport: () => null });
mock.module("@/app/components/landing/OperationsDashboard", { defaultExport: () => null });
mock.module("@/app/components/landing/FeaturesSection", { defaultExport: () => null });
mock.module("@/app/components/landing/LandingFooter", { defaultExport: () => null });

describe("LandingPage Component", () => {
  let LandingPage: any;

  before(async () => {
    const mod = await import("./page");
    LandingPage = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  describe("LandingPage() Render Testleri", () => {
    it("should_RenderHeroAndDynamicSections_Correctly", async () => {
      // Act
      render(<LandingPage />);

      // Assert
      expect(screen.getByTestId("hero-section")).toBeTruthy();
      
      // 4 dynamic components are rendered
      const dynamicComponents = screen.getAllByTestId("dynamic-component");
      expect(dynamicComponents.length).toBe(4);
    });
  });
});
