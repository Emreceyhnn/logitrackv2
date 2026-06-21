"use client";

import {
  Box,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { getLocalizedPath } from "@/app/lib/language/navigation";

export default function LandingFooter() {
  const dict = useDictionary();
  const params = useParams();
  const lang = (params?.lang as string) || "en";

  const footerSections = [
    {
      title: dict.landing.footer.sections.platform,
      links: [
        { label: dict.landing.footer.sections.globalTracking, href: `/${lang}${getLocalizedPath("/global-tracking", lang)}` },
        { label: dict.landing.footer.sections.routeIntelligence, href: `/${lang}${getLocalizedPath("/route-intelligence", lang)}` },
        { label: dict.landing.footer.sections.telemetryHub, href: `/${lang}${getLocalizedPath("/telemetry-hub", lang)}` },
        { label: dict.landing.footer.sections.securityCenter, href: `/${lang}${getLocalizedPath("/security-center", lang)}` },
      ],
    },
    {
      title: dict.landing.footer.sections.solutions,
      links: [
        { label: dict.landing.footer.sections.enterprise, href: `/${lang}${getLocalizedPath("/enterprise", lang)}` },
        { label: dict.landing.footer.sections.smbLogistics, href: `/${lang}${getLocalizedPath("/smb-logistics", lang)}` },
        { label: dict.landing.footer.sections.supplyChain, href: `/${lang}${getLocalizedPath("/supply-chain", lang)}` },
      ],
    },
    {
      title: dict.landing.footer.sections.company,
      links: [
        { label: dict.landing.footer.sections.ourMission, href: `/${lang}${getLocalizedPath("/mission", lang)}` },
        { label: dict.landing.footer.sections.engineering, href: `/${lang}${getLocalizedPath("/engineering", lang)}` },
        { label: dict.landing.footer.sections.pressKit, href: `/${lang}${getLocalizedPath("/press-kit", lang)}` },
        { label: dict.landing.footer.sections.careers, href: `/${lang}${getLocalizedPath("/careers", lang)}` },
      ],
    },
    {
      title: dict.landing.footer.sections.support,
      links: [
        { label: dict.landing.footer.sections.devDocs, href: `/${lang}${getLocalizedPath("/dev-docs", lang)}` },
        { label: dict.landing.footer.sections.helpCenter, href: `/${lang}${getLocalizedPath("/help-center", lang)}` },
        { label: dict.landing.footer.sections.privacy, href: `/${lang}${getLocalizedPath("/privacy", lang)}` },
        { label: dict.landing.footer.sections.sla, href: `/${lang}${getLocalizedPath("/sla", lang)}` },
      ],
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        py: 12,
        bgcolor: "#0a0e14",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={8} sx={{ mb: 10 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={4}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "8px",
                    bgcolor: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    src="/logo-white.svg"
                    alt="LogiTrack"
                    width={20}
                    height={20}
                  />
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 900,
                    color: "white",
                    letterSpacing: "-0.05em",
                  }}
                >
                  Logitrack
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.6)",
                  lineHeight: 1.8,
                  maxWidth: "320px",
                }}
              >
                {dict.landing.footer.description}
              </Typography>
              <Stack direction="row" spacing={3}>
                <MuiLink
                  href="#"
                  aria-label="LinkedIn"
                  sx={{
                    color: "rgba(255, 255, 255, 0.4)",
                    "&:hover": { color: "#00f2ff" },
                  }}
                >
                  <LinkedInIcon />
                </MuiLink>
                <MuiLink
                  href="#"
                  aria-label="Twitter"
                  sx={{
                    color: "rgba(255, 255, 255, 0.4)",
                    "&:hover": { color: "#00f2ff" },
                  }}
                >
                  <TwitterIcon />
                </MuiLink>
              </Stack>
            </Stack>
          </Grid>

          {footerSections.map((section) => (
            <Grid size={{ xs: 6, md: 2 }} key={section.title}>
              <Typography
                className="font-label-md"
                sx={{
                  color: "white",
                  fontWeight: 900,
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  mb: 4,
                }}
              >
                {section.title}
              </Typography>
              <Stack spacing={2}>
                {section.links.map((link) => (
                  <MuiLink
                    key={link.label}
                    component={Link}
                    href={link.href}
                    underline="none"
                    sx={{
                      color: "rgba(255, 255, 255, 0.5)",
                      fontSize: "0.8125rem",
                      transition: "color 0.2s ease",
                      "&:hover": { color: "white" },
                    }}
                  >
                    {link.label}
                  </MuiLink>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.05)", mb: 6 }} />

        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={4}
        >
          <Typography
            className="font-label-md"
            sx={{
              fontSize: "0.75rem",
              color: "rgba(255, 255, 255, 0.4)",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontWeight: 700,
              textAlign: { xs: "center", md: "left" },
            }}
          >
            {dict.landing.footer.rights}
          </Typography>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: "#00f2ff",
                boxShadow: "0 0 8px #00f2ff",
              }}
            />
            <Typography
              className="font-label-md"
              sx={{
                fontSize: "0.75rem",
                color: "rgba(255, 255, 255, 0.6)",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                fontWeight: 900,
              }}
            >
              {dict.landing.footer.status}
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
