"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  Grid,
  Paper,
} from "@mui/material";
import Link from "next/link";
import { useLanguage } from "@/app/lib/language/DictionaryContext";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import SensorsIcon from "@mui/icons-material/Sensors";
import SecurityIcon from "@mui/icons-material/Security";
import ShieldIcon from "@mui/icons-material/Shield";
import SpeedIcon from "@mui/icons-material/Speed";
import DeviceHubIcon from "@mui/icons-material/DeviceHub";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";

interface PlatformPageClientProps {
  pageKey:
    | "globalTrackingPage"
    | "routeIntelligencePage"
    | "telemetryHubPage"
    | "securityCenterPage";
}

export default function PlatformPageClient({
  pageKey,
}: PlatformPageClientProps) {
  const { lang, dict } = useLanguage();
  const pDict = dict.landing[pageKey];

  // Telemetry simulation states
  const [speed, setSpeed] = useState(72);
  const [fuel, setFuel] = useState(84);
  const [temp, setTemp] = useState(19.5);

  // Security console logs state
  const [logs, setLogs] = useState<string[]>([
    "INITIALIZING SECURITY ENVELOPE...",
    "ESTABLISHING CRYPTOGRAPHIC TUNNELS...",
    "ALL AUDIT LOG NODES SYNCED.",
  ]);

  useEffect(() => {
    if (pageKey === "telemetryHubPage") {
      const interval = setInterval(() => {
        setSpeed((prev) =>
          Math.max(50, Math.min(120, prev + Math.floor(Math.random() * 7) - 3))
        );
        setFuel((prev) => Math.max(10, Math.min(100, prev - 0.05)));
        setTemp((prev) =>
          Math.max(15, Math.min(25, prev + (Math.random() * 0.4 - 0.2)))
        );
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [pageKey]);

  useEffect(() => {
    if (pageKey === "securityCenterPage") {
      const logPool = [
        "VERIFYING SHA-256 INTEGRITY CHECK...",
        "TRAFFIC SECURED VIA TLS 1.3 HANDSHAKE",
        "ATTEMPTED ACCESS DETECTED ON PORT 8080 -> BLOCKED BY IPS",
        "ENCRYPTING INBOUND TELEMETRY PAYLOADS...",
        "ROTATING COMPLIANCE KEYS FOR REGIONAL STORAGE...",
        "AUDIT LOG SEAL COMPLETED FOR NODE-" +
          Math.floor(Math.random() * 9000 + 1000),
      ];
      const interval = setInterval(() => {
        const randomLog = logPool[Math.floor(Math.random() * logPool.length)];
        setLogs((prev) => [
          ...prev.slice(-6),
          `[${new Date().toLocaleTimeString()}] ${randomLog}`,
        ]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [pageKey]);

  if (!pDict) {
    return (
      <Box sx={{ p: 10, color: "white", bgcolor: "black" }}>
        Error: {pageKey} dictionary configuration is missing.
      </Box>
    );
  }

  // Choose icon based on pageKey
  const getHeroIcon = () => {
    switch (pageKey) {
      case "globalTrackingPage":
        return <GpsFixedIcon sx={{ fontSize: 50, color: "#00f2ff" }} />;
      case "routeIntelligencePage":
        return <AltRouteIcon sx={{ fontSize: 50, color: "#6366f1" }} />;
      case "telemetryHubPage":
        return <SensorsIcon sx={{ fontSize: 50, color: "#10b981" }} />;
      case "securityCenterPage":
        return <SecurityIcon sx={{ fontSize: 50, color: "#ef4444" }} />;
    }
  };

  // Render Page Widget
  const renderInteractiveWidget = () => {
    switch (pageKey) {
      case "globalTrackingPage": {
        const trackingDict = pDict as typeof dict.landing.globalTrackingPage;
        return (
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: 320,
              bgcolor: "rgba(10, 14, 20, 0.6)",
              borderRadius: "16px",
              border: "1px solid rgba(0, 242, 255, 0.15)",
              backdropFilter: "blur(12px)",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Pulsating Radar Lines */}
            <Box
              sx={{
                position: "absolute",
                width: 250,
                height: 250,
                borderRadius: "50%",
                border: "1px dashed rgba(0, 242, 255, 0.2)",
                animation: "pulse 8s linear infinite",
                "@keyframes pulse": {
                  "0%": { transform: "rotate(0deg) scale(0.8)", opacity: 0.2 },
                  "50%": { opacity: 0.6 },
                  "100%": {
                    transform: "rotate(360deg) scale(1.2)",
                    opacity: 0.2,
                  },
                },
              }}
            />
            {/* Visual Route Lines */}
            <svg
              width="80%"
              height="80%"
              style={{ position: "absolute", zIndex: 1 }}
            >
              <defs>
                <linearGradient
                  id="lineGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#00f2ff" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <path
                d="M 50 150 Q 150 50 250 160 T 450 80"
                fill="none"
                stroke="url(#lineGrad)"
                strokeWidth="3"
                strokeDasharray="8 4"
              />
              {/* Animated Dot along path */}
              <circle r="6" fill="#00f2ff">
                <animateMotion
                  dur="6s"
                  repeatCount="indefinite"
                  path="M 50 150 Q 150 50 250 160 T 450 80"
                />
              </circle>
              {/* Anchors */}
              <circle cx="50" cy="150" r="5" fill="#6366f1" />
              <circle cx="250" cy="160" r="5" fill="#6366f1" />
              <circle cx="450" cy="80" r="5" fill="#00f2ff" />
            </svg>
            <Stack
              direction="row"
              spacing={2}
              sx={{ position: "absolute", bottom: 16, left: 16, zIndex: 2 }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#00f2ff",
                  alignSelf: "center",
                  boxShadow: "0 0 8px #00f2ff",
                }}
              />
              <Typography
                variant="caption"
                sx={{ color: "rgba(255, 255, 255, 0.6)" }}
              >
                {trackingDict.widget?.status ||
                  "LIVE SATELLITE FEED ACTIVE // SHIPMENT COORDINATES MAPPED"}
              </Typography>
            </Stack>
          </Box>
        );
      }
      case "routeIntelligencePage": {
        const routeDict = pDict as typeof dict.landing.routeIntelligencePage;
        return (
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: 320,
              bgcolor: "rgba(10, 14, 20, 0.6)",
              borderRadius: "16px",
              border: "1px solid rgba(99, 102, 241, 0.15)",
              backdropFilter: "blur(12px)",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="90%" height="80%" style={{ position: "absolute" }}>
              {/* Standart Route (Red, Congested) */}
              <path
                d="M 40 180 C 120 220, 220 220, 300 180 T 460 60"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                opacity="0.5"
              />
              <text
                x="120"
                y="220"
                fill="#ef4444"
                fontSize="10"
                fontWeight="bold"
              >
                {routeDict.widget?.standardRoute || "STANDARD ROUTE (DELAYED)"}
              </text>
              {/* AI Optimized Route (Green, Fast) */}
              <path
                d="M 40 180 Q 250 80 460 60"
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
              />
              <text
                x="200"
                y="110"
                fill="#10b981"
                fontSize="10"
                fontWeight="bold"
              >
                {routeDict.widget?.aiOptimized ||
                  "AI OPTIMIZED ROUTE (18% FASTER)"}
              </text>
              {/* Animated pulse on green path */}
              <circle r="5" fill="#10b981">
                <animateMotion
                  dur="3s"
                  repeatCount="indefinite"
                  path="M 40 180 Q 250 80 460 60"
                />
              </circle>
              {/* Nodes */}
              <circle cx="40" cy="180" r="6" fill="#fff" />
              <circle cx="460" cy="60" r="6" fill="#00f2ff" />
            </svg>
          </Box>
        );
      }
      case "telemetryHubPage": {
        const telemetryDict = pDict as typeof dict.landing.telemetryHubPage;
        return (
          <Grid container spacing={3} sx={{ p: 2 }}>
            {[
              {
                label: telemetryDict.widget?.avgSpeed || "Average Speed",
                value: `${speed} ${telemetryDict.widget?.avgSpeedUnit || "km/h"}`,
                icon: <SpeedIcon sx={{ color: "#10b981" }} />,
              },
              {
                label: telemetryDict.widget?.fuelLevel || "Fuel Level",
                value:
                  lang === "tr" ? `%${fuel.toFixed(1)}` : `${fuel.toFixed(1)}%`,
                icon: <OfflineBoltIcon sx={{ color: "#f59e0b" }} />,
              },
              {
                label: telemetryDict.widget?.cargoTemp || "Cargo Temp",
                value: `${temp.toFixed(1)} °C`,
                icon: <DeviceHubIcon sx={{ color: "#3b82f6" }} />,
              },
            ].map((metric, idx) => (
              <Grid size={{ xs: 4 }} key={idx}>
                <Paper
                  sx={{
                    p: 3,
                    bgcolor: "rgba(10, 14, 20, 0.4)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    borderRadius: "12px",
                    textAlign: "center",
                  }}
                >
                  <Box sx={{ mb: 1 }}>{metric.icon}</Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255, 255, 255, 0.4)" }}
                  >
                    {metric.label}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 800, color: "#fff", mt: 1 }}
                  >
                    {metric.value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        );
      }
      case "securityCenterPage":
        return (
          <Box
            sx={{
              width: "100%",
              height: 320,
              bgcolor: "#020617",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              borderRadius: "16px",
              p: 3,
              fontFamily: "monospace",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 0 20px rgba(239, 68, 68, 0.05)",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ borderBottom: "1px solid rgba(239, 68, 68, 0.2)", pb: 1 }}
            >
              <Typography
                variant="body2"
                sx={{ color: "#ef4444", fontWeight: "bold" }}
              >
                SECURE CONSOLE // ACTIVE SHIELD
              </Typography>
              <ShieldIcon sx={{ color: "#ef4444", fontSize: 20 }} />
            </Stack>
            <Box sx={{ flexGrow: 1, py: 2, overflow: "hidden" }}>
              {logs.map((log, idx) => (
                <Typography
                  key={idx}
                  variant="caption"
                  sx={{ display: "block", color: "#10b981", mb: 0.5 }}
                >
                  {log}
                </Typography>
              ))}
            </Box>
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,0.3)" }}
            >
              CRYPTOGRAPHY LEVEL: AES-256-GCM SSLV3
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#030712",
        color: "#f3f4f6",
        position: "relative",
        overflow: "hidden",
        pt: 15,
        pb: 10,
      }}
    >
      {/* Background Gradients */}
      <Box
        sx={{
          position: "absolute",
          top: "-15%",
          left: "-10%",
          width: "50%",
          height: "60%",
          background:
            "radial-gradient(circle, rgba(0, 242, 255, 0.1) 0%, transparent 70%)",
          filter: "blur(140px)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-15%",
          right: "-10%",
          width: "50%",
          height: "60%",
          background:
            "radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)",
          filter: "blur(140px)",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Hero Section */}
        <Grid container spacing={6} alignItems="center" sx={{ mb: 15 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "12px",
                    bgcolor: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  {getHeroIcon()}
                </Box>
                <Typography
                  variant="overline"
                  sx={{
                    color: "#00f2ff",
                    fontWeight: 700,
                    letterSpacing: 2,
                  }}
                >
                  {pDict.overline}
                </Typography>
              </Stack>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  lineHeight: 1.1,
                  background: "linear-gradient(to right, #fff, #94a3b8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {pDict.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: "1.1rem",
                  lineHeight: 1.7,
                }}
              >
                {pDict.subtitle}
              </Typography>
              <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                <Button
                  component={Link}
                  href="/auth/sign-up"
                  variant="contained"
                  sx={{
                    bgcolor: "#00f2ff",
                    color: "#000",
                    fontWeight: 700,
                    borderRadius: "12px",
                    px: 4,
                    py: 1.5,
                    "&:hover": { bgcolor: "#00d2df" },
                  }}
                >
                  {pDict.cta.button}
                </Button>
              </Stack>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>{renderInteractiveWidget()}</Grid>
        </Grid>

        {/* Feature Highlights Grid */}
        <Box sx={{ mb: 15 }}>
          <Typography
            variant="h4"
            fontWeight={900}
            textAlign="center"
            sx={{
              mb: 8,
              background: "linear-gradient(to right, #fff, #94a3b8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {pDict.features.title}
          </Typography>
          <Grid container spacing={4}>
            {pDict.features.items.map(
              (
                feature: { title: string; description: string },
                idx: number
              ) => (
                <Grid size={{ xs: 12, md: 6 }} key={idx}>
                  <Box
                    sx={{
                      p: 4,
                      height: "100%",
                      borderRadius: "16px",
                      bgcolor: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.04)",
                        borderColor: "rgba(0, 242, 255, 0.2)",
                        transform: "translateY(-4px)",
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      color="#fff"
                      mb={2}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255, 255, 255, 0.5)",
                        lineHeight: 1.7,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>
                </Grid>
              )
            )}
          </Grid>
        </Box>

        {/* Call to Action Banner */}
        <Paper
          sx={{
            p: { xs: 6, md: 10 },
            borderRadius: "24px",
            background:
              "linear-gradient(135deg, rgba(0, 242, 255, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            textAlign: "center",
          }}
        >
          <Typography variant="h3" fontWeight={900} mb={3}>
            {pDict.cta.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "rgba(255,255,255,0.6)",
              mb: 5,
              maxWidth: 600,
              mx: "auto",
            }}
          >
            {pDict.cta.subtitle}
          </Typography>
          <Button
            component={Link}
            href="/auth/sign-up"
            variant="outlined"
            sx={{
              color: "#00f2ff",
              borderColor: "rgba(0, 242, 255, 0.3)",
              borderRadius: "12px",
              px: 5,
              py: 1.5,
              fontWeight: 700,
              "&:hover": {
                borderColor: "#00f2ff",
                bgcolor: "rgba(0, 242, 255, 0.05)",
              },
            }}
          >
            {pDict.cta.button}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
