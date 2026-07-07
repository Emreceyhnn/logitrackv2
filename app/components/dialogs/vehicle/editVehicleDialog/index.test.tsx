 
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";

const useDictionaryMock = mock.fn(() => ({
  common: {
    cancel: "Cancel",
    back: "Back",
    next: "Next",
    save: "Save",
  },
  toasts: {
    loading: "Loading...",
    successUpdate: "Successfully updated",
    errorGeneric: "Error occurred",
    saving: "Saving",
  },
  validation: {
    genericFormError: "Form error",
  },
  vehicles: {
    dialogs: {
      editTitle: "Edit Vehicle",
      steps: {
        general: "General",
        specs: "Specs",
      },
    },
  },
}));

const updateVehicleMock = mock.fn(async () => ({ id: "vehicle-1" }));

mock.module("../../../../lib/language/DictionaryContext.tsx", {
  namedExports: { useDictionary: useDictionaryMock },
});

mock.module("../../../../lib/controllers/vehicle.ts", {
  namedExports: {
    updateVehicle: updateVehicleMock,
  },
});

mock.module("../../../../lib/actions/upload.ts", {
  namedExports: { uploadImageAction: mock.fn() },
});

mock.module("sonner", {
  namedExports: {
    toast: {
      promise: mock.fn(),
      error: mock.fn(),
    },
  },
});

mock.module("../../../../lib/validationSchema.ts", {
  namedExports: { editVehicleValidationSchema: mock.fn(() => ({})) },
});

mock.module("../addVehicleDialog/firstStep.tsx", { defaultExport: () => <div data-testid="first-step" /> });
mock.module("../addVehicleDialog/techSpecsStep.tsx", { defaultExport: () => <div data-testid="tech-specs-step" /> });

import * as originalMui from "@mui/material";
const useThemeMock = mock.fn(() => ({
  ...originalMui.useTheme(),
  palette: {
    ...originalMui.useTheme().palette,
    divider_alpha: { main_10: "rgba(0,0,0,0.1)", main_05: "rgba(0,0,0,0.05)" },
    primary: { ...originalMui.useTheme().palette.primary, _alpha: { main_20: "rgba()", main_90: "rgba()" } },
    error: { ...originalMui.useTheme().palette.error, _alpha: { main_10: "rgba()", main_20: "rgba()" } },
    success: { ...originalMui.useTheme().palette.success, _alpha: { main_10: "rgba()" } },
  },
}));

mock.module("@mui/material", {
  namedExports: {
    ...originalMui,
    useTheme: useThemeMock,
  },
});

describe("EditVehicleDialog RTL Component", () => {
  let EditVehicleDialog: any;

  before(async () => {
    const mod = await import("./index");
    EditVehicleDialog = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  describe("EditVehicleDialog() bileşeni", () => {
    it("should_RenderDialogElements_WhenOpen", async () => {
      // Act
      render(
        <EditVehicleDialog
          open={true}
          onClose={() => {}}
          onSuccess={() => {}}
          vehicle={{ id: "v1", plate: "34 ABC" }}
        />
      );

      expect(screen.getByText(/Edit Vehicle/i)).toBeTruthy();
      expect(screen.getByTestId("first-step")).toBeTruthy();
    });
  });
});
