"use client";

import {
  Box,
  Stack,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Field, FieldProps } from "formik";
import { useState } from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { StyledTextFieldAuth } from "@/app/lib/styled/styledFieldBox";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

export default function Step2Security() {
  const dict = useDictionary();
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" sx={{ color: "#fff", fontWeight: 600, mb: 1 }}>
          {dict.auth.security}
        </Typography>
        <Typography
          sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "14px" }}
        >
          {dict.auth.securityDescription}
        </Typography>
      </Box>

      <Stack spacing={2}>
        <Field name="password">
          {({ field, meta }: FieldProps) => (
            <StyledTextFieldAuth
              {...field}
              type={showPassword ? "text" : "password"}
              placeholder={dict.auth.password}
              fullWidth
              error={meta.touched && Boolean(meta.error)}
              helperText={meta.touched && meta.error}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
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

        <Field name="repeatPassword">
          {({ field, meta }: FieldProps) => (
            <StyledTextFieldAuth
              {...field}
              type={showRepeatPassword ? "text" : "password"}
              placeholder={dict.auth.repeatPassword}
              fullWidth
              error={meta.touched && Boolean(meta.error)}
              helperText={meta.touched && meta.error}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                      sx={{ color: "rgba(255, 255, 255, 0.5)" }}
                    >
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
      </Stack>
    </Stack>
  );
}
