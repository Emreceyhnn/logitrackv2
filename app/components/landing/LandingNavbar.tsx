"use client";

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
  /* -------------------------------- VARIABLES ------------------------------- */
  const params = useParams();
  const theme = useTheme();
  const dict = useDictionary();
  const lang = (params?.lang as string) || "tr";
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
              ? theme.palette.mode === "dark"
                ? theme.palette.background.deepNavy?._alpha.main_85
                : "rgba(255, 255, 255, 0.9)"
              : theme.palette.mode === "dark"
                ? theme.palette.kpi.slateDeep_alpha.main_40
                : "rgba(255, 255, 255, 0.4)",
            backdropFilter: "blur(20px)",
            border: (theme) =>
              `1px solid ${
                trigger
                  ? theme.palette.mode === "dark"
                    ? theme.palette.kpi.cyan_alpha.main_20
                    : "rgba(0, 0, 0, 0.1)"
                  : theme.palette.mode === "dark"
                    ? theme.palette.kpi.slateLight_alpha.main_10
                    : "rgba(0, 0, 0, 0.05)"
              }`,
            boxShadow: trigger
              ? theme.palette.mode === "dark"
                ? "0 20px 40px rgba(0,0,0,0.4)"
                : "0 10px 30px rgba(0,0,0,0.05)"
              : "none",
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
                  src="/logo.svg"
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
                  color: theme.palette.logo.text,
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
              {
                label: dict.navbar.features,
                href: `/${lang}${getLocalizedPath("/features", lang)}`,
              },
              {
                label: dict.navbar.pricing,
                href: `/${lang}${getLocalizedPath("/pricing", lang)}`,
              },
              {
                label: dict.navbar.about,
                href: `/${lang}${getLocalizedPath("/about", lang)}`,
              },
              {
                label: dict.navbar.howItWorks,
                href: `/${lang}${getLocalizedPath("/how-it-works", lang)}`,
              },
            ].map((item) => (
              <Typography
                key={item.label}
                component={Link}
                href={item.href}
                variant="body2"
                sx={{
                  fontWeight: 600,
                  textDecoration: "none",
                  color: theme.palette.text.secondary,
                  transition: "all 0.2s ease",
                  "&:hover": { color: theme.palette.primary.main },
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
