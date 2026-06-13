
import { Box } from "@mui/material";
import LandingNavbar from "@/app/components/landing/LandingNavbar";
import LandingThemeProvider from "@/app/lib/theme/LandingThemeProvider";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LandingThemeProvider>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
        }}
      >
        <LandingNavbar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          {children}
        </Box>
      </Box>
    </LandingThemeProvider>
  );
}
