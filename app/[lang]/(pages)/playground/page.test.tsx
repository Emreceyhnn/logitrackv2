/* eslint-disable @typescript-eslint/no-explicit-any */
import "global-jsdom/register";
import { describe, it, before, afterEach } from "node:test";
import { expect } from "expect";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";

describe("PlaygroundPage Component", () => {
  let PlaygroundPage: any;

  before(async () => {
    const mod = await import("./page");
    PlaygroundPage = mod.default;
  });

  afterEach(() => {
    cleanup();
  });

  describe("PlaygroundPage() Render Testleri", () => {
    it("should_RenderPlaygroundNotice_Correctly", async () => {
      // Act
      render(<PlaygroundPage />);

      // Assert
      expect(screen.getByText("Playground")).toBeTruthy();
      expect(screen.getByText("Developer sandbox — no active tests.")).toBeTruthy();
    });
  });
});
