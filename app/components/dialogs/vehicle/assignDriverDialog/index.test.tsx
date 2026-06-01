import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";

const useDictionaryMock = mock.fn(() => ({
  common: {
    cancel: "Cancel",
    na: "N/A",
  },
  vehicles: {
    fields: {
      plate: "Plate",
    },
    dialogs: {
      manageDriver: "Manage Driver",
      failedToLoadDrivers: "Failed to load",
      failedToAssign: "Failed to assign",
      failedToUnassign: "Failed to unassign",
      currentAssignment: "Current Assignment",
      rating: "Rating",
      unassign: "Unassign",
      noDriverAssigned: "No Driver",
      assignNewDriver: "Assign New",
      selectDriver: "Select",
      noDriversFound: "No Drivers Found",
      assigning: "Assigning",
      assignDriver: "Assign Driver",
    },
  },
}));

const assignDriverMock = mock.fn();
const unassignDriverMock = mock.fn();
const getAvailableDriversMock = mock.fn(async () => []);

mock.module("@/app/lib/language/DictionaryContext", {
  namedExports: { useDictionary: useDictionaryMock },
});

mock.module("@/app/lib/controllers/vehicle", {
  namedExports: {
    assignDriverToVehicle: assignDriverMock,
    unassignDriverFromVehicle: unassignDriverMock,
    getAvailableDrivers: getAvailableDriversMock,
  },
});

import * as originalMui from "@mui/material";
const useThemeMock = mock.fn(() => ({
  ...originalMui.useTheme(),
  palette: {
    ...originalMui.useTheme().palette,
    divider_alpha: { main_10: "rgba(0,0,0,0.1)", main_05: "rgba(0,0,0,0.05)" },
    primary: { ...originalMui.useTheme().palette.primary, _alpha: { main_20: "rgba()", main_30: "rgba()", main_10: "rgba()" } },
    error: { ...originalMui.useTheme().palette.error, _alpha: { main_10: "rgba()", main_20: "rgba()", main_30: "rgba()", main_05: "rgba()" } },
    success: { ...originalMui.useTheme().palette.success, _alpha: { main_10: "rgba()" } },
  },
}));

mock.module("@mui/material", {
  namedExports: {
    ...originalMui,
    useTheme: useThemeMock,
  },
});

describe("AssignDriverDialog RTL Component", () => {
  let AssignDriverDialog: React.ElementType;

  before(async () => {
    const mod = await import("./index");
    AssignDriverDialog = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  describe("AssignDriverDialog() bileşeni", () => {
    it("should_RenderDialogElements_WhenOpen", async () => {
      // Act
      render(
        <AssignDriverDialog
          open={true}
          onClose={() => {}}
          vehicleId="v1"
          vehiclePlate="34 ABC 123"
          currentDriver={null}
          onSuccess={() => {}}
        />
      );

      // Assert
      expect(screen.getByText("Manage Driver")).toBeTruthy();
      expect(screen.getByText("Current Assignment")).toBeTruthy();
      expect(screen.getByText("Assign New")).toBeTruthy();
    });
  });
});
