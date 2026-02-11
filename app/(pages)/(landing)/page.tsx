"use client";

import Image from "next/image";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import { alpha, keyframes } from "@mui/system";
import LandingHeaderAuth from "@/app/components/landing/LandingHeaderAuth";

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 10px ${alpha("#38bdf8", 0.25)}, 0 0 20px ${alpha(
  "#38bdf8",
  0.15
)};
    opacity: 1;
  }
  25% {
    transform: scale(1.08);
    box-shadow: 0 0 25px ${alpha("#38bdf8", 0.4)}, 0 0 45px ${alpha(
  "#38bdf8",
  0.25
)};
    opacity: 0.95;
  }
  50% {
    transform: scale(1.15);
    box-shadow: 0 0 40px ${alpha("#38bdf8", 0.6)}, 0 0 70px ${alpha(
  "#38bdf8",
  0.35
)};
    opacity: 1;
  }
  75% {
    transform: scale(1.08);
    box-shadow: 0 0 25px ${alpha("#38bdf8", 0.4)}, 0 0 45px ${alpha(
  "#38bdf8",
  0.25
)};
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 10px ${alpha("#38bdf8", 0.25)}, 0 0 20px ${alpha(
  "#38bdf8",
  0.15
)};
    opacity: 1;
  }
`;

const featureCards = [
  {
    title: "Smart Route Planning",
    description:
      "Optimize deliveries with live traffic and warehouse capacity data to cut delays.",
  },
  {
    title: "Predictive ETAs",
    description:
      "Accurately forecast arrival times with AI-powered scheduling models.",
  },
  {
    title: "Driver Performance",
    description:
      "Track utilization, safety metrics, and compliance from a unified dashboard.",
  },
  {
    title: "Exception Alerts",
    description:
      "React instantly to disruptions with automated notifications and workflows.",
  },
];

const workflow = [
  {
    step: "1",
    title: "Connect Your Fleet",
    description:
      "Integrate telematics, TMS, and WMS data sources in minutes with prebuilt connectors.",
  },
  {
    step: "2",
    title: "Visualize Operations",
    description:
      "Monitor every shipment and asset in real time with adaptive dashboards and heatmaps.",
  },
  {
    step: "3",
    title: "Automate Decisions",
    description:
      "Trigger proactive workflows, alerts, and customer updates before issues escalate.",
  },
  {
    step: "4",
    title: "Optimize Routes",
    description:
      "Leverage AI-driven route optimization to minimize fuel costs, idle time, and delays.",
  },
  {
    step: "5",
    title: "Analyze Performance",
    description:
      "Evaluate KPIs such as delivery accuracy, driver efficiency, and cost per shipment with analytics tools.",
  },
  {
    step: "6",
    title: "Scale Seamlessly",
    description:
      "Expand your logistics network confidently with modular integrations and scalable infrastructure.",
  },
];

const trustedLogos = [
  "Global Cargo",
  "Oceanic",
  "Alpha Freight",
  "Continental",
  "ExpressWay",
];

const heroVideoSrc = "/landing-hero.mp4";
const heroVideoPoster = "/sign-up.webp";

export default function LandingPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#0f172a",
        color: "#f1f5f9",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          position: "relative",
          flex: 1,
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1f2a44 45%, #111827 100%)",
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
              "radial-gradient(circle at 20% 20%, rgba(59,130,246,0.35) 0%, transparent 45%)," +
              "radial-gradient(circle at 80% 10%, rgba(6,182,212,0.25) 0%, transparent 50%)," +
              "radial-gradient(circle at 80% 80%, rgba(99,102,241,0.18) 0%, transparent 55%)",
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
              "radial-gradient(circle, rgba(56,189,248,0.35) 0%, transparent 70%)",
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
              "radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)",
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
            src="/logo1-vector.png"
            alt="Logo"
            fill
            sizes="140px"
            style={{ objectFit: "contain" }}
            priority
          />
        </Box>

        <AppBar
          position="static"
          elevation={0}
          color="transparent"
          sx={{
            backdropFilter: "blur(16px)",
            backgroundColor: alpha("#0f172a", 0.6),
            borderBottom: `1px solid ${alpha("#cbd5f5", 0.08)}`,
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between", py: 3 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #38bdf8, #6366f1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  src="/logo-beyaz-vector.png"
                  alt="LogiTrack Logo"
                  width={28}
                  height={28}
                  priority
                />
              </Box>
              <Typography variant="h6" fontWeight={700} letterSpacing={1.5}>
                LOGI-TRACK
              </Typography>
            </Stack>

            <Stack direction="row" spacing={4} alignItems="center">
              {["Features", "Testimonials", "Pricing", "About", "Blog"].map(
                (item) => (
                  <Typography
                    key={item}
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      cursor: "pointer",
                      color: alpha("#e2e8f0", 0.88),
                      transition: "color 0.2s ease",
                      "&:hover": { color: "#38bdf8" },
                    }}
                  >
                    {item}
                  </Typography>
                )
              )}
            </Stack>

            <LandingHeaderAuth />
          </Toolbar>
        </AppBar>

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
                    label="AI logistics control tower"
                    sx={{
                      borderRadius: "999px",
                      px: 1.5,
                      py: 0.5,
                      bgcolor: alpha("#1e293b", 0.7),
                      border: `1px solid ${alpha("#38bdf8", 0.3)}`,
                      color: alpha("#e2e8f0", 0.9),
                      fontWeight: 600,
                      letterSpacing: 0.5,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: alpha("#cbd5f5", 0.65), letterSpacing: 1 }}
                  >
                    Trusted worldwide
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
                  Orchestrate every shipment with live intelligence.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: alpha("#cbd5f5", 0.9),
                    fontSize: 18,
                    maxWidth: 520,
                  }}
                >
                  Synchronize dispatch, fleets, and customer promises in one
                  immersive dashboard. Forecast issues before they happen and
                  keep routes optimized with predictive AI.
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
                    Discover Now
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      textTransform: "none",
                      fontWeight: 700,
                      px: 4,
                      py: 1.6,
                      borderRadius: "999px",
                      borderColor: alpha("#38bdf8", 0.6),
                      color: "#38bdf8",
                      "&:hover": {
                        borderColor: "#38bdf8",
                        backgroundColor: alpha("#38bdf8", 0.08),
                      },
                    }}
                  >
                    Request a Demo
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
                          borderColor: alpha("#94a3b8", 0.15),
                          display: { xs: "none", sm: "block" },
                        }}
                      />
                    }
                  >
                    <Stack spacing={0.5}>
                      <Typography variant="h3" fontWeight={800}>
                        98%
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: alpha("#e2e8f0", 0.7) }}
                      >
                        On-time delivery rate
                      </Typography>
                    </Stack>
                    <Stack spacing={0.5}>
                      <Typography variant="h3" fontWeight={800}>
                        12k+
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: alpha("#e2e8f0", 0.7) }}
                      >
                        Shipments monitored
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
                      backgroundColor: alpha("#1e293b", 0.65),
                      border: `1px solid ${alpha("#38bdf8", 0.2)}`,
                      maxWidth: 360,
                      boxShadow: "0 20px 45px rgba(15,23,42,0.35)",
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
                        sx={{ color: alpha("#cbd5f5", 0.85), fontWeight: 600 }}
                      >
                        Live optimization enabled
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: alpha("#94a3b8", 0.75) }}
                      >
                        Routing updates every 15 seconds
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
                  background: alpha("#0f172a", 0.6),
                  border: `1px solid ${alpha("#38bdf8", 0.24)}`,
                  boxShadow: "0 50px 140px rgba(15, 23, 42, 0.55)",
                  backdropFilter: "blur(18px)",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
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
                    border: `1px solid ${alpha("#38bdf8", 0.35)}`,
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
                      { label: "Active Routes", value: "128" },
                      { label: "Vehicles", value: "542" },
                    ].map((metric) => (
                      <Box
                        key={metric.label}
                        sx={{
                          minWidth: 140,
                          px: 2.5,
                          py: 2,
                          borderRadius: 3,
                          backgroundColor: alpha("#0f172a", 0.6),
                          border: `1px solid ${alpha("#38bdf8", 0.2)}`,
                          boxShadow: "0 18px 48px rgba(8, 12, 24, 0.55)",
                          animation: "float 14s ease-in-out infinite",
                        }}
                      >
                        <Typography variant="h6" fontWeight={700}>
                          {metric.value}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: alpha("#cbd5f5", 0.75) }}
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
                      background: alpha("#1e293b", 0.65),
                      border: `1px solid ${alpha("#38bdf8", 0.22)}`,
                      boxShadow: "0 18px 48px rgba(8, 12, 24, 0.5)",
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
                        sx={{ color: alpha("#e2e8f0", 0.85), fontWeight: 600 }}
                      >
                        SLA stability
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: alpha("#94a3b8", 0.75) }}
                      >
                        +14% in the last 30 days
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
                    background: alpha("#0f172a", 0.9),
                    border: `1px solid ${alpha("#38bdf8", 0.35)}`,
                    boxShadow: "0 25px 70px rgba(8, 12, 24, 0.55)",
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
                      sx={{ color: alpha("#e2e8f0", 0.85), fontWeight: 600 }}
                    >
                      Predictive ETA ready
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: alpha("#94a3b8", 0.75) }}
                    >
                      Last update 45 seconds ago
                    </Typography>
                  </Stack>
                </Box>
              </Box>
            </Box>
          </Stack>
        </Container>
      </Box>

      <Box sx={{ bgcolor: "#0b1120", py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="overline"
            display="block"
            textAlign="center"
            sx={{
              color: alpha("#38bdf8", 0.8),
              fontWeight: 600,
              letterSpacing: 4,
            }}
          >
            Trusted by industry leaders
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
                  color: alpha("#e2e8f0", 0.65),
                }}
              >
                {logo}
              </Typography>
            ))}
          </Stack>
        </Container>
      </Box>

      <Box sx={{ bgcolor: "#0f172a", py: 12 }}>
        <Container maxWidth="lg">
          <Stack direction="row" spacing={8} flexWrap="wrap" useFlexGap>
            <Box sx={{ width: { xs: "100%", md: "calc(50% - 32px)" } }}>
              <Stack spacing={3}>
                <Typography
                  variant="overline"
                  sx={{ color: "#38bdf8", letterSpacing: 3 }}
                >
                  Core features
                </Typography>
                <Typography variant="h3" fontWeight={800}>
                  Everything you need for end-to-end visibility.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: alpha("#cbd5f5", 0.85) }}
                >
                  Coordinate dispatch, drivers, and customer updates with
                  intelligent workflows designed for complex logistics
                  operations.
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
                        backgroundColor: alpha("#1e293b", 0.65),
                        border: `1px solid ${alpha("#38bdf8", 0.16)}`,
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
                        sx={{ color: alpha("#e2e8f0", 0.75) }}
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

      <Box sx={{ bgcolor: "#0b1120", py: 12 }}>
        <Container maxWidth="lg">
          <Stack direction="row" spacing={6} flexWrap="wrap" useFlexGap>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)", // 3 sütun
                gap: 6,
              }}
            >
              {workflow.map((item) => (
                <Box
                  key={item.step}
                  sx={{
                    borderRadius: 4,
                    p: 4,
                    backgroundColor: alpha("#1e293b", 0.6),
                    border: `1px solid ${alpha("#38bdf8", 0.16)}`,
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
                      color: alpha("#38bdf8", 0.85),
                      fontWeight: 700,
                      mb: 1,
                    }}
                  >
                    Step {item.step}
                  </Typography>
                  <Typography variant="h5" fontWeight={700} mb={1.5}>
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: alpha("#cbd5f5", 0.8) }}
                  >
                    {item.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Stack>
        </Container>
      </Box>

      <Box sx={{ bgcolor: "#0f172a", py: 10 }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={4}
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack spacing={2}>
              <Typography variant="h4" fontWeight={800}>
                Ready to modernize your logistics operations?
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: alpha("#cbd5f5", 0.85) }}
              >
                Partner with Logi-Track to unlock real-time visibility,
                predictive intelligence, and exceptional customer experiences.
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
                Start Free Trial
              </Button>
              <Button
                variant="outlined"
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: "999px",
                  borderColor: alpha("#38bdf8", 0.6),
                  color: "#38bdf8",
                  "&:hover": {
                    borderColor: "#38bdf8",
                    backgroundColor: alpha("#38bdf8", 0.08),
                  },
                }}
              >
                Talk to Sales
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Box sx={{ bgcolor: "#0b1120", py: 6 }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="body2" sx={{ color: alpha("#e2e8f0", 0.6) }}>
              © {new Date().getFullYear()} Logi-Track. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={3}>
              {"Privacy Policy Terms Support".split(" ").map((item) => (
                <Typography
                  key={item}
                  variant="body2"
                  sx={{ color: alpha("#e2e8f0", 0.65) }}
                >
                  {item}
                </Typography>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
