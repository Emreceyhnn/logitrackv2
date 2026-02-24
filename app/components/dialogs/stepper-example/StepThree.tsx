"use client";

import {
  Box,
  Stack,
  Typography,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Divider,
} from "@mui/material";
import { StepComponentProps } from "@/app/lib/type/stepper-example";

export default function StepThree({
  formData,
  updateFormData,
}: StepComponentProps) {
  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    updateFormData({ [name]: checked });
  };

  const handleRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ theme: e.target.value as any });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, color: "text.primary" }}>
        Preferences & Summary
      </Typography>

      <Stack spacing={2}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Notification Settings
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.notifications}
                onChange={handleCheckbox}
                name="notifications"
              />
            }
            label="Enable Desktop Notifications"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.newsletter}
                onChange={handleCheckbox}
                name="newsletter"
              />
            }
            label="Subscribe to weekly newsletter"
          />
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Selected Theme
          </Typography>
          <RadioGroup row value={formData.theme} onChange={handleRadio}>
            <FormControlLabel value="light" control={<Radio />} label="Light" />
            <FormControlLabel value="dark" control={<Radio />} label="Dark" />
            <FormControlLabel
              value="system"
              control={<Radio />}
              label="System"
            />
          </RadioGroup>
        </Box>

        <Divider />

        <Box
          sx={{ p: 2, bgcolor: "rgba(255, 255, 255, 0.03)", borderRadius: 1 }}
        >
          <Typography variant="subtitle2" color="primary">
            Review
          </Typography>
          <Typography variant="body2">
            {formData.firstName} {formData.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formData.companyName} - {formData.role}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
