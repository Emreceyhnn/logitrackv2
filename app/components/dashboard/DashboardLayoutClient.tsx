"use client";

import { Box, useTheme } from "@mui/material";
import SideBar from "@/app/components/sidebar";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import { AuthenticatedUser } from "@/app/lib/auth-middleware";
import { UserProvider } from "@/app/lib/context/UserContext";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  user: AuthenticatedUser | null;
}

export default function DashboardLayoutClient({
  children,
  user,
}: DashboardLayoutClientProps) {
  const theme = useTheme();

  return (
    <UserProvider initialUser={user}>
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
          <DashboardHeader user={user} />
          <Box sx={{ flexGrow: 1 }}>{children}</Box>
        </Box>
      </Box>
    </UserProvider>
  );
}
