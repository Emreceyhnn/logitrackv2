"use client";

import { Box, TextField, Stack, Typography } from "@mui/material";
import { StepComponentProps } from "@/app/lib/type/stepper-example";
import { useEffect, useState } from "react";

export default function StepOne({
  formData,
  updateFormData,
}: StepComponentProps) {
  const [localErrors, setLocalErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });

    // Simple validation
    if (!value) {
      setLocalErrors((prev) => ({ ...prev, [name]: "This field is required" }));
    } else {
      setLocalErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, color: "text.primary" }}>
        Personal Information
      </Typography>
      <Stack spacing={3}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={!!localErrors.firstName}
            helperText={localErrors.firstName}
            variant="filled"
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={!!localErrors.lastName}
            helperText={localErrors.lastName}
            variant="filled"
          />
        </Stack>
        <TextField
          fullWidth
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={!!localErrors.email}
          helperText={localErrors.email}
          variant="filled"
        />
      </Stack>
    </Box>
  );
}
