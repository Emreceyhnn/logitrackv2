"use client";

import { Box, Stack, Typography } from "@mui/material";
import { Field, FieldProps } from "formik";
import { StyledTextFieldAuth } from "@/app/lib/styled/styledFieldBox";

export default function Step1PersonalInfo() {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" sx={{ color: "#fff", fontWeight: 600, mb: 1 }}>
          Personal Information
        </Typography>
        <Typography sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "14px" }}>
          Please provide your basic details to get started.
        </Typography>
      </Box>

      <Stack spacing={2}>
        <Field name="name">
          {({ field, meta }: FieldProps) => (
            <StyledTextFieldAuth
              {...field}
              type="text"
              placeholder="First Name"
              fullWidth
              error={meta.touched && Boolean(meta.error)}
              helperText={meta.touched && meta.error}
            />
          )}
        </Field>
        <Field name="surname">
          {({ field, meta }: FieldProps) => (
            <StyledTextFieldAuth
              {...field}
              type="text"
              placeholder="Last Name"
              fullWidth
              error={meta.touched && Boolean(meta.error)}
              helperText={meta.touched && meta.error}
            />
          )}
        </Field>
        <Field name="email">
          {({ field, meta }: FieldProps) => (
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
      </Stack>
    </Stack>
  );
}
