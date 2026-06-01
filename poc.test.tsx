/* eslint-disable @typescript-eslint/no-explicit-any */
import "global-jsdom/register"; // This is required to initialize JSDOM
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup } from "@testing-library/react";
import * as React from "react";

// Mocking dependencies exactly as before
const useDictionaryMock = mock.fn(() => ({
  common: { cancel: "Cancel", back: "Back", next: "Next", save: "Save" },
  vehicles: { dialogs: { addTitle: "Add Vehicle Title", steps: { general: "Gen", specs: "Spec" } } },
  toasts: { loading: "Load" },
  validation: { genericFormError: "Err" }
}));

mock.module("@/app/lib/language/DictionaryContext", {
  namedExports: { useDictionary: useDictionaryMock }
});

mock.module("@/app/lib/controllers/vehicle", {
  namedExports: { createVehicle: mock.fn() }
});

mock.module("@/app/lib/actions/upload", {
  namedExports: { uploadImageAction: mock.fn() }
});

mock.module("sonner", {
  namedExports: { toast: { promise: mock.fn(), error: mock.fn() } }
});

mock.module("@/app/lib/validationSchema", {
  namedExports: { addVehicleValidationSchema: mock.fn(() => ({})) }
});

// Mocking the child steps so we don't need to render their full complex logic
mock.module("./app/components/dialogs/vehicle/addVehicleDialog/firstStep", { defaultExport: () => <div data-testid="first-step" /> });
mock.module("./app/components/dialogs/vehicle/addVehicleDialog/techSpecsStep", { defaultExport: () => <div data-testid="tech-specs-step" /> });

describe("AddVehicleDialog RTL Test", () => {
  let AddVehicleDialog: any;

  before(async () => {
    const mod = await import("./app/components/dialogs/vehicle/addVehicleDialog/index");
    AddVehicleDialog = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  it("should render Add Vehicle dialog and FirstStep by default", () => {
    render(
      <AddVehicleDialog 
        open={true} 
        onClose={() => {}} 
        onSuccess={() => {}} 
      />
    );

    // Assert that the title exists
    expect(screen.getByText("Add Vehicle Title")).toBeTruthy();
    
    // Assert that the first step component is rendered
    expect(screen.getByTestId("first-step")).toBeTruthy();
  });
});
