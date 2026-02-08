"use client";

import * as Yup from "yup";
import Link from "next/link";
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

import { useRouter } from "next/navigation";
import { LoginUser } from "@/app/lib/controllers/users";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginForm() {
  /* --------------------------------- STATES --------------------------------- */
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  /* -------------------------------- HANDLERS -------------------------------- */
  const handleSubmit = async (
    values: LoginFormValues,
    actions: FormikHelpers<LoginFormValues>
  ) => {
    setLoading(true);
    try {
      const res = await LoginUser(values.email, values.password);

      if (res && res.token) {
        localStorage.setItem("token", res.token);
        if (res.user.companyId) {
          router.push("/");
        } else {
          router.push("/create-company");
        }
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      actions.setFieldError("email", error.message || "Login failed");
      actions.setFieldError("password", error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const LoginSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
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
            component={Link}
            href={"/auth/sign-up"}
            sx={{
              fontWeight: 500,
              fontSize: "18px",
              letterSpacing: "-0.02em",
              color: "rgba(255, 255, 255, 0.5)",
              textDecoration: "none",
            }}
          >
            Register
          </Typography>

          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "18px",
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
            }}
          >
            Login
          </Typography>
        </Stack>

        <Formik<LoginFormValues>
          initialValues={{ email: "", password: "" }}
          onSubmit={handleSubmit}
          validationSchema={LoginSchema}
        >
          <Form>
            <Stack spacing={2} mt={3}>
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
