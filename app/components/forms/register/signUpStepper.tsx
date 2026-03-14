"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Stack, Step, StepLabel, Stepper, Typography, styled, StepConnector, stepConnectorClasses } from "@mui/material";
import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import Step1PersonalInfo from "./step1PersonalInfo";
import Step2Security from "./step2Security";
import Step3Profile from "./step3Profile";
import { RegisterUser } from "@/app/lib/controllers/users";
import CircularIndeterminate from "../../loading";

/* --------------------------------- STYLES --------------------------------- */

const ColorlibConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 25, // Centered with 50px icon
    left: "calc(-50% + 25px)",
    right: "calc(50% + 25px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: "linear-gradient( 95deg, #38bdf8 0%, #0ea5e9 50%, #0284c7 100%)",
      opacity: 1,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: "linear-gradient( 95deg, #38bdf8 0%, #0ea5e9 50%, #0284c7 100%)",
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
    backgroundImage: "linear-gradient( 136deg, #38bdf8 0%, #0ea5e9 50%, #0284c7 100%)",
    boxShadow: "0 0 20px rgba(56, 189, 248, 0.3)",
    border: "none",
    transform: "scale(1.1)",
  }),
  ...(completed && {
    backgroundImage: "linear-gradient( 136deg, #38bdf8 0%, #0ea5e9 50%, #0284c7 100%)",
    boxShadow: "0 0 15px rgba(56, 189, 248, 0.2)",
  }),
}));

function ColorlibStepIcon(props: { active?: boolean; completed?: boolean; icon: React.ReactNode }) {
  const { active, completed, icon } = props;
  return (
    <ColorlibStepIconRoot active={active} completed={completed}>
      {icon}
    </ColorlibStepIconRoot>
  );
}

/* ------------------------------- VALIDATION ------------------------------- */

const validationSchemas = [
  Yup.object({
    name: Yup.string().min(2, "Name too short").required("Name is required"),
    surname: Yup.string().min(2, "Surname too short").required("Surname is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
  }),
  Yup.object({
    username: Yup.string().min(3, "Username too short").required("Username is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Lowercase required")
      .matches(/[A-Z]/, "Uppercase required")
      .matches(/[0-9]/, "Number required")
      .required("Password is required"),
    repeatPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Repeat password is required"),
  }),
  Yup.object({}), // Validation for step 3 if needed
];

const steps = ["Personal", "Security", "Review"];

interface RegisterFormValues {
  name: string;
  surname: string;
  email: string;
  username: string;
  password: string;
  repeatPassword: string;
}

export default function SignUpStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isLastStep = activeStep === steps.length - 1;

  const handleNext = async (values: RegisterFormValues, actions: FormikHelpers<RegisterFormValues>) => {
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

  const handleSubmit = async (values: RegisterFormValues, actions: FormikHelpers<RegisterFormValues>) => {
    setLoading(true);
    try {
      const res = await RegisterUser(
        null, // user as guest
        values.username,
        values.name,
        values.surname,
        values.password,
        values.email
      );

      if (res && res.user) {
        router.refresh();
        router.push("/onboarding");
      }
    } catch (error: unknown) {
      console.error("Registration failed:", error);
      const message = error instanceof Error ? error.message : "Registration failed";
      actions.setFieldError("email", message);
      // Optional: go back to step 1/2 if those fields had the error
      if (message.includes("Username")) setActiveStep(1);
      if (message.includes("Email")) setActiveStep(0);
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
                    transition: "all 0.4s ease"
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
          username: "",
          password: "",
          repeatPassword: "",
        }}
        validationSchema={validationSchemas[activeStep]}
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
                    }
                  }}
                >
                  Back
                </Button>
              )}
              
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  bgcolor: "#38bdf8",
                  color: "#000",
                  fontWeight: 600,
                  borderRadius: "12px",
                  py: 1.5,
                  "&:hover": {
                    bgcolor: "#0ea5e9",
                  }
                }}
              >
                {loading ? <CircularIndeterminate /> : (isLastStep ? "Complete Registration" : "Continue")}
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
