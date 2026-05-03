"use client";

import { useMemo } from "react";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import Image from "next/image";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { keyframes } from "@mui/system";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
export default function LandingPage() {
  const dict = useDictionary();
  const theme = useTheme();

  const pulse = useMemo(() => keyframes`
    0% {
      transform: scale(1);
      box-shadow: 0 0 10px ${theme.palette.kpi.cyan_alpha.main_25}, 0 0 20px ${theme.palette.kpi.cyan_alpha.main_15};
      opacity: 1;
    }
    25% {
      transform: scale(1.08);
      box-shadow: 0 0 25px ${theme.palette.kpi.cyan_alpha.main_40}, 0 0 45px ${theme.palette.kpi.cyan_alpha.main_25};
      opacity: 0.95;
    }
    50% {
      transform: scale(1.15);
      box-shadow: 0 0 40px ${theme.palette.kpi.cyan_alpha.main_60}, 0 0 70px ${theme.palette.kpi.cyan_alpha.main_35};
      opacity: 1;
    }
    75% {
      transform: scale(1.08);
      box-shadow: 0 0 25px ${theme.palette.kpi.cyan_alpha.main_40}, 0 0 45px ${theme.palette.kpi.cyan_alpha.main_25};
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 10px ${theme.palette.kpi.cyan_alpha.main_25}, 0 0 20px ${theme.palette.kpi.cyan_alpha.main_15};
      opacity: 1;
    }
  `, [theme]);

  const featureCards = useMemo(() => [
    {
      title: dict.landing.features.smartRoute.title,
      description: dict.landing.features.smartRoute.desc,
    },
    {
      title: dict.landing.features.predictiveEta.title,
      description: dict.landing.features.predictiveEta.desc,
    },
    {
      title: dict.landing.features.driverPerf.title,
      description: dict.landing.features.driverPerf.desc,
    },
    {
      title: dict.landing.features.exceptionAlerts.title,
      description: dict.landing.features.exceptionAlerts.desc,
    },
  ], [dict]);

  const workflow = useMemo(() => [
    {
      step: "1",
      title: dict.landing.workflow.title1,
      description: dict.landing.workflow.desc1,
    },
    {
      step: "2",
      title: dict.landing.workflow.title2,
      description: dict.landing.workflow.desc2,
    },
    {
      step: "3",
      title: dict.landing.workflow.title3,
      description: dict.landing.workflow.desc3,
    },
    {
      step: "4",
      title: dict.landing.workflow.title4,
      description: dict.landing.workflow.desc4,
    },
    {
      step: "5",
      title: dict.landing.workflow.title5,
      description: dict.landing.workflow.desc5,
    },
    {
      step: "6",
      title: dict.landing.workflow.title6,
      description: dict.landing.workflow.desc6,
    },
  ], [dict]);

  const trustedLogos = dict.landing.trustedLogos;

  const heroVideoSrc = "/landing-video.webm";
  const heroVideoPoster = "/sign-up.webp";

  return (
    <Box sx={{ 
      bgcolor: "background.default",
      color: "text.primary",
      minHeight: "100vh",
      transition: "background-color 0.3s ease",
      display: "flex",
      flexDirection: "column",
    }}>
      <Box
        sx={{
          position: "relative",
          flex: 1,
          overflow: "hidden",
          background: (theme) => theme.palette.mode === "dark" 
          ? "linear-gradient(135deg, #0f172a 0%, #1f2a44 45%, #111827 100%)"
          : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          "@keyframes pulse": {
            "0%": { transform: "scale(1)", opacity: 0.75 },
            "50%": { transform: "scale(1.08)", opacity: 1 },
            "100%": { transform: "scale(1)", opacity: 0.75 },
          },
          "@keyframes float": {
            "0%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-10px)" },
            "100%": { transform: "translateY(0px)" },
          },
          "@keyframes drift": {
            "0%": { transform: "rotate(0deg) scale(1)" },
            "50%": { transform: "rotate(3deg) scale(1.05)" },
            "100%": { transform: "rotate(0deg) scale(1)" },
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 20%, #3b82f659 0%, transparent 45%)," +
              "radial-gradient(circle at 80% 10%, #06b6d440 0%, transparent 50%)," +
              "radial-gradient(circle at 80% 80%, #6366f12e 0%, transparent 55%)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: 520,
            height: 520,
            top: { xs: -200, md: -260 },
            left: { xs: -160, md: -120 },
            background:
              "radial-gradient(circle, #38bdf859 0%, transparent 70%)",
            filter: "blur(80px)",
            opacity: 0.8,
            animation: "pulse 18s ease-in-out infinite",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: 360,
            height: 360,
            bottom: { xs: -120, md: -160 },
            right: { xs: -140, md: -120 },
            background:
              "radial-gradient(circle, #6366f159 0%, transparent 70%)",
            filter: "blur(90px)",
            opacity: 0.7,
            animation: "pulse 22s ease-in-out infinite",
            animationDelay: "-6s",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "18%",
            right: { xs: "8%", md: "16%" },
            width: 140,
            height: 140,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            animation: `${pulse} 2.2s ease-in-out infinite`,
          }}
        >
          <Image
            src="/logo.svg"
            alt="LogiTrack - AI Powered Logistics Management Platform"
            fill
            sizes="140px"
            style={{ objectFit: "contain" }}
            priority
          />
        </Box>

        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 1,
            pt: { xs: 10, md: 12 },
            pb: { xs: 10, md: 14 },
          }}
        >
          <Stack
            direction="row"
            spacing={8}
            alignItems="center"
            flexWrap="wrap"
            useFlexGap
          >
            <Box sx={{ width: { xs: "100%", md: "calc(50% - 32px)" } }}>
              <Stack spacing={4.5}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Chip
                    icon={<BoltRoundedIcon sx={{ color: "#38bdf8" }} />}
                    label={dict.landing.hero.badge}
                    sx={{
                      borderRadius: "999px",
                      px: 1.5,
                      py: 0.5,
                      bgcolor: theme.palette.mode === "dark" ? theme.palette.kpi.slateDark_alpha.main_70 : "action.hover",
                      border: `1px solid ${theme.palette.mode === "dark" ? theme.palette.kpi.cyan_alpha.main_30 : theme.palette.divider}`,
                      color: theme.palette.mode === "dark" ? theme.palette.kpi.lavender_alpha.main_90 : "text.primary",
                      fontWeight: 600,
                      letterSpacing: 0.5,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.mode === "dark" ? theme.palette.kpi.slateLight_alpha.main_65 : "text.secondary", letterSpacing: 1 }}
                  >
                    {dict.landing.hero.trusted}
                  </Typography>
                </Stack>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    lineHeight: 1.08,
                    background:
                      "linear-gradient(120deg, #f8fafc 0%, #38bdf8 55%, #a855f7 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    maxWidth: 520,
                  }}
                >
                  {dict.landing.hero.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.palette.mode === "dark" ? theme.palette.kpi.slateLight_alpha.main_90 : "text.secondary",
                    mb: 5,
                    lineHeight: 1.6,
                    maxWidth: "800px",
                    mx: "auto",
                    fontSize: 18,
                  }}
                >
                  {dict.landing.hero.description}
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button
                    variant="contained"
                    sx={{
                      textTransform: "none",
                      fontWeight: 700,
                      px: 4,
                      py: 1.6,
                      borderRadius: "999px",
                      background: "linear-gradient(135deg, #22d3ee, #2563eb)",
                      boxShadow: "0 18px 40px rgba(37, 99, 235, 0.45)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #0ea5e9, #1d4ed8)",
                      },
                    }}
                    endIcon={<PlayArrowRoundedIcon />}
                  >
                    {dict.landing.hero.discover}
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      textTransform: "none",
                      fontWeight: 700,
                      px: 4,
                      py: 1.6,
                      borderRadius: "999px",
                      borderColor: theme.palette.kpi.cyan_alpha.main_60,
                      color: "#38bdf8",
                      "&:hover": {
                        borderColor: "#38bdf8",
                        backgroundColor: theme.palette.kpi.cyan_alpha.main_08,
                      },
                    }}
                  >
                    {dict.landing.hero.demo}
                  </Button>
                </Stack>

                <Stack spacing={3} pt={2}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 3, sm: 4 }}
                    divider={
                      <Divider
                        flexItem
                        orientation="vertical"
                        sx={{
                          borderColor: theme.palette.kpi.slateGray_alpha.main_15,
                          display: { xs: "none", sm: "block" },
                        }}
                      />
                    }
                  >
                    <Stack spacing={0.5}>
                      <Typography variant="h4" component="h2" fontWeight={800}>
                        98%
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: theme.palette.mode === "dark" ? theme.palette.kpi.lavender_alpha.main_70 : "text.secondary" }}
                      >
                        {dict.landing.stats.onTime}
                      </Typography>
                    </Stack>
                    <Stack spacing={0.5}>
                      <Typography variant="h4" component="h2" fontWeight={800}>
                        12k+
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: theme.palette.mode === "dark" ? theme.palette.kpi.lavender_alpha.main_70 : "text.secondary" }}
                      >
                        {dict.landing.stats.monitored}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 2,
                      px: 2.5,
                      py: 1.5,
                      borderRadius: 999,
                      backgroundColor: theme.palette.mode === "dark" ? theme.palette.kpi.slateDark_alpha.main_65 : "background.paper",
                      border: `1px solid ${theme.palette.mode === "dark" ? theme.palette.kpi.cyan_alpha.main_20 : theme.palette.divider}`,
                      maxWidth: 360,
                      boxShadow: theme.palette.mode === "dark" ? "0 20px 45px rgba(15,23,42,0.35)" : "0 20px 45px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: "linear-gradient(120deg, #22d3ee, #6366f1)",
                        boxShadow: "0 0 0 6px rgba(56,189,248,0.15)",
                      }}
                    />
                    <Stack spacing={0.5}>
                      <Typography
                        variant="body2"
                        sx={{ color: theme.palette.mode === "dark" ? theme.palette.kpi.slateLight_alpha.main_85 : "text.primary", fontWeight: 600 }}
                      >
                        {dict.landing.stats.live}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: theme.palette.mode === "dark" ? theme.palette.kpi.slateGray_alpha.main_75 : "text.secondary" }}
                      >
                        {dict.landing.stats.updateFreq}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Stack>
            </Box>

            <Box sx={{ width: { xs: "100%", md: "calc(50% - 32px)" } }}>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 6,
                  p: { xs: 2, md: 3 },
                  background: theme.palette.kpi.slateDeep_alpha.main_60,
                  border: `1px solid ${theme.palette.kpi.cyan_alpha.main_24}`,
                  boxShadow: "0 50px 140px rgba(15, 23, 42, 0.55)",
                  backdropFilter: "blur(18px)",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 6,
                    background:
                      "radial-gradient(circle at 25% 20%, rgba(56,189,248,0.25) 0%, transparent 45%)," +
                      "radial-gradient(circle at 80% 80%, rgba(37,99,235,0.25) 0%, transparent 55%)",
                  }}
                />

                <Box
                  sx={{
                    position: "relative",
                    borderRadius: 5,
                    overflow: "hidden",
                    border: `1px solid ${theme.palette.kpi.cyan_alpha.main_35}`,
                    boxShadow: "0 40px 110px rgba(8,12,24,0.75)",
                  }}
                >
                  <Box
                    component="video"
                    src={heroVideoSrc}
                    poster={heroVideoPoster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "block",
                      objectFit: "cover",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(160deg, rgba(15,23,42,0) 30%, rgba(15,23,42,0.55) 100%)",
                    }}
                  />
                </Box>

                <Stack
                  spacing={2.5}
                  direction={{ xs: "column", sm: "row" }}
                  alignItems={{ xs: "stretch", sm: "center" }}
                  justifyContent="space-between"
                  mt={3}
                >
                  <Stack direction="row" spacing={2}>
                    {[
                      { label: dict.landing.hero.metrics.activeRoutes, value: "128" },
                      { label: dict.landing.hero.metrics.vehicles, value: "542" },
                    ].map((metric) => (
                      <Box
                        key={metric.label}
                        sx={{
                          minWidth: 140,
                          px: 2.5,
                          py: 2,
                          borderRadius: 3,
                          backgroundColor: theme.palette.mode === "dark" ? theme.palette.kpi.slateDeep_alpha.main_60 : "background.paper",
                          border: `1px solid ${theme.palette.mode === "dark" ? theme.palette.kpi.cyan_alpha.main_20 : theme.palette.divider}`,
                          boxShadow: theme.palette.mode === "dark" ? "0 18px 48px rgba(8, 12, 24, 0.55)" : "0 18px 48px rgba(0, 0, 0, 0.05)",
                          animation: "float 14s ease-in-out infinite",
                        }}
                      >
                        <Typography variant="h6" fontWeight={700}>
                          {metric.value}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: theme.palette.mode === "dark" ? theme.palette.kpi.slateLight_alpha.main_75 : "text.secondary" }}
                        >
                          {metric.label}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                  <Box
                    sx={{
                      px: 3,
                      py: 2,
                      borderRadius: 3,
                      background: theme.palette.mode === "dark" ? theme.palette.kpi.slateDark_alpha.main_65 : "background.paper",
                      border: `1px solid ${theme.palette.mode === "dark" ? theme.palette.kpi.cyan_alpha.main_22 : theme.palette.divider}`,
                      boxShadow: theme.palette.mode === "dark" ? "0 18px 48px rgba(8, 12, 24, 0.5)" : "0 18px 48px rgba(0, 0, 0, 0.05)",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      animation: "float 16s ease-in-out infinite",
                      animationDelay: "-4s",
                    }}
                  >
                    <TrendingUpRoundedIcon sx={{ color: "#38bdf8" }} />
                    <Stack spacing={0.5}>
                      <Typography
                        variant="body2"
                        sx={{ color: theme.palette.mode === "dark" ? theme.palette.kpi.lavender_alpha.main_85 : "text.primary", fontWeight: 600 }}
                      >
                        {dict.landing.hero.metrics.slaStability}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: theme.palette.mode === "dark" ? theme.palette.kpi.slateGray_alpha.main_75 : "text.secondary" }}
                      >
                        {dict.landing.hero.metrics.slaTrend}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>

                <Box
                  sx={{
                    position: "absolute",
                    top: { xs: -26, md: -32 },
                    right: { xs: 16, md: -24 },
                    px: 3,
                    py: 2.2,
                    borderRadius: 4,
                    background: theme.palette.mode === "dark" ? theme.palette.kpi.slateDeep_alpha.main_90 : "background.paper",
                    border: `1px solid ${theme.palette.mode === "dark" ? theme.palette.kpi.cyan_alpha.main_35 : theme.palette.divider}`,
                    boxShadow: theme.palette.mode === "dark" ? "0 25px 70px rgba(8, 12, 24, 0.55)" : "0 25px 70px rgba(0, 0, 0, 0.05)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    animation: "float 12s ease-in-out infinite",
                    animationDelay: "-2s",
                  }}
                >
                  <ScheduleRoundedIcon sx={{ color: "#38bdf8" }} />
                  <Stack spacing={0.5}>
                    <Typography
                      variant="body2"
                      sx={{ color: theme.palette.kpi.lavender_alpha.main_85, fontWeight: 600 }}
                    >
                      {dict.landing.hero.metrics.predictiveEtaReady}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: theme.palette.kpi.slateGray_alpha.main_75 }}
                    >
                      {dict.landing.hero.metrics.lastUpdate}
                    </Typography>
                  </Stack>
                </Box>
              </Box>
            </Box>
          </Stack>
        </Container>
      </Box>

      <Box sx={{ 
        bgcolor: theme.palette.mode === "dark" ? "#0b1120" : "background.paper",
        borderTop: `1px solid ${theme.palette.divider}`,
        borderBottom: `1px solid ${theme.palette.divider}`,
        py: 8 
      }}>
        <Container maxWidth="lg">
          <Typography
            variant="overline"
            display="block"
            textAlign="center"
            sx={{
              color: theme.palette.kpi.cyan_alpha.main_80,
              fontWeight: 600,
              letterSpacing: 4,
            }}
          >
            {dict.landing.trusted}
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={4}
            justifyContent="center"
            alignItems="center"
            mt={4}
          >
            {trustedLogos.map((logo) => (
              <Typography
                key={logo}
                variant="subtitle1"
                sx={{
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  color: theme.palette.kpi.lavender_alpha.main_65,
                }}
              >
                {logo}
              </Typography>
            ))}
          </Stack>
        </Container>
      </Box>

      <Box sx={{ 
        bgcolor: theme.palette.mode === "dark" ? "#0f172a" : "background.default", 
        py: 12 
      }}>
        <Container maxWidth="lg">
          <Stack direction="row" spacing={8} flexWrap="wrap" useFlexGap>
            <Box sx={{ width: { xs: "100%", md: "calc(50% - 32px)" } }}>
              <Stack spacing={3}>
                <Typography
                  variant="overline"
                  sx={{ color: "#38bdf8", letterSpacing: 3 }}
                >
                  {dict.landing.features.overline}
                </Typography>
                <Typography variant="h3" component="h2" fontWeight={800}>
                  {dict.landing.features.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: theme.palette.mode === "dark" ? theme.palette.kpi.slateLight_alpha.main_85 : "text.secondary" }}
                >
                  {dict.landing.features.description}
                </Typography>
              </Stack>
            </Box>
            <Box sx={{ width: { xs: "100%", md: "calc(50% - 32px)" } }}>
              <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
                {featureCards.map((card) => (
                  <Box
                    key={card.title}
                    sx={{ width: { xs: "100%", sm: "calc(50% - 12px)" } }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        p: 3,
                        borderRadius: 4,
                        backgroundColor: theme.palette.mode === "dark" ? theme.palette.kpi.slateDark_alpha.main_65 : "background.paper",
                        border: `1px solid ${theme.palette.mode === "dark" ? theme.palette.kpi.cyan_alpha.main_16 : theme.palette.divider}`,
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.45)",
                        },
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={700} mb={1.5}>
                        {card.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: theme.palette.mode === "dark" ? theme.palette.kpi.lavender_alpha.main_75 : "text.secondary" }}
                      >
                        {card.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>

      <Box sx={{ 
        bgcolor: theme.palette.mode === "dark" ? "#0b1120" : "background.paper", 
        py: 12 
      }}>
        <Container maxWidth="lg">
          <Stack direction="row" spacing={6} flexWrap="wrap" useFlexGap>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 6,
              }}
            >
              {workflow.map((item) => (
                <Box
                  key={item.step}
                  sx={{
                    borderRadius: 4,
                    p: 4,
                    backgroundColor: theme.palette.mode === "dark" ? theme.palette.kpi.slateDark_alpha.main_60 : "background.paper",
                    border: `1px solid ${theme.palette.mode === "dark" ? theme.palette.kpi.cyan_alpha.main_16 : theme.palette.divider}`,
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 24px 60px rgba(15, 23, 42, 0.45)",
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: theme.palette.kpi.cyan_alpha.main_85,
                      fontWeight: 700,
                      mb: 1,
                    }}
                  >
                    {dict.landing.workflow.step} {item.step}
                  </Typography>
                  <Typography variant="h5" fontWeight={700} mb={1.5}>
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.mode === "dark" ? theme.palette.kpi.slateLight_alpha.main_80 : "text.secondary" }}
                  >
                    {item.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Stack>
        </Container>
      </Box>

      <Box sx={{ 
        bgcolor: theme.palette.mode === "dark" ? "#0f172a" : "background.default", 
        py: 10 
      }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={4}
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack spacing={2}>
              <Typography variant="h4" component="h2" fontWeight={800}>
                {dict.landing.cta.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: theme.palette.mode === "dark" ? theme.palette.kpi.slateLight_alpha.main_85 : "text.secondary" }}
              >
                {dict.landing.cta.description}
              </Typography>
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                variant="contained"
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: "999px",
                  background: "linear-gradient(135deg, #22d3ee, #2563eb)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #0ea5e9, #1d4ed8)",
                  },
                }}
              >
                {dict.landing.cta.trial}
              </Button>
              <Button
                variant="outlined"
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: "999px",
                  borderColor: theme.palette.kpi.cyan_alpha.main_60,
                  color: "#38bdf8",
                  "&:hover": {
                    borderColor: "#38bdf8",
                    backgroundColor: theme.palette.kpi.cyan_alpha.main_08,
                  },
                }}
              >
                {dict.landing.cta.sales}
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Box sx={{ 
        bgcolor: theme.palette.mode === "dark" ? "#0b1120" : "background.paper",
        borderTop: `1px solid ${theme.palette.divider}`,
        py: 6 
      }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={4}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="body2"
              sx={{ color: theme.palette.kpi.slateGray_alpha.main_70, fontWeight: 500 }}
            >
              {(dict.footer?.copyright || "© {year} LogiTrack. All rights reserved.").replace("{year}", new Date().getFullYear().toString())}
            </Typography>
            <Stack direction="row" spacing={3}>
              {[
                dict.footer?.privacyPolicy || "Privacy",
                dict.footer?.termsOfService || "Terms",
                dict.footer?.security || "Security",
                dict.footer?.status || "Status",
              ].map((link) => (
                <Typography
                  key={link}
                  variant="caption"
                  sx={{
                    color: theme.palette.kpi.slateGray_alpha.main_60,
                    cursor: "pointer",
                    "&:hover": { color: "#38bdf8" },
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
