"use client";

import React from "react";
import { Box, Stack, Typography, useTheme, alpha } from "@mui/material";
import UserAccountNav from "../nav/UserAccountNav";
import NotificationBell from "../notifications/NotificationBell";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

export default function DashboardHeader() {
  const theme = useTheme();
  const dict = useDictionary();

  return (
    <Box
      component="header"
      sx={{
        px: 4,
        py: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: (theme.palette.background as any).default_alpha.main_40,
        backdropFilter: "blur(12px) saturate(150%)",
        borderBottom: `1px solid ${(theme.palette as any).divider_alpha.main_08}`,
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
                bgcolor: (theme.palette.primary as any)._alpha.main_10,
                px: 1.5,
                py: 0.5,
                borderRadius: 1.5,
                letterSpacing: 1,
                fontSize: "0.7rem",
                textTransform: "uppercase"
            }}
        >
          {dict.dashboard.header.internalConsole}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center">
        <NotificationBell />
        <UserAccountNav />
      </Stack>
    </Box>
  );
}
