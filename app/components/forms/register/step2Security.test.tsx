import { describe, it, before, mock, beforeEach } from "node:test";
import { expect } from "expect";
import { renderToString } from "react-dom/server";
import React from "react";
global.React = React;

// MOCKLAR
const useDictionaryMock = mock.fn(() => ({
  auth: { security: "Sec", securityDescription: "Desc", password: "Pass", repeatPassword: "Rep" }
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
    Typography: ({ children }: any) => <div data-testid="Typography">{children}</div>,
    InputAdornment: ({ children }: any) => <div data-testid="InputAdornment">{children}</div>,
    IconButton: ({ children }: any) => <button data-testid="IconButton">{children}</button>
  }
});

mock.module("@mui/icons-material/VisibilityOff", { defaultExport: () => <div data-testid="VisibilityOffIcon" /> });
mock.module("@mui/icons-material/Visibility", { defaultExport: () => <div data-testid="VisibilityIcon" /> });

describe("Step2Security Component", () => {
  let Step2Security: any;

  before(async () => {
    const mod = await import("./step2Security");
    Step2Security = mod.default;
  });

  beforeEach(() => {
    useDictionaryMock.mock.resetCalls();
  });

  describe("Step2Security() bileşeni", () => {
    it("should_InitializeWithoutErrors_WhenRendered", async () => {
      let error = null;
      let html = "";
      try {
        html = renderToString(<Step2Security />);
      } catch (e) {
        error = e;
      }
      
      expect(error).toBeNull();
      expect(html).toContain("data-testid=\"Field-password\"");
    });
  });
});
