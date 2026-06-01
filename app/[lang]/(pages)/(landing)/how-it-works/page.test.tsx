/* eslint-disable @typescript-eslint/no-explicit-any */
import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";

// 1. Mock Contexts
const useDictionaryMock = mock.fn(() => ({
  landing: {
    howItWorksPage: {
      hero: { overline: "Overline", title: "How It Works", subtitle: "Subtitle" },
      cta: { title: "CTA Title", subtitle: "CTA Subtitle", getStarted: "Get Started", bookDemo: "Book Demo" },
      footer: { rights: "© {year}", privacy: "Privacy", terms: "Terms", help: "Help" }
    }
  }
}));

mock.module("../../../../lib/language/DictionaryContext", {
  namedExports: { useDictionary: useDictionaryMock },
});

// Mock Child Component
mock.module("../../../../components/how-it-works/TimelineSection", {
  defaultExport: () => <div data-testid="timeline-section">Timeline Section</div>,
});

describe("HowItWorksPage Component", () => {
  let HowItWorksPage: any;

  before(async () => {
    const mod = await import("./page");
    HowItWorksPage = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  describe("HowItWorksPage() Render Testleri", () => {
    it("should_RenderHowItWorksContent_Correctly", async () => {
      // Act
      render(<HowItWorksPage />);

      // Assert
      expect(screen.getByText("How It Works")).toBeTruthy();
      expect(screen.getByTestId("timeline-section")).toBeTruthy();
      expect(screen.getByText("CTA Title")).toBeTruthy();
    });
  });
});
