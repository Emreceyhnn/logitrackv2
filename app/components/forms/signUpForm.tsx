"use client";

import * as Yup from "yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Stack,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import type { FormikHelpers } from "formik";
import { useState } from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { StyledTextFieldAuth } from "@/app/lib/styled/styledFieldBox";
import CircularIndeterminate from "../loading";
import { RegisterUser } from "@/app/lib/controllers/users";

interface RegisterFormValues {
  username: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export default function RegisterForm() {
  /* --------------------------------- STATES --------------------------------- */
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  /* -------------------------------- HANDLERS -------------------------------- */
  const handleSubmit = async (
    values: RegisterFormValues,
    actions: FormikHelpers<RegisterFormValues>
  ) => {
    setLoading(true);
    try {
      // Use email as username if username field is not added, OR add username field.
      // Since existing RegisterUser expects username, let's use the provided username.
      const res = await RegisterUser(
        values.username, // Added username to values
        values.name,
        values.surname,
        values.password,
        values.email
      );

      if (res && res.token) {
        localStorage.setItem("token", res.token);
        // Also store user info if needed
        localStorage.setItem("user", JSON.stringify(res.user));
        router.push("/"); // Redirect to landing page to create company via modal
      }
    } catch (error: any) {
      console.error("Registration failed:", error);
      // You might want to set formik errors here
      actions.setFieldError("email", error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowRepeatPassword = () => {
    setShowRepeatPassword(!showRepeatPassword);
  };

  const RegisterSchema = Yup.object({
    username: Yup.string().min(3).max(20).required("Username is required"),
    name: Yup.string().min(2).max(20).required("Name is required"),
    surname: Yup.string().min(2).max(20).required("Surname is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .max(64, "Password is too long")
      .matches(/[a-z]/, "Password must contain a lowercase letter")
      .matches(/[A-Z]/, "Password must contain an uppercase letter")
      .matches(/[0-9]/, "Password must contain a number")
      .matches(/[^a-zA-Z0-9]/, "Password must contain a special character")
      .required("Password is required"),
    repeatPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Repeat password is required"),
  });

  return (
    <Box
      maxWidth={{ sm: 450, xs: "95%" }}
      width={"100%"}
      bgcolor={"#151515"}
      borderRadius={"8px"}
    >
      <Box p="40px">
        <Stack direction="row" spacing={2} mb={5}>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "18px",
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
            }}
          >
            Register
          </Typography>

          <Typography
            component={Link}
            href={"/auth/sign-in"}
            sx={{
              fontWeight: 500,
              fontSize: "18px",
              letterSpacing: "-0.02em",
              color: "rgba(255, 255, 255, 0.5)",
              textDecoration: "none",
            }}
          >
            Login
          </Typography>
        </Stack>

        <Formik<RegisterFormValues>
          initialValues={{
            username: "",
            name: "",
            surname: "",
            email: "",
            password: "",
            repeatPassword: "",
          }}
          onSubmit={handleSubmit}
          validationSchema={RegisterSchema}
        >
          <Form>
            <Stack spacing={2} mt={3}>
              <Field name="username">
                {({ field, meta }: any) => (
                  <StyledTextFieldAuth
                    {...field}
                    type="text"
                    placeholder="Enter your username"
                    fullWidth
                    error={meta.touched && Boolean(meta.error)}
                    helperText={meta.touched && meta.error}
                  />
                )}
              </Field>
              <Field name="name">
                {({ field, meta }: any) => (
                  <StyledTextFieldAuth
                    {...field}
                    type="text"
                    placeholder="Enter your Name"
                    fullWidth
                    error={meta.touched && Boolean(meta.error)}
                    helperText={meta.touched && meta.error}
                  />
                )}
              </Field>
              <Field name="surname">
                {({ field, meta }: any) => (
                  <StyledTextFieldAuth
                    {...field}
                    type="text"
                    placeholder="Enter your surname"
                    fullWidth
                    error={meta.touched && Boolean(meta.error)}
                    helperText={meta.touched && meta.error}
                  />
                )}
              </Field>
              <Field name="email">
                {({ field, meta }: any) => (
                  <StyledTextFieldAuth
                    {...field}
                    type="email"
                    placeholder="Enter your email"
                    fullWidth
                    error={meta.touched && Boolean(meta.error)}
                    helperText={meta.touched && meta.error}
                  />
                )}
              </Field>
              <Field name="password">
                {({ field, meta }: any) => (
                  <StyledTextFieldAuth
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    fullWidth
                    error={meta.touched && Boolean(meta.error)}
                    helperText={meta.touched && meta.error}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleShowPassword}>
                            {showPassword ? (
                              <VisibilityIcon />
                            ) : (
                              <VisibilityOffIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              </Field>
              <Field name="repeatPassword">
                {({ field, meta }: any) => (
                  <StyledTextFieldAuth
                    {...field}
                    type={showRepeatPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    fullWidth
                    error={meta.touched && Boolean(meta.error)}
                    helperText={meta.touched && meta.error}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleShowRepeatPassword}>
                            {showRepeatPassword ? (
                              <VisibilityIcon />
                            ) : (
                              <VisibilityOffIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              </Field>
              {loading ? (
                <CircularIndeterminate />
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: "4px",
                    width: "100%",
                    backgroundColor: "#38bdf8",
                    fontWeight: 500,
                    fontSize: "14px",
                    letterSpacing: "-0.02em",
                    padding: "12px",
                    borderRadius: 8,
                    border: "1px solid transparent",
                    boxShadow: "none",
                    transition:
                      "background-color 300ms ease, border-color 300ms ease color 300ms ease",

                    "&:hover": {
                      backgroundColor: "transparent",
                      border: "1px solid #38bdf8",
                      color: "#fff",
                      boxShadow: "none",
                    },

                    "&:active": {
                      boxShadow: "none",
                      outline: "none",
                    },

                    "&:focus": {
                      outline: "none",
                    },

                    "&:focus-visible": {
                      outline: "none",
                      boxShadow: "none",
                    },
                  }}
                >
                  Log In Now
                </Button>
              )}
            </Stack>
          </Form>
        </Formik>
      </Box>
    </Box>
  );
}
