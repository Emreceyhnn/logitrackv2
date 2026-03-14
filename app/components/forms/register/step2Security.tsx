"use client";

import { Box, Stack, Typography, InputAdornment, IconButton } from "@mui/material";
import { Field, FieldProps } from "formik";
import { useState } from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { StyledTextFieldAuth } from "@/app/lib/styled/styledFieldBox";

export default function Step2Security() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" sx={{ color: "#fff", fontWeight: 600, mb: 1 }}>
          Security
        </Typography>
        <Typography sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "14px" }}>
          Choose a unique username and a strong password.
        </Typography>
      </Box>

      <Stack spacing={2}>
        <Field name="username">
          {({ field, meta }: FieldProps) => (
            <StyledTextFieldAuth
              {...field}
              type="text"
              placeholder="Username"
              fullWidth
              error={meta.touched && Boolean(meta.error)}
              helperText={meta.touched && meta.error}
            />
          )}
        </Field>
        
        <Field name="password">
          {({ field, meta }: FieldProps) => (
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
                    <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                      {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        </Field>

        <Field name="repeatPassword">
          {({ field, meta }: FieldProps) => (
            <StyledTextFieldAuth
              {...field}
              type={showRepeatPassword ? "text" : "password"}
              placeholder="Repeat Password"
              fullWidth
              error={meta.touched && Boolean(meta.error)}
              helperText={meta.touched && meta.error}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowRepeatPassword(!showRepeatPassword)} sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                      {showRepeatPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        </Field>
      </Stack>
    </Stack>
  );
}
