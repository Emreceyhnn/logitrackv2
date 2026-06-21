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
    pressKitPage: {
      hero: { title: "Press Kit", subtitle: "Subtitle" },
      sections: [{ title: "Section 1", content: "Content 1" }]
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

describe("PressKitPage Component", () => {
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
    expect(screen.getByText("Press Kit")).toBeTruthy();
    expect(screen.getByText("Section 1")).toBeTruthy();
  });
});
