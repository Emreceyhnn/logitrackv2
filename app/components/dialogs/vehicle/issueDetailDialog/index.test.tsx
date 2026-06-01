import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";

const useDictionaryMock = mock.fn(() => ({
  common: {
    cancel: "Cancel",
  },
  vehicles: {
    dialogs: {
      failedToUpdateIssue: "Failed to update",
      issueDetails: "Issue Details",
      referenceId: "Ref ID",
      incidentTitle: "Incident Title",
      problemDesc: "Problem Desc",
      noSupplementalDetails: "No details",
      reportedOn: "Reported On",
      configurationStatus: "Configuration Status",
      savingChanges: "Saving",
      updateIssue: "Update Issue",
    },
    fields: {
      status: "Status",
      priority: "Priority",
    },
    statuses: {
      OPEN: "Open",
      IN_PROGRESS: "In Progress",
      RESOLVED: "Resolved",
      CLOSED: "Closed",
    },
    priorities: {
      LOW: "Low",
      MEDIUM: "Medium",
      HIGH: "High",
      CRITICAL: "Critical",
    },
  },
}));

const updateIssueMock = mock.fn(async () => ({}));
const useDateSettingsMock = mock.fn(() => ({ format: "DD/MM/YYYY" }));

mock.module("@/app/lib/language/DictionaryContext", {
  namedExports: { useDictionary: useDictionaryMock },
});

mock.module("@/app/lib/controllers/vehicle", {
  namedExports: { updateIssue: updateIssueMock },
});

mock.module("@/app/hooks/useDateSettings", {
  namedExports: { useDateSettings: useDateSettingsMock },
});

mock.module("@/app/lib/utils/date", {
  namedExports: { formatDisplayDate: mock.fn(() => "01/01/2026") },
});

mock.module("@/app/lib/priorityColor", {
  namedExports: { getPriorityColor: mock.fn(() => "error") },
});

import * as originalMui from "@mui/material";
const useThemeMock = mock.fn(() => ({
  ...originalMui.useTheme(),
  palette: {
    ...originalMui.useTheme().palette,
    mode: "light",
    divider_alpha: { main_05: "rgba()" },
    primary: { ...originalMui.useTheme().palette.primary, _alpha: { main_10: "rgba()", main_20: "rgba()" } },
    error: { ...originalMui.useTheme().palette.error, _alpha: { main_10: "rgba()", main_50: "rgba()", main_20: "rgba()" } },
    warning: { ...originalMui.useTheme().palette.warning, _alpha: { main_10: "rgba()" } },
  },
}));

mock.module("@mui/material", {
  namedExports: {
    ...originalMui,
    useTheme: useThemeMock,
  },
});

describe("IssueDetailDialog RTL Component", () => {
  let IssueDetailDialog: any;

  before(async () => {
    const mod = await import("./index");
    IssueDetailDialog = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  describe("IssueDetailDialog() bileşeni", () => {
    it("should_RenderDialogElements_WhenOpen", async () => {
      // Act
      render(
        <IssueDetailDialog
          open={true}
          onClose={() => {}}
          issue={{ id: "issue-1", status: "OPEN", priority: "HIGH", title: "Test Title", createdAt: new Date() }}
          onUpdate={() => {}}
        />
      );

      // Assert
      expect(screen.getByText("Issue Details")).toBeTruthy();
      expect(screen.getAllByText("Status").length).toBeGreaterThan(0);
      expect(screen.getByText("Test Title")).toBeTruthy();
    });
  });
});
