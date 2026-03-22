"use client";

import Link from "next/link";
import {
  Box,
  Stack,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import type { FormikHelpers, FieldProps } from "formik";
import { useState } from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { StyledTextFieldAuth } from "@/app/lib/styled/styledFieldBox";
import AuthButton from "../ui/AuthButton";

import { useRouter } from "next/navigation";
import { LoginUser } from "@/app/lib/controllers/users";
import { loginValidationSchema } from "@/app/lib/validationSchema";

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

      if (res && "error" in res && res.error) {
        actions.setFieldError("email", res.error);
        actions.setFieldError("password", res.error);
        setLoading(false);
        return;
      }

      if (res && "user" in res && res.user) {
        router.refresh();
        if (res.user.companyId) {
          router.push("/overview");
        } else {
          router.push("/onboarding");
        }
      }
    } catch (error: unknown) {
      console.error("Login failed:", error);
      const message = error instanceof Error ? error.message : "Login failed";
      actions.setFieldError("email", message);
      actions.setFieldError("password", message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      maxWidth={{ sm: 600, xs: "95%" }}
      width={"100%"}
      bgcolor={"rgba(8, 12, 24, 0.75)"}
      sx={{
        backdropFilter: "blur(25px)",
        border: "1px solid rgba(56, 189, 248, 0.15)",
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.8)",
      }}
      borderRadius={"24px"}
    >
      <Box p={{ xs: "30px", sm: "50px" }}>
        <Stack direction="row" spacing={3} mb={6} alignItems="center" justifyContent="center">
          <Typography
            component={Link}
            href={"/auth/sign-up"}
            sx={{
              fontWeight: 500,
              fontSize: "24px",
              letterSpacing: "-0.02em",
              color: "rgba(255, 255, 255, 0.3)",
              textDecoration: "none",
              transition: "color 0.2s ease",
              "&:hover": {
                color: "rgba(255, 255, 255, 0.6)",
              }
            }}
          >
            Register
          </Typography>

          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "24px",
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: -8,
                left: 0,
                width: "100%",
                height: 2,
                bgcolor: "#38bdf8",
                borderRadius: 2,
              }
            }}
          >
            Login
          </Typography>
        </Stack>

        <Formik<LoginFormValues>
          initialValues={{ email: "", password: "" }}
          onSubmit={handleSubmit}
          validationSchema={loginValidationSchema}
        >
          <Form>
            <Stack spacing={3}>
              <Box mb={2}>
                <Typography variant="h5" sx={{ color: "#fff", fontWeight: 600, mb: 1 }}>
                  Welcome Back
                </Typography>
                <Typography sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "14px" }}>
                  Please enter your details to access your account.
                </Typography>
              </Box>

              <Field name="email">
                {({ field, meta }: FieldProps<LoginFormValues>) => (
                  <StyledTextFieldAuth
                    {...field}
                    type="email"
                    placeholder="Email Address"
                    fullWidth
                    error={meta.touched && Boolean(meta.error)}
                    helperText={meta.touched && meta.error}
                  />
                )}
              </Field>

              <Field name="password">
                {({ field, meta }: FieldProps<LoginFormValues>) => (
                  <StyledTextFieldAuth
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    fullWidth
                    error={meta.touched && Boolean(meta.error)}
                    helperText={meta.touched && meta.error}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleShowPassword} sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
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

              <AuthButton
                type="submit"
                loading={loading}
                loadingText="Logging In..."
                sx={{
                  mt: 2,
                  bgcolor: "#38bdf8",
                  color: "#000",
                  "&:hover": {
                    bgcolor: "#0ea5e9",
                  }
                }}
              >
                Log In Now
              </AuthButton>

              <Typography
                variant="body2"
                align="center"
                sx={{ color: "rgba(255, 255, 255, 0.4)", mt: 2 }}
              >
                Forgot your password? <Link href="#" style={{ color: "#38bdf8", textDecoration: "none" }}>Reset it</Link>
              </Typography>
            </Stack>
          </Form>
        </Formik>
      </Box>
    </Box>
  );
}
