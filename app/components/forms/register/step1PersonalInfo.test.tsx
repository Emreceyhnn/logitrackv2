/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, before, mock, beforeEach } from "node:test";
import { expect } from "expect";
import { renderToString } from "react-dom/server";
import React from "react";
global.React = React;

// MOCKLAR
const useDictionaryMock = mock.fn(() => ({
  auth: { personalInfo: "PInfo", signUpDescription: "Desc", firstName: "First", lastName: "Last", email: "Email" }
}));

mock.module("@/app/lib/language/DictionaryContext", { namedExports: { useDictionary: useDictionaryMock } });
mock.module("@/app/lib/styled/styledFieldBox", { namedExports: { StyledTextFieldAuth: () => <input data-testid="StyledTextFieldAuth" /> } });

mock.module("formik", {
  namedExports: {
    Field: ({ children, name }: any) => <div data-testid={`Field-${name}`}>{typeof children === "function" ? children({ field: { name }, meta: {} }) : children}</div>
  }
});

mock.module("@mui/material", {
  namedExports: {
    Box: ({ children }: any) => <div data-testid="Box">{children}</div>,
    Stack: ({ children }: any) => <div data-testid="Stack">{children}</div>,
    Typography: ({ children }: any) => <div data-testid="Typography">{children}</div>
  }
});

describe("Step1PersonalInfo Component", () => {
  let Step1PersonalInfo: any;

  before(async () => {
    const mod = await import("./step1PersonalInfo");
    Step1PersonalInfo = mod.default;
  });

  beforeEach(() => {
    useDictionaryMock.mock.resetCalls();
  });

  describe("Step1PersonalInfo() bileşeni", () => {
    it("should_InitializeWithoutErrors_WhenRendered", async () => {
      let error = null;
      let html = "";
      try {
        html = renderToString(<Step1PersonalInfo />);
      } catch (e) {
        error = e;
      }
      
      expect(error).toBeNull();
      expect(html).toContain("data-testid=\"Field-name\"");
    });
  });
});
