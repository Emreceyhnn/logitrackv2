"use client";

import React from "react";
import { Box, Stack, Typography, IconButton, useTheme, alpha } from "@mui/material";
import { Close as CloseIcon, Settings as SettingsIcon } from "@mui/icons-material";

interface HeaderProps {
  onClose: () => void;
}

export default function SettingsHeader({ onClose }: HeaderProps) {
  const theme = useTheme();

  return (
    <Box sx={{ px: 3, pt: 3, pb: 0 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2.5,
              bgcolor: alpha(theme.palette.primary.main, 0.12),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(10px)",
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <SettingsIcon sx={{ fontSize: 20, color: theme.palette.primary.main }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={800} color="white" sx={{ letterSpacing: -0.2 }}>
              System Configuration
            </Typography>
            <Typography variant="caption" sx={{ color: alpha("#fff", 0.45), fontWeight: 500 }}>
              Adjust regional markers & global preferences
            </Typography>
          </Box>
        </Stack>
        <IconButton 
          size="small" 
          onClick={onClose} 
          sx={{ 
            color: alpha("#fff", 0.3), 
            transition: "all 0.2s",
            "&:hover": { 
              color: "#f43f5e", 
              bgcolor: alpha("#f43f5e", 0.1),
              transform: "rotate(90deg)"
            } 
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Box>
  );
}
