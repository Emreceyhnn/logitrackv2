"use client";

import {
  Box,
  Stack,
  Typography,
  alpha,
  useTheme,
  MenuItem,
  Select,
  FormControl,
  FormControlLabel,
  Checkbox,
  Grid,
} from "@mui/material";
import { CompanyStepProps } from "@/app/lib/type/create-company";
import PublicIcon from "@mui/icons-material/Public";
import PaymentsIcon from "@mui/icons-material/Payments";
import LanguageIcon from "@mui/icons-material/Language";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { useFormikContext } from "formik";
import { CompanyFormData } from "@/app/lib/type/create-company";

export default function Step2Regional({ state, actions }: CompanyStepProps) {
  const theme = useTheme();
  const { formData } = state;
  const { errors, touched, handleBlur } = useFormikContext<CompanyFormData>();

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="overline"
          sx={{ color: "primary.main", fontWeight: 800, letterSpacing: "0.1em" }}
        >
          GLOBAL CONFIGURATION
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, letterSpacing: "-0.01em" }}>
          Regional Ecosystem
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure how your team interacts with time, local commerce, and data visibility.
        </Typography>
      </Box>

      <Stack spacing={4}>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: alpha(theme.palette.text.primary, 0.7) }}>
            Principal Timezone *
          </Typography>
          <FormControl fullWidth error={touched.timezone && !!errors.timezone}>
            <Select
              name="timezone"
              value={formData.timezone}
              onChange={(e) =>
                actions.updateFormData({ timezone: e.target.value as string })
              }
              onBlur={handleBlur}
              startAdornment={
                <PublicIcon
                  sx={{ mr: 1, color: alpha(theme.palette.text.primary, 0.3), fontSize: 20 }}
                />
              }
              sx={{
                bgcolor: alpha(theme.palette.background.paper, 0.5),
                borderRadius: 3,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: alpha(theme.palette.divider, 0.1),
                }
              }}
            >
              <MenuItem value="UTC">UTC (Universal Coordinated Time)</MenuItem>
              <MenuItem value="EST">Eastern Time (US & Canada)</MenuItem>
              <MenuItem value="TR">Turkey Standard Time (GMT+03:00)</MenuItem>
              <MenuItem value="CET">Central European Time (GMT+01:00)</MenuItem>
            </Select>
            {touched.timezone && errors.timezone && (
               <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                 {errors.timezone}
               </Typography>
            )}
          </FormControl>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: alpha(theme.palette.text.primary, 0.7) }}>
              Functional Currency
            </Typography>
            <FormControl fullWidth error={touched.currency && !!errors.currency}>
              <Select
                name="currency"
                value={formData.currency}
                onChange={(e) =>
                  actions.updateFormData({ currency: e.target.value as string })
                }
                onBlur={handleBlur}
                startAdornment={
                  <PaymentsIcon
                    sx={{ mr: 1, color: alpha(theme.palette.text.primary, 0.3), fontSize: 20 }}
                  />
                }
                sx={{
                  bgcolor: alpha(theme.palette.background.paper, 0.5),
                  borderRadius: 3,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: alpha(theme.palette.divider, 0.1),
                  }
                }}
              >
                <MenuItem value="USD">USD - United States Dollar</MenuItem>
                <MenuItem value="EUR">EUR - European Euro</MenuItem>
                <MenuItem value="TRY">TRY - Turkish Lira</MenuItem>
                <MenuItem value="GBP">GBP - British Pound</MenuItem>
              </Select>
              {touched.currency && errors.currency && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.currency}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: alpha(theme.palette.text.primary, 0.7) }}>
              System Language
            </Typography>
            <FormControl fullWidth error={touched.language && !!errors.language}>
              <Select
                name="language"
                value={formData.language}
                onChange={(e) =>
                  actions.updateFormData({ language: e.target.value as string })
                }
                onBlur={handleBlur}
                startAdornment={
                  <LanguageIcon
                    sx={{ mr: 1, color: alpha(theme.palette.text.primary, 0.3), fontSize: 20 }}
                  />
                }
                sx={{
                  bgcolor: alpha(theme.palette.background.paper, 0.5),
                  borderRadius: 3,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: alpha(theme.palette.divider, 0.1),
                  }
                }}
              >
                <MenuItem value="EN">English (Global Standart)</MenuItem>
                <MenuItem value="TR">Turkish (Türkiye Opsiyonu)</MenuItem>
              </Select>
              {touched.language && errors.language && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.language}
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>

        <Box
          sx={{
            p: 3,
            borderRadius: 4,
            bgcolor: alpha(theme.palette.primary.main, 0.04),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
            display: "flex",
            gap: 2.5,
            transition: "0.2s",
            "&:hover": {
               bgcolor: alpha(theme.palette.primary.main, 0.06),
            }
          }}
        >
          <InfoOutlinedIcon sx={{ color: theme.palette.primary.main, mt: 0.5 }} />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5 }}>
              Referential Integrity & Scope
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: alpha(theme.palette.text.secondary, 0.7), display: "block", mb: 2, lineHeight: 1.5 }}
            >
              These presets automatically standardize all operational units. Sub-entities (warehouses, fleets) can still override these individually when needed.
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.regionalVisibility}
                  onChange={(e) =>
                    actions.updateFormData({
                      regionalVisibility: e.target.checked,
                    })
                  }
                  sx={{ 
                    color: alpha(theme.palette.primary.main, 0.5),
                    "&.Mui-checked": { color: theme.palette.primary.main }
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  Enable dynamic regional overrides
                </Typography>
              }
            />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
