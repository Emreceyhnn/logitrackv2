"use client";

import React from "react";
import { Box, Stack, Typography, useTheme, alpha } from "@mui/material";
import UserAccountNav from "../nav/UserAccountNav";

export default function DashboardHeader() {
  const theme = useTheme();

  return (
    <Box
      component="header"
      sx={{
        px: 4,
        py: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: alpha(theme.palette.background.default, 0.4),
        backdropFilter: "blur(12px) saturate(150%)",
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        position: "sticky",
        top: 0,
        zIndex: theme.zIndex.appBar,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        {/* Placeholder for Breadcrumbs or Page Title if needed */}
        <Typography 
            variant="subtitle2" 
            fontWeight={800} 
            sx={{ 
                color: theme.palette.primary.main,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                px: 1.5,
                py: 0.5,
                borderRadius: 1.5,
                letterSpacing: 1,
                fontSize: "0.7rem",
                textTransform: "uppercase"
            }}
        >
          Internal Console
        </Typography>
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center">
        <UserAccountNav />
      </Stack>
    </Box>
  );
}
