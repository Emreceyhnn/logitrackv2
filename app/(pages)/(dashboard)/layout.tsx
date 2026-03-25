"use client";

import SideBar from "@/app/components/sidebar";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import { Box, useTheme } from "@mui/material";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      sx={{
        backgroundColor: theme.palette.background.dashboardBg,
        minHeight: "100vh",
      }}
    >
      <Box
        component="nav"
        sx={{
          display: { xs: "none", md: "block" },
          width: 200,
          flexShrink: 0,
          position: "relative",
          zIndex: theme.zIndex.drawer,
        }}
      >
        <SideBar />
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: "100%", md: "calc(100% - 200px)" },
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <DashboardHeader />
        <Box sx={{ flexGrow: 1 }}>{children}</Box>
      </Box>
    </Box>
  );
}
