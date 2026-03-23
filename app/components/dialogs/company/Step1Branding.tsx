"use client";

import {
  Box,
  TextField,
  Stack,
  Typography,
  alpha,
  useTheme,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import { CompanyStepProps } from "@/app/lib/type/create-company";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function Step1Branding({ state, actions }: CompanyStepProps) {
  const theme = useTheme();
  const { formData } = state;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (name) {
      actions.updateFormData({ [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        actions.updateFormData({ logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClickUpload = () => {
    const input = document.getElementById("logo-upload-input");
    input?.click();
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
          Create New Company
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Step 1: Focuses on Branding
        </Typography>
      </Box>

      <Stack spacing={4}>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
            Company Name *
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter your unique company name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: alpha(theme.palette.background.paper, 0.4),
                borderRadius: 2,
              },
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            This name must be unique within the platform.
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
            Company Logo
          </Typography>
          <Box
            onClick={handleClickUpload}
            sx={{
              border: `2px dashed ${alpha(
                theme.palette.divider,
                formData.logo ? 0.5 : 0.2
              )}`,
              borderRadius: 3,
              p: formData.logo ? 2 : 4,
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
              position: "relative",
              overflow: "hidden",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: alpha(theme.palette.primary.main, 0.02),
              },
            }}
          >
            <input
              type="file"
              id="logo-upload-input"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
            {formData.logo ? (
              <Box
                component="img"
                src={formData.logo}
                sx={{
                  maxHeight: 120,
                  maxWidth: "100%",
                  borderRadius: 1,
                  display: "block",
                  mx: "auto",
                }}
              />
            ) : (
              <>
                <CloudUploadIcon
                  sx={{ fontSize: 40, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Click to upload or drag and drop
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  SVG, PNG, JPG (max. 800x400px)
                </Typography>
              </>
            )}
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
            Primary Industry
          </Typography>
          <FormControl fullWidth>
            <Select
              name="industry"
              value={formData.industry}
              onChange={(e) =>
                actions.updateFormData({ industry: e.target.value as string })
              }
              displayEmpty
              sx={{
                bgcolor: alpha(theme.palette.background.paper, 0.4),
                borderRadius: 2,
              }}
            >
              <MenuItem value="" disabled>
                Select an industry...
              </MenuItem>
              <MenuItem value="logistics">Logistics & Transportation</MenuItem>
              <MenuItem value="tech">Technology</MenuItem>
              <MenuItem value="manufacturing">Manufacturing</MenuItem>
              <MenuItem value="retail">Retail</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Stack>
    </Box>
  );
}
