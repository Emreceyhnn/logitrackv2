import { describe, it, before, mock, beforeEach } from "node:test";
import { expect } from "expect";
import { renderToString } from "react-dom/server";
import React from "react";
global.React = React;

// MOCKLAR
const useDictionaryMock = mock.fn(() => ({
  auth: { register: "Register", login: "Login", welcome: "Welcome", signInDescription: "Desc", email: "Email", password: "Password", loggingIn: "Logging in", logInNow: "Log in now", forgotPasswordPrompt: "Forgot?", resetIt: "Reset" }
}));

mock.module("next/navigation", {
  namedExports: { useRouter: mock.fn(() => ({ push: mock.fn(), refresh: mock.fn() })), useParams: mock.fn(() => ({ lang: "en" })) }
});

mock.module("next/link", { defaultExport: ({ children }: { children?: React.ReactNode }) => <a data-testid="Link">{children}</a> });

mock.module("@/app/lib/language/DictionaryContext", { namedExports: { useDictionary: useDictionaryMock } });
mock.module("@/app/lib/controllers/users", { namedExports: { LoginUser: mock.fn() } });
mock.module("@/app/lib/validationSchema", { namedExports: { loginValidationSchema: mock.fn() } });
mock.module("@/app/lib/styled/styledFieldBox", { namedExports: { StyledTextFieldAuth: () => <input data-testid="StyledTextFieldAuth" /> } });
mock.module("../ui/AuthButton", { defaultExport: ({ children }: { children?: React.ReactNode }) => <button data-testid="AuthButton">{children}</button> });

mock.module("formik", {
  namedExports: {
    Field: ({ children, name }: unknown) => <div data-testid={`Field-${name}`}>{typeof children === "function" ? children({ field: { name }, meta: {} }) : children}</div>,
    Form: ({ children }: { children?: React.ReactNode }) => <form data-testid="Form">{children}</form>,
    Formik: ({ children }: { children?: React.ReactNode }) => <div data-testid="Formik">{typeof children === "function" ? children({ handleSubmit: () => {} }) : children}</div>
  }
});

mock.module("@mui/material", {
  namedExports: {
    Box: ({ children }: { children?: React.ReactNode }) => <div data-testid="Box">{children}</div>,
    Stack: ({ children }: { children?: React.ReactNode }) => <div data-testid="Stack">{children}</div>,
    Typography: ({ children }: { children?: React.ReactNode }) => <div data-testid="Typography">{children}</div>,
    InputAdornment: ({ children }: { children?: React.ReactNode }) => <div data-testid="InputAdornment">{children}</div>,
    IconButton: ({ children }: { children?: React.ReactNode }) => <button data-testid="IconButton">{children}</button>
  }
});

mock.module("@mui/icons-material/VisibilityOff", { defaultExport: () => <div data-testid="VisibilityOffIcon" /> });
mock.module("@mui/icons-material/Visibility", { defaultExport: () => <div data-testid="VisibilityIcon" /> });

describe("LoginForm Component", () => {
  let LoginForm: React.ElementType;

  before(async () => {
    const mod = await import("./signInForm");
    LoginForm = mod.default;
  });

  beforeEach(() => {
    useDictionaryMock.mock.resetCalls();
  });

  describe("LoginForm() bileşeni", () => {
    it("should_InitializeWithoutErrors_WhenRendered", async () => {
      let error = null;
      let html = "";
      try {
        html = renderToString(<LoginForm />);
      } catch (e) {
        error = e;
      }
      
      expect(error).toBeNull();
      expect(html).toContain("data-testid=\"Formik\"");
    });
  });
});
