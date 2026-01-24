"use client"

import SideBar from "@/app/components/sidebar";
import { Box, Stack, useTheme } from "@mui/material";


export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  const theme = useTheme()

  return (
    <Box display="flex" minHeight={"200dvh"} sx={{ backgroundColor: theme.palette.background.dashboardBg }} >
      <Stack sx={{
        position: "relative",
        top: 0,
        left: 0,
        minWidth: 200,
        height: "100dvh",
      }}>
        <SideBar />
      </Stack>
      {children}
    </Box>
  )
}