 
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
const useDictionaryMock = mock.fn(() => ({
  common: {
    cancel: "Cancel",
    fillAllFields: "Fill all fields",
    docType: "Document Type",
    uploading: "Uploading",
  },
  vehicles: {
    dialogs: {
      uploadDocumentTitle: "Upload Document",
      uploadDocumentDesc: "Desc",
      failedToUploadDocument: "Failed",
      configuration: "Config",
      docName: "Document Name",
      docNamePlaceholder: "Name",
      expiryDate: "Expiry Date",
      fileAttachment: "Attachment",
      selectOrDragFile: "Select File",
      fileFormats: "Formats",
      preview: "Preview",
      startUpload: "Upload",
    },
    docTypes: {
      REGISTRATION: "Registration",
      INSURANCE: "Insurance",
      LICENSE: "License",
      INSPECTION: "Inspection",
      MAINTENANCE: "Maintenance",
      OTHER: "Other",
    },
  },
  toasts: {
    loading: "Loading",
  },
}));

const uploadVehicleDocumentMock = mock.fn(async () => ({}));
const uploadImageActionMock = mock.fn(async () => ({ url: "https://example.com/doc.pdf" }));

mock.module("../../../../lib/language/DictionaryContext.tsx", {
  namedExports: { useDictionary: useDictionaryMock },
});

mock.module("../../../../lib/controllers/vehicle.ts", {
  namedExports: { uploadVehicleDocument: uploadVehicleDocumentMock },
});

mock.module("../../../../lib/actions/upload.ts", {
  namedExports: { uploadImageAction: uploadImageActionMock },
});

mock.module("@mui/x-date-pickers/DatePicker", {
  namedExports: { DatePicker: () => <div data-testid="date-picker-mock" /> },
});

import * as originalMui from "@mui/material";
const useThemeMock = mock.fn(() => ({
  ...originalMui.useTheme(),
  palette: {
    ...originalMui.useTheme().palette,
    mode: "light",
    divider_alpha: { main_05: "rgba()" },
    primary: { ...originalMui.useTheme().palette.primary, _alpha: { main_10: "rgba()", main_30: "rgba()", main_40: "rgba()", main_02: "rgba()", main_05: "rgba()", main_20: "rgba()" } },
    error: { ...originalMui.useTheme().palette.error, _alpha: { main_10: "rgba()", main_05: "rgba()", main_20: "rgba()" } },
  },
}));

mock.module("@mui/material", {
  namedExports: {
    ...originalMui,
    useTheme: useThemeMock,
  },
});

const customTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" } as any,
  }
});
// Mutate theme object to inject custom alpha properties that MUI type definitions might reject
(customTheme.palette.primary as any)._alpha = { main_30: "rgba()", main_40: "rgba()", main_02: "rgba()", main_05: "rgba()", main_10: "rgba()", main_20: "rgba()" };
(customTheme.palette.error as any)._alpha = { main_10: "rgba()", main_05: "rgba()", main_20: "rgba()" };

describe("UploadDocumentDialog RTL Component", () => {
  let UploadDocumentDialog: any;

  before(async () => {
    const mod = await import("./index");
    UploadDocumentDialog = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  describe("UploadDocumentDialog() bileşeni", () => {
    it("should_RenderDialogElements_WhenOpen", async () => {
      // Act
      render(
        <ThemeProvider theme={customTheme}>
          <UploadDocumentDialog
            open={true}
            onClose={() => {}}
            vehicleId="v1"
            onSuccess={() => {}}
          />
        </ThemeProvider>
      );

      // Assert
      expect(screen.getByText("Upload Document")).toBeTruthy();
      expect(screen.getAllByText("Document Name").length).toBeGreaterThan(0);
      expect(screen.getByText("Upload")).toBeTruthy();
    });
  });
});
