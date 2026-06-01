/* eslint-disable @typescript-eslint/no-explicit-any */
import "global-jsdom/register";
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
    successAdd: "Successfully added",
    errorGeneric: "Error occurred",
  },
  validation: {
    genericFormError: "Form error",
  },
  vehicles: {
    dialogs: {
      addTitle: "Add Vehicle",
      steps: {
        general: "General",
        specs: "Specs",
        docs: "Docs",
      },
    },
  },
}));

const createVehicleMock = mock.fn(async () => ({ id: "vehicle-1" }));
const uploadVehicleDocumentMock = mock.fn(async () => ({}));

mock.module("../../../../lib/language/DictionaryContext.tsx", {
  namedExports: { useDictionary: useDictionaryMock },
});

mock.module("../../../../lib/controllers/vehicle.ts", {
  namedExports: {
    createVehicle: createVehicleMock,
    uploadVehicleDocument: uploadVehicleDocumentMock,
  },
});

mock.module("../../../../lib/actions/upload.ts", {
  namedExports: { uploadImageAction: mock.fn() },
});

mock.module("../../../../lib/validationSchema.ts", {
  namedExports: { addVehicleValidationSchema: mock.fn(() => ({})) },
});

mock.module("sonner", {
  namedExports: {
    toast: {
      promise: mock.fn(),
      error: mock.fn(),
    },
  },
});

// Since Formik uses Context, testing full Formik flows without wrapping it in a valid component tree can be tricky.
// For the dialog test, we just want to test if it renders the base structure.
// However, since RTL evaluates everything, we provide mock children for the complex steps.
mock.module("./firstStep.tsx", { defaultExport: () => <div data-testid="first-step" /> });
mock.module("./techSpecsStep.tsx", { defaultExport: () => <div data-testid="tech-specs-step" /> });
mock.module("./documentsStep.tsx", { defaultExport: () => <div data-testid="documents-step" /> });

// Provide MUI Theme Mock so custom palette variables exist during real render
import * as originalMui from "@mui/material";
const useThemeMock = mock.fn(() => ({
  ...originalMui.useTheme(),
  palette: {
    ...originalMui.useTheme().palette,
    divider_alpha: { main_10: "rgba(0,0,0,0.1)", main_05: "rgba(0,0,0,0.05)", main_02: "rgba(0,0,0,0.02)" },
    primary: { ...originalMui.useTheme().palette.primary, _alpha: { main_20: "rgba(0,0,0,0.2)" } },
    success: { ...originalMui.useTheme().palette.success, _alpha: { main_10: "rgba(0,0,0,0.1)", main_20: "rgba()" } },
    error: { ...originalMui.useTheme().palette.error, _alpha: { main_10: "rgba(0,0,0,0.1)" } },
    warning: { ...originalMui.useTheme().palette.warning, _alpha: { main_10: "rgba(0,0,0,0.1)" } }
  },
}));

mock.module("@mui/material", {
  namedExports: {
    ...originalMui,
    useTheme: useThemeMock,
  },
});

describe("AddVehicleDialog RTL Component", () => {
  let AddVehicleDialog: any;

  before(async () => {
    const mod = await import("./index");
    AddVehicleDialog = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  describe("AddVehicleDialog() bileşeni", () => {
    it("should_RenderDialogElements_WhenOpen", async () => {
      // Act
      render(
        <AddVehicleDialog
          open={true}
          onClose={() => {}}
          onSuccess={() => {}}
        />
      );

      // Assert that the title exists
      expect(screen.getByText("Add Vehicle")).toBeTruthy();
      
      // First step should be active and rendered based on our mock
      expect(screen.getByTestId("first-step")).toBeTruthy();
    });
  });
});
