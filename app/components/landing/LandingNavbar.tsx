"use client";

import {
  AppBar,
  Box,
  Container,
  Stack,
  Toolbar,
  Typography,
  useScrollTrigger,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import LandingHeaderAuth from "./LandingHeaderAuth";
import LanguageSwitcher from "../nav/LanguageSwitcher";
import { useParams } from "next/navigation";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { getLocalizedPath } from "@/app/lib/language/navigation";

export default function LandingNavbar() {
  /* -------------------------------- VARIABLES ------------------------------- */
  const params = useParams();
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
        top: trigger ? 0 : 0,
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        border: "none",
        boxShadow: "none",
        zIndex: 1100,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            py: trigger ? 1 : 2,
            px: { xs: 2, md: 6 },
            width: "100%",
            maxWidth: "100%",
            background: trigger ? "rgba(10, 14, 20, 0.8)" : "transparent",
            backdropFilter: trigger ? "blur(20px)" : "none",
            borderBottom: trigger
              ? "1px solid rgba(0, 242, 255, 0.1)"
              : "1px solid rgba(255, 255, 255, 0.05)",
            transition: "all 0.4s ease",
            justifyContent: "space-between",
          }}
        >
          <Link href={`/${lang}`} style={{ textDecoration: "none" }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: trigger ? 32 : 36,
                  height: trigger ? 32 : 36,
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #00f2ff, #6366f1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.4s ease",
                  boxShadow: trigger
                    ? "none"
                    : "0 0 20px rgba(0, 242, 255, 0.2)",
                }}
              >
                <Image
                  src="/logo-white.svg"
                  alt="LogiTrack"
                  width={trigger ? 18 : 20}
                  height={trigger ? 18 : 20}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  letterSpacing: 2,
                  fontSize: trigger ? "0.875rem" : "1.125rem",
                  color: "white",
                  transition: "all 0.4s ease",
                  display: { xs: "none", sm: "block" },
                  textTransform: "uppercase",
                }}
              >
                {dict.common.logitrack}
              </Typography>
            </Stack>
          </Link>

          <Stack
            direction="row"
            spacing={6}
            alignItems="center"
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {[
              {
                label: dict.navbar.features,
                href: "#solutions",
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
                  fontWeight: 700,
                  textDecoration: "none",
                  color: "rgba(255, 255, 255, 0.6)",
                  transition: "all 0.2s ease",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  "&:hover": { color: "#00f2ff" },
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <LanguageSwitcher />
            <LandingHeaderAuth />
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
