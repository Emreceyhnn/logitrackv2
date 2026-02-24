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
  InputLabel,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@mui/material";
import { CompanyStepProps } from "@/app/lib/type/create-company";
import PublicIcon from "@mui/icons-material/Public";
import PaymentsIcon from "@mui/icons-material/Payments";
import LanguageIcon from "@mui/icons-material/Language";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function Step2Regional({ state, actions }: CompanyStepProps) {
  const theme = useTheme();
  const { formData } = state;

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="overline"
          sx={{ color: "primary.main", fontWeight: 700 }}
        >
          Setup &gt; Create New Company
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
          Regional Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Step 2: Configure how your team interacts with time and local
          commerce.
        </Typography>
      </Box>

      <Stack spacing={4}>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
            Default Timezone *
          </Typography>
          <FormControl fullWidth>
            <Select
              name="timezone"
              value={formData.timezone}
              onChange={(e) =>
                actions.updateFormData({ timezone: e.target.value as string })
              }
              startAdornment={
                <PublicIcon
                  sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                />
              }
              sx={{
                bgcolor: alpha(theme.palette.background.paper, 0.4),
                borderRadius: 2,
              }}
            >
              <MenuItem value="EST">
                (GMT-05:00) Eastern Time (US & Canada)
              </MenuItem>
              <MenuItem value="UTC">UTC (Universal Coordinated Time)</MenuItem>
              <MenuItem value="TR">GMT+03:00 (Turkey Standard Time)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
              Base Currency
            </Typography>
            <FormControl fullWidth>
              <Select
                name="currency"
                value={formData.currency}
                onChange={(e) =>
                  actions.updateFormData({ currency: e.target.value as string })
                }
                startAdornment={
                  <PaymentsIcon
                    sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                  />
                }
                sx={{
                  bgcolor: alpha(theme.palette.background.paper, 0.4),
                  borderRadius: 2,
                }}
              >
                <MenuItem value="USD">USD - US Dollar ($)</MenuItem>
                <MenuItem value="EUR">EUR - Euro (€)</MenuItem>
                <MenuItem value="TRY">TRY - Turkish Lira (₺)</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
              Preferred Language
            </Typography>
            <FormControl fullWidth>
              <Select
                name="language"
                value={formData.language}
                onChange={(e) =>
                  actions.updateFormData({ language: e.target.value as string })
                }
                startAdornment={
                  <LanguageIcon
                    sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                  />
                }
                sx={{
                  bgcolor: alpha(theme.palette.background.paper, 0.4),
                  borderRadius: 2,
                }}
              >
                <MenuItem value="EN">English (United States)</MenuItem>
                <MenuItem value="TR">Turkish (Türkiye)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>

        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: alpha(theme.palette.primary.main, 0.03),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            display: "flex",
            gap: 2,
          }}
        >
          <InfoOutlinedIcon sx={{ color: "primary.main" }} />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
              Regional Visibility
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 2 }}
            >
              These settings will be applied to all newly created warehouses and
              fleets by default, but can be overwritten individually if you
              operate globally.
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
                  sx={{ color: "primary.main" }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Enable global regional overrides
                </Typography>
              }
            />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
