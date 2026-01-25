"use client"

import Footer from "@/app/components/footer";
import SideBar from "@/app/components/sidebar";
import { Box, Stack, useTheme } from "@mui/material";


export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  const theme = useTheme()

  return (
    <Box display="flex" sx={{ backgroundColor: theme.palette.background.dashboardBg, }} >
      <Stack sx={{
        position: "relative",
        top: 0,
        left: 0,
        minWidth: 200,
        height: "100dvh",
      }}>
        <SideBar />
      </Stack>
      <Stack flexGrow={1}>
        {children}
        <Footer />
      </Stack>

    </Box>
  )
}