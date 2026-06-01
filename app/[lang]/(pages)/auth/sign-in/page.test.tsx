import "global-jsdom/register";
import { describe, it, before, mock, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";

// Mock child component
mock.module("@/app/components/forms/signInForm", {
  defaultExport: () => <div data-testid="sign-in-form">Sign In Form</div>,
});

describe("SignInPage Component", () => {
  let SignInPage: React.ElementType;

  before(async () => {
    const mod = await import("./page");
    SignInPage = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  describe("SignInPage() Render Testleri", () => {
    it("should_RenderSignInForm_Correctly", async () => {
      // Act
      render(<SignInPage />);

      // Assert
      expect(screen.getByTestId("sign-in-form")).toBeTruthy();
    });
  });
});
