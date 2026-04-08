"use client";

import { useRef } from "react";
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
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";

import { useFormikContext } from "formik";
import { CompanyFormData } from "@/app/lib/type/create-company";

export default function Step1Branding({ state, actions }: CompanyStepProps) {
  const theme = useTheme();
  const { formData } = state;
  const { errors, touched, handleBlur } = useFormikContext<CompanyFormData>();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    fileInputRef.current?.click();
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, letterSpacing: "-0.01em" }}>
          Brand Persona
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Define how your organization appears across the LogiTrack ecosystem.
        </Typography>
      </Box>

      <Stack spacing={4}>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: alpha(theme.palette.text.primary, 0.7) }}>
            Legal Entity Name *
          </Typography>
          <TextField
            fullWidth
            placeholder="e.g. Global Logistics Inc."
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name && !!errors.name}
            helperText={touched.name && errors.name}
            autoFocus
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: alpha(theme.palette.background.paper, 0.5),
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                "&.Mui-focused": {
                  boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
                }
              },
            }}
          />
          <Typography
            variant="caption"
            sx={{ mt: 1, display: "block", color: alpha(theme.palette.text.secondary, 0.6) }}
          >
            This will be your primary identifier for billing and administrative tasks.
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: alpha(theme.palette.text.primary, 0.7) }}>
            Digital Identity (Logo)
          </Typography>
          <Box
            onClick={handleClickUpload}
            sx={{
              border: `2px dashed ${alpha(
                theme.palette.primary.main,
                formData.logo ? 0.4 : 0.15
              )}`,
              borderRadius: 4,
              p: formData.logo ? 2 : 5,
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
              overflow: "hidden",
              bgcolor: formData.logo 
                ? alpha(theme.palette.background.paper, 0.3)
                : alpha(theme.palette.primary.main, 0.02),
              "&:hover": {
                borderColor: theme.palette.primary.main,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                transform: "translateY(-2px)",
              },
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
            {formData.logo ? (
              <Box sx={{ position: "relative" }}>
                 <Box
                  component="img"
                  src={formData.logo}
                  sx={{
                    maxHeight: 140,
                    maxWidth: "100%",
                    borderRadius: 2,
                    display: "block",
                    mx: "auto",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  }}
                />
                <Box sx={{ 
                  position: "absolute", 
                  inset: 0, 
                  bgcolor: "rgba(0,0,0,0.4)", 
                  opacity: 0, 
                  transition: "0.2s", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  borderRadius: 2,
                  "&:hover": { opacity: 1 }
                }}>
                  <Typography variant="button" sx={{ color: "#fff", fontWeight: 700 }}>
                    Change Logo
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Stack alignItems="center" spacing={1}>
                <Box sx={{ 
                  width: 50, 
                  height: 50, 
                  borderRadius: "50%", 
                  bgcolor: alpha(theme.palette.primary.main, 0.1), 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  mb: 1
                }}>
                  <CloudUploadIcon sx={{ color: theme.palette.primary.main }} />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  Upload Brand Assets
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  PNG, JPG or SVG. Max size 5MB.
                </Typography>
              </Stack>
            )}
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: alpha(theme.palette.text.primary, 0.7) }}>
            Core Industry
          </Typography>
          <FormControl fullWidth error={touched.industry && !!errors.industry}>
            <Select
              name="industry"
              value={formData.industry}
              onChange={(e) =>
                actions.updateFormData({ industry: e.target.value as string })
              }
              onBlur={handleBlur}
              displayEmpty
              startAdornment={
                <BusinessCenterIcon sx={{ mr: 1, color: alpha(theme.palette.text.primary, 0.3), fontSize: 20 }} />
              }
              sx={{
                bgcolor: alpha(theme.palette.background.paper, 0.5),
                borderRadius: 3,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: alpha(theme.palette.divider, 0.1),
                }
              }}
            >
              <MenuItem value="" disabled>
                Select industry domain...
              </MenuItem>
              <MenuItem value="logistics">Logistics & Supply Chain</MenuItem>
              <MenuItem value="E-Commerce">E-Commerce & Delivery</MenuItem>
              <MenuItem value="manufacturing">Industrial Manufacturing</MenuItem>
              <MenuItem value="retail">Retail & Enterprise</MenuItem>
            </Select>
            {touched.industry && errors.industry && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                {errors.industry}
              </Typography>
            )}
          </FormControl>
        </Box>
      </Stack>
    </Box>
  );
}
