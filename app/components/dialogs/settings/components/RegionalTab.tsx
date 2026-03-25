"use client";

import React from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Language as LanguageIcon,
  Payments as PaymentsIcon,
  Save as SaveIcon,
  ScheduleOutlined as TimezoneIcon,
} from "@mui/icons-material";
import type { SettingsPageState, SettingsPageActions } from "@/app/lib/type/settings";
import { selectSxFactory, inputLabelSx } from "./SettingsStyles";

interface RegionalTabProps {
  state: SettingsPageState;
  actions: SettingsPageActions;
}

export default function RegionalTab({ state, actions }: RegionalTabProps) {
  const theme = useTheme();
  const ssX = selectSxFactory(theme);

  return (
    <Stack spacing={3}>
      <Box sx={{ 
        p: 2, 
        borderRadius: 2.5, 
        bgcolor: alpha(theme.palette.primary.main, 0.04),
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
      }}>
        <Typography variant="caption" sx={{ color: alpha("#fff", 0.45), fontWeight: 550, lineHeight: 1.6 }}>
          Platform localization affects how currencies, timestamps, and numbers are rendered globally across your dashboard and reports.
        </Typography>
      </Box>

      <Stack spacing={2.5}>
        <Stack direction="row" spacing={2.5}>
          <FormControl fullWidth size="small" sx={inputLabelSx}>
            <InputLabel>Interface Language</InputLabel>
            <Select value={state.regional.language} label="Interface Language"
              onChange={(e) => actions.updateRegional({ language: e.target.value as "EN" | "TR" })}
              startAdornment={<LanguageIcon sx={{ mr: 1, fontSize: 18, color: alpha(theme.palette.primary.main, 0.5) }} />}
              sx={ssX}
            >
              <MenuItem value="EN">🇺🇸 English (Global)</MenuItem>
              <MenuItem value="TR">🇹🇷 Türkçe</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" sx={inputLabelSx}>
            <InputLabel>Default Currency</InputLabel>
            <Select value={state.regional.currency} label="Default Currency"
              onChange={(e) => actions.updateRegional({ currency: e.target.value as "USD" | "EUR" | "TRY" | "GBP" })}
              startAdornment={<PaymentsIcon sx={{ mr: 1, fontSize: 18, color: alpha(theme.palette.primary.main, 0.5) }} />}
              sx={ssX}
            >
              <MenuItem value="USD">$ USD - Dollar</MenuItem>
              <MenuItem value="EUR">€ EUR - Euro</MenuItem>
              <MenuItem value="TRY">₺ TRY - Lira</MenuItem>
              <MenuItem value="GBP">£ GBP - Pound</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Stack direction="row" spacing={2.5}>
          <FormControl fullWidth size="small" sx={inputLabelSx}>
            <InputLabel>Active Timezone</InputLabel>
            <Select value={state.regional.timezone} label="Active Timezone"
              onChange={(e) => actions.updateRegional({ timezone: e.target.value })}
              startAdornment={<TimezoneIcon sx={{ mr: 1, fontSize: 18, color: alpha(theme.palette.primary.main, 0.5) }} />}
              sx={ssX}
            >
              <MenuItem value="UTC">UTC (Universal Coordinate)</MenuItem>
              <MenuItem value="Europe/Istanbul">Istanbul (GMT+3)</MenuItem>
              <MenuItem value="Europe/Berlin">Central Europe (GMT+1)</MenuItem>
              <MenuItem value="America/New_York">Eastern Time (GMT-5)</MenuItem>
              <MenuItem value="America/Los_Angeles">Pacific Time (GMT-8)</MenuItem>
              <MenuItem value="Asia/Tokyo">Tokyo/Seoul (GMT+9)</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" sx={inputLabelSx}>
            <InputLabel>Date-Time Format</InputLabel>
            <Select value={state.regional.dateFormat} label="Date-Time Format" onChange={(e) => actions.updateRegional({ dateFormat: e.target.value })} sx={ssX}>
              <MenuItem value="MM/DD/YYYY">Standard (MM/DD/YY)</MenuItem>
              <MenuItem value="DD/MM/YYYY">International (DD/MM/YY)</MenuItem>
              <MenuItem value="YYYY-MM-DD">ISO-8601 (YYYY-MM-DD)</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      <Box display="flex" justifyContent="flex-end" pt={1}>
        <Button 
            variant="contained" 
            startIcon={state.isSaving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon sx={{ fontSize: 18 }} />}
            onClick={actions.saveRegional} 
            disabled={state.isSaving}
            sx={{ 
                textTransform: "none", 
                fontWeight: 800, 
                borderRadius: 2.5, 
                px: 4,
                py: 1,
                boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.25)}`,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                "&:hover": {
                    boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.35)}`,
                    transform: "translateY(-1px)"
                },
                transition: "all 0.2s"
            }}
        >
          {state.isSaving ? "Synchronizing..." : "Update Preferences"}
        </Button>
      </Box>
    </Stack>
  );
}
