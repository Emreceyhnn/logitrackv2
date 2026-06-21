/* eslint-disable @typescript-eslint/no-explicit-any */
import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// 1. Mock Contexts
const useDictionaryMock = mock.fn(() => ({
  landing: {
    telemetryHubPage: {
      overline: "Overline",
      title: "Telemetry Hub",
      subtitle: "Subtitle",
      features: {
        title: "Features Title",
        description: "Features Desc",
        items: [{ title: "F1", description: "D1" }]
      },
      cta: { title: "CTA Title", subtitle: "CTA Subtitle", button: "Button" }
    }
  }
}));

mock.module("../../../../lib/language/DictionaryContext.tsx", {
  namedExports: { useDictionary: useDictionaryMock },
});

// Mock next/image
mock.module("next/image", {
  defaultExport: (props: any) => <img {...props} data-testid="next-image" />,
});

// 2. Mock Theme
const customTheme = createTheme();

describe("TelemetryHubPage Component", () => {
  let Page: any;

  before(async () => {
    const mod = await import("./page");
    Page = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  it("should render successfully", async () => {
    render(
      <ThemeProvider theme={customTheme}>
        <Page />
      </ThemeProvider>
    );
    expect(screen.getByText("Telemetry Hub")).toBeTruthy();
    expect(screen.getByText("Features Title")).toBeTruthy();
  });
});
