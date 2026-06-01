/* eslint-disable @typescript-eslint/no-explicit-any */
import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// 1. Mocks
const mockDict = {
  company: {
    info: {
      created: "Created on {date}",
      active: "Active",
    },
  },
};

mock.module("@/app/lib/language/DictionaryContext", {
  namedExports: { useDictionary: () => mockDict },
});

mock.module("@/app/hooks/useDateSettings", {
  namedExports: { useDateSettings: () => ({ format: "DD/MM/YYYY" }) },
});

mock.module("@/app/lib/utils/date", {
  namedExports: { formatDisplayDate: (d: any) => `formatted-${d}` },
});

const customTheme = createTheme({ palette: { mode: "light" } });

import * as originalMui from "@mui/material";
mock.module("@mui/material", {
  namedExports: {
    ...originalMui,
    useTheme: mock.fn(() => customTheme),
  },
});

describe("CompanyInfoCard RTL Component", () => {
  let CompanyInfoCard: any;

  before(async () => {
    const mod = await import("./companyInfoCard");
    CompanyInfoCard = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  describe("CompanyInfoCard() bileşeni", () => {
    it("should_RenderSkeletons_WhenProfileIsNull", async () => {
      const mockProps = {
        state: { data: { profile: null } },
      };

      render(
        <ThemeProvider theme={customTheme}>
          <CompanyInfoCard props={mockProps as any} />
        </ThemeProvider>
      );

      // It shouldn't render the Active chip
      expect(screen.queryByText("Active")).toBeNull();
    });

    it("should_RenderProfileData_WhenProfileExists", async () => {
      const mockProps = {
        state: {
          data: {
            profile: {
              name: "Acme Logistics",
              createdAt: "2023-01-01",
              avatarUrl: null,
            },
          },
        },
      };

      render(
        <ThemeProvider theme={customTheme}>
          <CompanyInfoCard props={mockProps as any} />
        </ThemeProvider>
      );

      expect(screen.getByText("Acme Logistics")).toBeTruthy();
      expect(screen.getByText("Created on formatted-2023-01-01")).toBeTruthy();
      expect(screen.getByText("Active")).toBeTruthy();
    });
  });
});
