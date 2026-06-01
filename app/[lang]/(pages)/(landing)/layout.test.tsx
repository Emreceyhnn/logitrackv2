/* eslint-disable @typescript-eslint/no-explicit-any */
import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";

// Mock Child Component
mock.module("../../../components/landing/LandingNavbar", {
  defaultExport: () => <div data-testid="landing-navbar">Landing Navbar</div>,
});

describe("LandingLayout Component", () => {
  let LandingLayout: any;

  before(async () => {
    const mod = await import("./layout");
    LandingLayout = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  describe("LandingLayout() Render Testleri", () => {
    it("should_RenderNavbarAndChildren_Correctly", async () => {
      // Act
      render(
        <LandingLayout>
          <div data-testid="child-content">Landing Content</div>
        </LandingLayout>
      );

      // Assert
      expect(screen.getByTestId("landing-navbar")).toBeTruthy();
      expect(screen.getByTestId("child-content")).toBeTruthy();
    });
  });
});
