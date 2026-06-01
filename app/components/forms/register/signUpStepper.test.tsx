/* eslint-disable @typescript-eslint/no-explicit-any */
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

mock.module("../../../lib/language/DictionaryContext", { namedExports: { useDictionary: useDictionaryMock } });
mock.module("../../../lib/controllers/users", { namedExports: { RegisterUser: mock.fn() } });
mock.module("../../../lib/validationSchema", { namedExports: { signUpValidationSchema: mock.fn(() => [{}, {}, {}]) } });
mock.module("../../ui/AuthButton", { defaultExport: ({ children }: any) => <button data-testid="AuthButton">{children}</button> });

mock.module("./step1PersonalInfo", { defaultExport: () => <div data-testid="Step1PersonalInfo" /> });
mock.module("./step2Security", { defaultExport: () => <div data-testid="Step2Security" /> });
mock.module("./step3Profile", { defaultExport: () => <div data-testid="Step3Profile" /> });

mock.module("formik", {
  namedExports: {
    Form: ({ children }: any) => <form data-testid="Form">{children}</form>,
    Formik: ({ children }: any) => <div data-testid="Formik">{typeof children === "function" ? children({ handleSubmit: () => {} }) : children}</div>
  }
});

mock.module("@mui/material", {
  namedExports: {
    Box: ({ children }: any) => <div data-testid="Box">{children}</div>,
    Button: ({ children }: any) => <button data-testid="Button">{children}</button>,
    Stack: ({ children }: any) => <div data-testid="Stack">{children}</div>,
    Step: ({ children }: any) => <div data-testid="Step">{children}</div>,
    StepLabel: ({ children }: any) => <div data-testid="StepLabel">{children}</div>,
    Stepper: ({ children }: any) => <div data-testid="Stepper">{children}</div>,
    Typography: ({ children }: any) => <div data-testid="Typography">{children}</div>,
    styled: () => () => function StyledMock({ children }: any) { return <div data-testid="Styled">{children}</div>; },
    StepConnector: function StepConnectorMock() { return <div data-testid="StepConnector" />; },
    stepConnectorClasses: { alternativeLabel: "", active: "", completed: "", line: "" }
  }
});

mock.module("@mui/icons-material/Check", { defaultExport: () => <div data-testid="CheckIcon" /> });

describe("SignUpStepper Component", () => {
  let SignUpStepper: any;

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
