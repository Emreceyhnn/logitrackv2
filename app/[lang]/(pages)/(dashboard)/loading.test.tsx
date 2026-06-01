import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, cleanup } from "@testing-library/react";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Mock Theme
const customTheme = createTheme({
  palette: {
    mode: "light",
  }
});
import * as originalMui from "@mui/material";
const useThemeMock = mock.fn(() => customTheme);
mock.module("@mui/material", {
  namedExports: {
    ...originalMui,
    useTheme: useThemeMock,
  },
});

describe("DashboardLoading Component", () => {
  let DashboardLoading: React.ElementType;

  before(async () => {
    const mod = await import("./loading");
    DashboardLoading = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  describe("DashboardLoading() Render Testleri", () => {
    it("should_RenderSkeletons_Correctly", async () => {
      // Act
      const { container } = render(
        <ThemeProvider theme={customTheme}>
          <DashboardLoading />
        </ThemeProvider>
      );

      // Assert that there are multiple skeletons rendered
      const skeletons = container.querySelectorAll(".MuiSkeleton-root");
      expect(skeletons.length).toBeGreaterThan(10);
    });
  });
});
