import { describe, it, before, mock, beforeEach } from "node:test";
import { expect } from "expect";
import { renderToString } from "react-dom/server";
import React from "react";
global.React = React;

// MOCKLAR
const useDictionaryMock = mock.fn(() => ({
  auth: { personalInfo: "PInfo", security: "Sec", review: "Rev", unexpectedError: "Err", registering: "Reging", continuing: "Conting", completeRegistration: "Comp", continue: "Cont" },
  common: { back: "Back" }
}));

mock.module("next/navigation", {
  namedExports: { useRouter: mock.fn(() => ({ push: mock.fn(), refresh: mock.fn() })), useParams: mock.fn(() => ({ lang: "en" })) }
});

mock.module("@/app/lib/language/DictionaryContext", { namedExports: { useDictionary: useDictionaryMock } });
mock.module("@/app/lib/controllers/users", { namedExports: { RegisterUser: mock.fn() } });
mock.module("@/app/lib/validationSchema", { namedExports: { signUpValidationSchema: mock.fn(() => [{}, {}, {}]) } });
mock.module("../../ui/AuthButton", { defaultExport: ({ children }: { children?: React.ReactNode }) => <button data-testid="AuthButton">{children}</button> });

mock.module("./step1PersonalInfo", { defaultExport: () => <div data-testid="Step1PersonalInfo" /> });
mock.module("./step2Security", { defaultExport: () => <div data-testid="Step2Security" /> });
mock.module("./step3Profile", { defaultExport: () => <div data-testid="Step3Profile" /> });

mock.module("formik", {
  namedExports: {
    Form: ({ children }: { children?: React.ReactNode }) => <form data-testid="Form">{children}</form>,
    Formik: ({ children }: { children?: React.ReactNode }) => <div data-testid="Formik">{typeof children === "function" ? children({ handleSubmit: () => {} }) : children}</div>
  }
});

mock.module("@mui/material", {
  namedExports: {
    Box: ({ children }: { children?: React.ReactNode }) => <div data-testid="Box">{children}</div>,
    Button: ({ children }: { children?: React.ReactNode }) => <button data-testid="Button">{children}</button>,
    Stack: ({ children }: { children?: React.ReactNode }) => <div data-testid="Stack">{children}</div>,
    Step: ({ children }: { children?: React.ReactNode }) => <div data-testid="Step">{children}</div>,
    StepLabel: ({ children }: { children?: React.ReactNode }) => <div data-testid="StepLabel">{children}</div>,
    Stepper: ({ children }: { children?: React.ReactNode }) => <div data-testid="Stepper">{children}</div>,
    Typography: ({ children }: { children?: React.ReactNode }) => <div data-testid="Typography">{children}</div>,
    styled: () => () => function StyledMock({ children }: { children?: React.ReactNode }) { return <div data-testid="Styled">{children}</div>; },
    StepConnector: function StepConnectorMock() { return <div data-testid="StepConnector" />; },
    stepConnectorClasses: { alternativeLabel: "", active: "", completed: "", line: "" }
  }
});

mock.module("@mui/icons-material/Check", { defaultExport: () => <div data-testid="CheckIcon" /> });

describe("SignUpStepper Component", () => {
  let SignUpStepper: React.ElementType;

  before(async () => {
    const mod = await import("./signUpStepper");
    SignUpStepper = mod.default;
  });

  beforeEach(() => {
    useDictionaryMock.mock.resetCalls();
  });

  describe("SignUpStepper() bileşeni", () => {
    it("should_InitializeWithoutErrors_WhenRendered", async () => {
      let error = null;
      let html = "";
      try {
        html = renderToString(<SignUpStepper />);
      } catch (e) {
        error = e;
      }
      
      expect(error).toBeNull();
      expect(html).toContain("data-testid=\"Formik\"");
    });
  });
});
