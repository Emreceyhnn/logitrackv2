"use client";

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
} from "@mui/material";
import {
  Language as LanguageIcon,
  Payments as PaymentsIcon,
  Save as SaveIcon,
  ScheduleOutlined as TimezoneIcon,
} from "@mui/icons-material";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import type {
  SettingsPageState,
  SettingsPageActions,
} from "@/app/lib/type/settings";
import { selectSxFactory, inputLabelSxFactory } from "./SettingsStyles";

interface RegionalTabProps {
  state: SettingsPageState;
  actions: SettingsPageActions;
}

export default function RegionalTab({ state, actions }: RegionalTabProps) {
  const theme = useTheme();
  const dict = useDictionary();
  const ssX = selectSxFactory(theme);
  const ilSX = inputLabelSxFactory(theme);

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          p: 2,
          borderRadius: 2.5,
          bgcolor: theme.palette.primary._alpha.main_04,
          border: `1px solid ${theme.palette.primary._alpha.main_10}`,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.common.white_alpha.main_45,
            fontWeight: 550,
            lineHeight: 1.6,
          }}
        >
          {dict.company.dialogs.localizationDesc}
        </Typography>
      </Box>

      <Stack spacing={2.5}>
        <Stack direction="row" spacing={2.5}>
          <FormControl fullWidth size="small" sx={ilSX}>
            <InputLabel>{dict.company.dialogs.interfaceLanguage}</InputLabel>
            <Select
              value={state.regional.language}
              label={dict.company.dialogs.interfaceLanguage}
              onChange={(e) =>
                actions.updateRegional({
                  language: e.target.value as "EN" | "TR",
                })
              }
              startAdornment={
                <LanguageIcon
                  sx={{
                    mr: 1,
                    fontSize: 18,
                    color: theme.palette.primary._alpha.main_50,
                  }}
                />
              }
              sx={ssX}
            >
              <MenuItem value="EN">🇺🇸 {dict.languages.en} (Global)</MenuItem>
              <MenuItem value="TR">🇹🇷 {dict.languages.tr}</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" sx={ilSX}>
            <InputLabel>{dict.company.dialogs.defaultCurrency}</InputLabel>
            <Select
              value={state.regional.currency}
              label={dict.company.dialogs.defaultCurrency}
              onChange={(e) =>
                actions.updateRegional({
                  currency: e.target.value as "USD" | "EUR" | "TRY" | "GBP",
                })
              }
              startAdornment={
                <PaymentsIcon
                  sx={{
                    mr: 1,
                    fontSize: 18,
                    color: theme.palette.primary._alpha.main_50,
                  }}
                />
              }
              sx={ssX}
            >
              <MenuItem value="USD">
                $ USD - {dict.settings.dialogs.regional.currencies.dollar}
              </MenuItem>
              <MenuItem value="EUR">
                € EUR - {dict.settings.dialogs.regional.currencies.euro}
              </MenuItem>
              <MenuItem value="TRY">
                ₺ TRY - {dict.settings.dialogs.regional.currencies.lira}
              </MenuItem>
              <MenuItem value="GBP">
                £ GBP - {dict.settings.dialogs.regional.currencies.pound}
              </MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Stack direction="row" spacing={2.5}>
          <FormControl fullWidth size="small" sx={ilSX}>
            <InputLabel>{dict.company.dialogs.activeTimezone}</InputLabel>
            <Select
              value={state.regional.timezone}
              label={dict.company.dialogs.activeTimezone}
              onChange={(e) =>
                actions.updateRegional({ timezone: e.target.value })
              }
              startAdornment={
                <TimezoneIcon
                  sx={{
                    mr: 1,
                    fontSize: 18,
                    color: theme.palette.primary._alpha.main_50,
                  }}
                />
              }
              sx={ssX}
            >
              <MenuItem value="UTC">
                UTC ({dict.settings.dialogs.regional.timezones.universal})
              </MenuItem>
              <MenuItem value="Europe/Istanbul">
                {dict.settings.dialogs.regional.timezones.istanbul} (GMT+3)
              </MenuItem>
              <MenuItem value="Europe/Berlin">
                {dict.settings.dialogs.regional.timezones.centralEurope} (GMT+1)
              </MenuItem>
              <MenuItem value="America/New_York">
                {dict.settings.dialogs.regional.timezones.easternTime} (GMT-5)
              </MenuItem>
              <MenuItem value="America/Los_Angeles">
                {dict.settings.dialogs.regional.timezones.pacificTime} (GMT-8)
              </MenuItem>
              <MenuItem value="Asia/Tokyo">
                {dict.settings.dialogs.regional.timezones.tokyoSeoul} (GMT+9)
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" sx={ilSX}>
            <InputLabel>{dict.company.dialogs.dateTimeFormat}</InputLabel>
            <Select
              value={state.regional.dateFormat}
              label={dict.company.dialogs.dateTimeFormat}
              onChange={(e) =>
                actions.updateRegional({ dateFormat: e.target.value })
              }
              sx={ssX}
            >
              <MenuItem value="MM/DD/YYYY">
                {dict.settings.dialogs.regional.dateFormats.standard}
              </MenuItem>
              <MenuItem value="DD/MM/YYYY">
                {dict.settings.dialogs.regional.dateFormats.international}
              </MenuItem>
              <MenuItem value="YYYY-MM-DD">ISO-8601 (YYYY-MM-DD)</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      <Box display="flex" justifyContent="flex-end" pt={1}>
        <Button
          variant="contained"
          startIcon={
            state.isSaving ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <SaveIcon sx={{ fontSize: 18 }} />
            )
          }
          onClick={actions.saveRegional}
          disabled={state.isSaving}
          sx={{
            textTransform: "none",
            fontWeight: 800,
            borderRadius: 2.5,
            px: 4,
            py: 1,
            boxShadow: `0 8px 32px ${theme.palette.primary._alpha.main_25}`,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            "&:hover": {
              boxShadow: `0 12px 40px ${theme.palette.primary._alpha.main_35}`,
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s",
          }}
        >
          {state.isSaving
            ? dict.common.synchronizing
            : dict.common.updatePreferences}
        </Button>
      </Box>
    </Stack>
  );
}
