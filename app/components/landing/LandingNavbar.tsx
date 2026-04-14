import {
  AppBar,
  Box,
  Container,
  Stack,
  Toolbar,
  Typography,
  
  useScrollTrigger,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import LandingHeaderAuth from "./LandingHeaderAuth";
import { useParams } from "next/navigation";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { getLocalizedPath } from "@/app/lib/language/navigation";

export default function LandingNavbar() {
  const params = useParams();
  const lang = (params?.lang as string) || "tr";
  const dict = useDictionary();

  const theme = useTheme();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "transparent",
        top: trigger ? 10 : 20,
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        zIndex: 1100,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            py: trigger ? 1 : 1.5,
            px: { xs: 2, md: 4 },
            borderRadius: "24px",
            background: trigger
              ? theme.palette.background.deepNavy?.main_85
              : theme.palette.background.slateDeep?.main_40,
            backdropFilter: "blur(20px)",
            border: `1px solid ${trigger ? theme.palette.background.cyan?.main_20 : theme.palette.background.slateLight?.main_10}`,
            boxShadow: trigger ? "0 20px 40px rgba(0,0,0,0.4)" : "none",
            transition: "all 0.4s ease",
            justifyContent: "space-between",
          }}
        >
          <Link href={`/${lang}`} style={{ textDecoration: "none" }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: trigger ? 36 : 44,
                  height: trigger ? 36 : 44,
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #38bdf8, #6366f1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.4s ease",
                }}
              >
                <Image
                  src="/logo-beyaz-vector.png"
                  alt="LogiTrack"
                  width={trigger ? 22 : 28}
                  height={trigger ? 22 : 28}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  letterSpacing: 1.5,
                  fontSize: trigger ? "1rem" : "1.25rem",
                  color: "#fff",
                  transition: "all 0.4s ease",
                  display: { xs: "none", sm: "block" },
                }}
              >
                {dict.common.logitrack.toUpperCase()}
              </Typography>
            </Stack>
          </Link>

          <Stack
            direction="row"
            spacing={4}
            alignItems="center"
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {[
              { label: dict.navbar.features, href: `/${lang}${getLocalizedPath("/features", lang)}` },
              { label: dict.navbar.pricing, href: `/${lang}${getLocalizedPath("/pricing", lang)}` },
              { label: dict.navbar.about, href: `/${lang}${getLocalizedPath("/about", lang)}` },
              { label: dict.navbar.howItWorks, href: `/${lang}${getLocalizedPath("/how-it-works", lang)}` },
            ].map((item) => (
              <Typography
                key={item.label}
                component={Link}
                href={item.href}
                variant="body2"
                sx={{
                  fontWeight: 600,
                  textDecoration: "none",
                  color: theme.palette.background.lavender?.main_70,
                  transition: "all 0.2s ease",
                  "&:hover": { color: theme.palette.background.cyan?.main },
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Stack>

          <LandingHeaderAuth />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
