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
import { useMemo, useState } from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { StyledTextFieldAuth } from "@/app/lib/styled/styledFieldBox";
import AuthButton from "../ui/AuthButton";
import { useRouter, useParams } from "next/navigation";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { LoginUser } from "@/app/lib/controllers/users";
import { loginValidationSchema } from "@/app/lib/validationSchema";
import { logger } from "@/app/lib/logger";


interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginForm() {
  /* -------------------------------- VARIABLES ------------------------------- */
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const dict = useDictionary();

  /* --------------------------------- STATES --------------------------------- */
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  /* -------------------------------- HANDLERS -------------------------------- */
  const handleSubmit = async (
    values: LoginFormValues,
    actions: FormikHelpers<LoginFormValues>
  ) => {
    setLoading(true);
    try {
      const res = await LoginUser(values.email, values.password);

      if (res && "error" in res && res.error) {
        let errorMsg = res.error;
        if (res.error === "Invalid credentials") {
          errorMsg = dict.auth.invalidCredentials;
        } else if (res.error === "Too many login attempts. Please try again later.") {
          errorMsg = dict.auth.tooManyAttempts;
        } else if (res.error === "Too many login attempts for this account. Please try again later.") {
          errorMsg = dict.auth.tooManyAttemptsAccount;
        }

        actions.setFieldError("email", errorMsg);
        actions.setFieldError("password", errorMsg);
        setLoading(false);
        return;
      }

      if (res && "user" in res && res.user) {
        router.refresh();
        if (res.user.companyId) {
          router.push(`/${lang}/overview`);
        } else {
          router.push(`/${lang}`);
        }
      }
    } catch (error: unknown) {
      logger.error("Login failed:", error);
      const message =
        error instanceof Error ? error.message : dict.auth.loginFailed;
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
      maxWidth={{ sm: 420, xs: "95%" }}
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
        <Stack
          direction="row"
          spacing={3}
          mb={4}
          alignItems="center"
          justifyContent="center"
        >
          <Link
            href={`/${lang}/auth/sign-up`}
            style={{ textDecoration: "none" }}
          >
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "24px",
                letterSpacing: "-0.02em",
                color: "rgba(255, 255, 255, 0.3)",
                transition: "color 0.2s ease",
                "&:hover": {
                  color: "rgba(255, 255, 255, 0.6)",
                },
              }}
            >
              {dict.auth.register}
            </Typography>
          </Link>

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
              },
            }}
          >
            {dict.auth.login}
          </Typography>
        </Stack>

        <Formik<LoginFormValues>
          initialValues={{ email: "", password: "" }}
          onSubmit={handleSubmit}
          validationSchema={useMemo(() => loginValidationSchema(dict), [dict])}
        >
          <Form>
            <Stack spacing={3}>
              <Box mb={2}>
                <Typography
                  variant="h5"
                  component="h1"
                  sx={{ color: "#fff", fontWeight: 600, mb: 1 }}
                >
                  {dict.auth.welcome}
                </Typography>
                <Typography
                  sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "14px" }}
                >
                  {dict.auth.signInDescription}
                </Typography>
              </Box>

              <Field name="email">
                {({ field, meta }: FieldProps<LoginFormValues>) => (
                  <StyledTextFieldAuth
                    {...field}
                    type="email"
                    placeholder={dict.auth.email}
                    inputProps={{ "aria-label": dict.auth.email }}
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
                    placeholder={dict.auth.password}
                    inputProps={{ "aria-label": dict.auth.password }}
                    fullWidth
                    error={meta.touched && Boolean(meta.error)}
                    helperText={meta.touched && meta.error}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleShowPassword}
                            aria-label={
                              showPassword ? "hide password" : "show password"
                            }
                            sx={{ color: "rgba(255, 255, 255, 0.5)" }}
                          >
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
                loadingText={dict.auth.loggingIn}
                sx={{
                  mt: 2,
                  bgcolor: "#38bdf8",
                  color: "#000",
                  "&:hover": {
                    bgcolor: "#0ea5e9",
                  },
                }}
              >
                {dict.auth.logInNow}
              </AuthButton>
            </Stack>
          </Form>
        </Formik>
      </Box>
    </Box>
  );
}
