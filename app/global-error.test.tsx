/* eslint-disable @typescript-eslint/no-explicit-any */
import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";

// Mock NextError
mock.module("next/error", {
  defaultExport: ({ statusCode }: any) => <div data-testid="next-error">Error: {statusCode}</div>,
});

describe("GlobalError Component", () => {
  let GlobalError: any;
  let consoleErrorMock: any;

  before(async () => {
    const mod = await import("./global-error");
    GlobalError = mod.default;
    consoleErrorMock = mock.method(console, "error", () => {});
  });

  afterEach(() => {
    cleanup();
    consoleErrorMock.mock.resetCalls();
  });

  describe("GlobalError() Render Testleri", () => {
    it("should_RenderGenericError_AndLogToConsole", async () => {
      // Arrange
      const error = new Error("Test Global Error");

      // Act
      render(<GlobalError error={error} />);

      // Assert
      expect(screen.getByTestId("next-error")).toBeTruthy();
      expect(screen.getByText("Error: 0")).toBeTruthy();
      expect(consoleErrorMock.mock.calls.length).toBe(1);
    });
  });
});
