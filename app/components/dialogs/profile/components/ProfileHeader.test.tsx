/* eslint-disable @typescript-eslint/no-explicit-any */
import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// 1. Mock Contexts & Utils
const useDictionaryMock = mock.fn(() => ({
  profile: {
    title: "My Profile",
    subtitle: "Manage your account",
  }
}));

mock.module("@/app/lib/language/DictionaryContext", {
  namedExports: { useDictionary: useDictionaryMock },
});

// 2. Mock Theme
const customTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2", dark: "#115293" } as any,
    error: { main: "#d32f2f" } as any,
  }
});
(customTheme.palette.primary as any)._alpha = { main_12: "rgba()", main_20: "rgba()" };
(customTheme.palette.error as any)._alpha = { main_10: "rgba()" };
(customTheme.palette.common as any) = { white_alpha: { main_30: "rgba()", main_45: "rgba()" } };

import * as originalMui from "@mui/material";
const useThemeMock = mock.fn(() => customTheme);
mock.module("@mui/material", {
  namedExports: {
    ...originalMui,
    useTheme: useThemeMock,
  },
});

describe("ProfileHeader RTL Component", () => {
  let ProfileHeader: any;

  before(async () => {
    const mod = await import("./ProfileHeader");
    ProfileHeader = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  describe("ProfileHeader() bileşeni", () => {
    it("should_RenderHeader_WithTitleAndSubtitle", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <ProfileHeader onClose={() => {}} />
        </ThemeProvider>
      );

      // Assert
      expect(screen.getByText(/My Profile/i)).toBeTruthy();
      expect(screen.getByText(/Manage your account/i)).toBeTruthy();
    });

    it("should_CallOnClose_WhenCloseButtonIsClicked", async () => {
      const mockOnClose = mock.fn();
      
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <ProfileHeader onClose={mockOnClose} />
        </ThemeProvider>
      );

      // The CloseIcon is rendered inside an IconButton.
      const closeButton = screen.getByRole("button");
      fireEvent.click(closeButton);

      // Assert
      expect(mockOnClose.mock.calls.length).toBe(1);
    });
  });
});
