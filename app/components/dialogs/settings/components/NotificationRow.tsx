"use client";

import React from "react";
import { Box, Typography, Switch, useTheme, alpha } from "@mui/material";

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
        border: `1px solid ${alpha("#fff", checked ? 0.08 : 0.04)}`,
        bgcolor: checked ? alpha(theme.palette.primary.main, 0.05) : alpha("#fff", 0.015),
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          bgcolor: checked ? alpha(theme.palette.primary.main, 0.08) : alpha("#fff", 0.03),
          borderColor: alpha(theme.palette.primary.main, checked ? 0.3 : 0.1),
        }
      }}
    >
      <Box>
        <Typography variant="body2" fontWeight={750} color="white" sx={{ mb: 0.25 }}>
          {label}
        </Typography>
        <Typography variant="caption" sx={{ color: alpha("#fff", 0.35), fontWeight: 500 }}>
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
          "& .MuiSwitch-track": { bgcolor: alpha("#fff", 0.1) },
          "& .MuiSwitch-thumb": {
              boxShadow: checked ? `0 0 10px ${alpha(theme.palette.primary.main, 0.6)}` : "none"
          }
        }}
      />
    </Box>
  );
}
