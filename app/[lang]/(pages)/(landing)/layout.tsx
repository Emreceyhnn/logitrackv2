import { Box } from "@mui/material";
import LandingNavbar from "@/app/components/landing/LandingNavbar";
import LandingFooter from "@/app/components/landing/LandingFooter";
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
        <LandingFooter />
      </Box>
    </LandingThemeProvider>
  );
}
