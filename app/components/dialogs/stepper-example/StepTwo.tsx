"use client";

import {
  Box,
  TextField,
  Stack,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { StepComponentProps } from "@/app/lib/type/stepper-example";

export default function StepTwo({
  formData,
  updateFormData,
}: StepComponentProps) {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, color: "text.primary" }}>
        Professional Details
      </Typography>
      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Company Name"
          name="companyName"
          value={formData.companyName}
          onChange={handleTextChange}
          variant="filled"
        />
        <TextField
          fullWidth
          label="Role / Title"
          name="role"
          value={formData.role}
          onChange={handleTextChange}
          variant="filled"
        />
        <FormControl fullWidth variant="filled">
          <InputLabel id="experience-label">Experience Level</InputLabel>
          <Select
            labelId="experience-label"
            name="experience"
            value={formData.experience}
            onChange={handleSelectChange}
          >
            <MenuItem value="">Select Level</MenuItem>
            <MenuItem value="junior">Junior (0-2 years)</MenuItem>
            <MenuItem value="mid">Mid-level (2-5 years)</MenuItem>
            <MenuItem value="senior">Senior (5+ years)</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );
}
