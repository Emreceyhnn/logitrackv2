/* eslint-disable @typescript-eslint/no-explicit-any */
import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// 1. Mock Contexts & Utils
const useDictionaryMock = mock.fn(() => ({
  profile: {
    tabs: {
      account: "Account",
      security: "Security",
    },
    messages: {
      loadError: "Load Error",
      saveSuccess: "Saved",
      networkError: "Network Error",
      passwordSuccess: "Password Updated",
      verificationError: "Verification Error",
    },
    status: {
      synchronizing: "Loading...",
    }
  }
}));

mock.module("../../../lib/language/DictionaryContext.tsx", {
  namedExports: { useDictionary: useDictionaryMock },
});

const toastMock = {
  success: mock.fn(),
  error: mock.fn(),
};

mock.module("sonner", {
  namedExports: { toast: toastMock },
});

const getMyProfileMock = mock.fn(async () => ({
  name: "John",
  surname: "Doe",
  email: "john@example.com",
  avatarUrl: null,
  lastLoginAt: new Date(),
  createdAt: new Date(),
}));

mock.module("../../../lib/actions/profile.ts", {
  namedExports: { 
    getMyProfile: getMyProfileMock,
    updateMyProfile: mock.fn(async () => ({})),
    changeMyPassword: mock.fn(async () => ({}))
  },
});

mock.module("framer-motion", {
  namedExports: {
    motion: {
      div: ({ children, onClick }: any) => <div data-testid="motion-div" onClick={onClick}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  },
});

// Mock Subcomponents
mock.module("./components/ProfileHeader.tsx", {
  defaultExport: () => <div data-testid="profile-header">ProfileHeader</div>,
});
mock.module("./components/ProfileTab.tsx", {
  defaultExport: () => <div data-testid="profile-tab">ProfileTab</div>,
});
mock.module("./components/SecurityTab.tsx", {
  defaultExport: () => <div data-testid="security-tab">SecurityTab</div>,
});

// 2. Mock Theme
const customTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2", dark: "#115293" } as any,
  }
});
(customTheme.palette.primary as any)._alpha = { main_50: "rgba()" };
(customTheme.palette as any).divider_alpha = { main_08: "rgba()" };

import * as originalMui from "@mui/material";
const useThemeMock = mock.fn(() => customTheme);
mock.module("@mui/material", {
  namedExports: {
    ...originalMui,
    useTheme: useThemeMock,
  },
});

describe("ProfileDialog RTL Component", () => {
  let ProfileDialog: any;

  before(async () => {
    const mod = await import("./ProfileDialog");
    ProfileDialog = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  describe("ProfileDialog() bileşeni", () => {
    it("should_RenderProfileTabs_AndSwitchBetweenThem", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <ProfileDialog open={true} onClose={() => {}} />
        </ThemeProvider>
      );

      // Wait for loading to finish
      await waitFor(() => {
        expect(screen.getByTestId("profile-tab")).toBeTruthy();
      });

      // Switch to Security Tab
      const securityTab = screen.getByText(/Security/i);
      fireEvent.click(securityTab);

      // Assert Security Tab is mounted
      expect(screen.getByTestId("security-tab")).toBeTruthy();
    });
  });
});
