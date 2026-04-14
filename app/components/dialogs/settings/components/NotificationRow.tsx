"use client";

import React from "react";
import { Box, Typography, Switch, useTheme } from "@mui/material";

interface NotifRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

export default function NotificationRow({
  label,
  description,
  checked,
  onChange,
}: NotifRowProps) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 2.5,
        py: 2,
        borderRadius: 3,
        border: `1px solid ${checked ? "#ffffff14" : "#ffffff0a"}`,
        bgcolor: checked ? (theme.palette.primary as any)._alpha.main_05 : (theme.palette.common as any).white_alpha.main_02,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          bgcolor: checked ? (theme.palette.primary as any)._alpha.main_08 : (theme.palette.common as any).white_alpha.main_03,
          borderColor: checked ? (theme.palette.primary as any)._alpha.main_30 : (theme.palette.primary as any)._alpha.main_10,
        }
      }}
    >
      <Box>
        <Typography variant="body2" fontWeight={750} color="white" sx={{ mb: 0.25 }}>
          {label}
        </Typography>
        <Typography variant="caption" sx={{ color: (theme.palette.common as any).white_alpha.main_35, fontWeight: 500 }}>
          {description}
        </Typography>
      </Box>
      <Switch
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        size="small"
        sx={{
          "& .MuiSwitch-switchBase.Mui-checked": { 
              color: theme.palette.primary.main,
              "& + .MuiSwitch-track": { 
                  bgcolor: theme.palette.primary.main,
                  opacity: 0.3
              }
          },
          "& .MuiSwitch-track": { bgcolor: (theme.palette.common as any).white_alpha.main_10 },
          "& .MuiSwitch-thumb": {
              boxShadow: checked ? `0 0 10px ${(theme.palette.primary as any)._alpha.main_60}` : "none"
          }
        }}
      />
    </Box>
  );
}
