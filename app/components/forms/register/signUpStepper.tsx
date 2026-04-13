"use client";

import { useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Box,
  Button,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
  styled,
  StepConnector,
  stepConnectorClasses,
} from "@mui/material";
import { Form, Formik, FormikHelpers } from "formik";
import Step1PersonalInfo from "./step1PersonalInfo";
import Step2Security from "./step2Security";
import Step3Profile from "./step3Profile";
import { RegisterUser } from "@/app/lib/controllers/users";
import AuthButton from "../../ui/AuthButton";
import { signUpValidationSchema } from "@/app/lib/validationSchema";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

/* --------------------------------- STYLES --------------------------------- */

const ColorlibConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 25,
    left: "calc(-50% + 25px)",
    right: "calc(50% + 25px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg, #38bdf8 0%, #0ea5e9 50%, #0284c7 100%)",
      opacity: 1,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg, #38bdf8 0%, #0ea5e9 50%, #0284c7 100%)",
      opacity: 1,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 1,
    transition: "all 0.4s ease",
    opacity: 0.5,
  },
}));

const ColorlibStepIconRoot = styled("div")<{
  active?: boolean;
  completed?: boolean;
}>(({ active, completed }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  ...(active && {
    backgroundImage:
      "linear-gradient( 136deg, #38bdf8 0%, #0ea5e9 50%, #0284c7 100%)",
    boxShadow: "0 0 20px rgba(56, 189, 248, 0.3)",
    border: "none",
    transform: "scale(1.1)",
  }),
  ...(completed && {
    backgroundImage:
      "linear-gradient( 136deg, #38bdf8 0%, #0ea5e9 50%, #0284c7 100%)",
    boxShadow: "0 0 15px rgba(56, 189, 248, 0.2)",
  }),
}));

function ColorlibStepIcon(props: {
  active?: boolean;
  completed?: boolean;
  icon: React.ReactNode;
}) {
  const { active, completed, icon } = props;
  return (
    <ColorlibStepIconRoot active={active} completed={completed}>
      {icon}
    </ColorlibStepIconRoot>
  );
}

// Removed hardcoded steps array

interface RegisterFormValues {
  name: string;
  surname: string;
  email: string;
  password: string;
  repeatPassword: string;
  avatarUrl: string;
}

export default function SignUpStepper() {
  const dict = useDictionary();
  const steps = [dict.auth.personalInfo, dict.auth.security, dict.auth.review];
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { lang } = useParams();

  const schemas = useMemo(() => signUpValidationSchema(dict), [dict]);

  const isLastStep = activeStep === steps.length - 1;

  const handleNext = async (
    values: RegisterFormValues,
    actions: FormikHelpers<RegisterFormValues>
  ) => {
    if (isLastStep) {
      await handleSubmit(values, actions);
    } else {
      setActiveStep((prev) => prev + 1);
      actions.setTouched({});
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (
    values: RegisterFormValues,
    actions: FormikHelpers<RegisterFormValues>
  ) => {
    setLoading(true);
    try {
      const res = await RegisterUser(
        values.name,
        values.surname,
        values.password,
        values.email,
        values.avatarUrl
      );

      if (res && "error" in res) {
        console.error("Registration failed:", res.error);

        if (typeof res.error === "string") {
          if (res.field === "email") {
            setActiveStep(0);
            actions.setFieldError("email", res.error);
          } else {
            actions.setFieldError("email", res.error);
            setActiveStep(0);
          }
        }
      } else if (res && "user" in res) {
        router.refresh();
        router.push(`/${lang}`);
      }
    } catch (error: unknown) {
      console.error("Critical Registration crash:", error);
      actions.setFieldError("email", dict.auth.unexpectedError);
      setActiveStep(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 500, mx: "auto" }}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<ColorlibConnector />}
        sx={{ mb: 6 }}
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              StepIconComponent={(props) => (
                <ColorlibStepIcon {...props} icon={index + 1} />
              )}
            >
              <Typography
                sx={{
                  color: activeStep >= index ? "#fff" : "rgba(255,255,255,0.2)",
                  fontWeight: activeStep === index ? 600 : 400,
                  fontSize: "13px",
                  mt: 1,
                  transition: "all 0.4s ease",
                }}
              >
                {label}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Formik<RegisterFormValues>
        initialValues={{
          name: "",
          surname: "",
          email: "",
          password: "",
          repeatPassword: "",
          avatarUrl: "",
        }}
        validationSchema={schemas[activeStep]}
        onSubmit={handleNext}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Box sx={{ minHeight: 300 }}>
              {activeStep === 0 && <Step1PersonalInfo />}
              {activeStep === 1 && <Step2Security />}
              {activeStep === 2 && <Step3Profile />}
            </Box>

            <Stack direction="row" spacing={2} mt={5}>
              {activeStep > 0 && (
                <Button
                  fullWidth
                  onClick={handleBack}
                  variant="outlined"
                  sx={{
                    color: "#fff",
                    borderColor: "rgba(255,255,255,0.2)",
                    borderRadius: "12px",
                    py: 1.5,
                    "&:hover": {
                      borderColor: "#38bdf8",
                    },
                  }}
                >
                  {dict.common.back}
                </Button>
              )}

              <AuthButton
                type="submit"
                loading={loading}
                loadingText={isLastStep ? dict.auth.registering : dict.auth.continuing}
                sx={{
                  bgcolor: "#38bdf8",
                  color: "#000",
                  "&:hover": {
                    bgcolor: "#0ea5e9",
                  },
                }}
              >
                {isLastStep ? dict.auth.completeRegistration : dict.auth.continue}
              </AuthButton>
            </Stack>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
