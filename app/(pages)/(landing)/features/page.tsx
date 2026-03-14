"use client";

import {
  Box,
  Container,
  Stack,
  Typography,
  Chip,
  Grid,
  alpha,
} from "@mui/material";
import { keyframes } from "@mui/system";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const features = [
  {
    icon: <MapRoundedIcon sx={{ fontSize: 40, color: "#38bdf8" }} />,
    title: "AI Route Optimization",
    description: "Our proprietary AI engine processes live traffic, weather, and fleet capacity to generate the most fuel-efficient routes in real-time.",
    tag: "Predictive",
    details: ["Live Traffic Integration", "Load Balancing", "Carbon Offset Tracking"]
  },
  {
    icon: <Inventory2RoundedIcon sx={{ fontSize: 40, color: "#a855f7" }} />,
    title: "Warehouse Intelligence",
    description: "Optimize pick-paths and vertical space utilization with automated WMS synchronization. Scale from 1 to 100 warehouses with ease.",
    tag: "Automated",
    details: ["Space Optimization", "Inventory Velocity", "Cross-Docking Ready"]
  },
  {
    icon: <AnalyticsRoundedIcon sx={{ fontSize: 40, color: "#22d3ee" }} />,
    title: "Real-Time Telemetry",
    description: "Monitor vehicle health, driver safety, and fuel consumption via integrated telematics. Convert raw data into actionable insights.",
    tag: "Hardware-Agnostic",
    details: ["Driver Scorecards", "Predictive Maintenance", "Cold Chain Monitoring"]
  },
  {
    icon: <NotificationsActiveRoundedIcon sx={{ fontSize: 40, color: "#f472b6" }} />,
    title: "Smart Exception Alerts",
    description: "Stop reacting to disasters. Our anomaly detection system flags potential delays before they happen, suggesting proactive rerouting.",
    tag: "Proactive",
    details: ["Delay Forecasting", "Dynamic ETA Adjustments", "Multi-Channel Alerts"]
  },
  {
    icon: <SecurityRoundedIcon sx={{ fontSize: 40, color: "#10b981" }} />,
    title: "Enterprise Compliance",
    description: "Automatic audit logs, geofencing, and chain-of-custody tracking. Built to meet the strictest logistics security standards.",
    tag: "Secured",
    details: ["E-Signatures", "Geofence Enforcement", "Audit-Ready Logs"]
  },
  {
    icon: <BoltRoundedIcon sx={{ fontSize: 40, color: "#fbbf24" }} />,
    title: "API-First Architecture",
    description: "Integrate with SAP, Oracle, or custom legacy systems in hours, not weeks, using our robust SDK and webhook infrastructure.",
    tag: "Modular",
    details: ["REST & GraphQL APIs", "Robust Webhooks", "Custom ERP Integration"]
  }
];

export default function FeaturesPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#0f172a",
        color: "#f1f5f9",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Orbs */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "40vw",
          height: "40vw",
          background: "radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 70%)",
          filter: "blur(80px)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          right: "5%",
          width: "30vw",
          height: "30vw",
          background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)",
          filter: "blur(80px)",
          zIndex: 0,
        }}
      />


      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
          pt: { xs: 8, md: 15 },
          pb: { xs: 10, md: 20 },
        }}
      >
        {/* Header */}
        <Stack spacing={4} alignItems="center" textAlign="center" mb={15} sx={{ animation: `${fadeIn} 0.8s ease-out` }}>
          <Chip
            label="Product Capabilities"
            sx={{
              borderRadius: "999px",
              px: 2,
              py: 0.5,
              bgcolor: alpha("#38bdf8", 0.1),
              border: `1px solid ${alpha("#38bdf8", 0.3)}`,
              color: "#38bdf8",
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          />
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: "2.5rem", md: "4.5rem" },
              lineHeight: 1,
              background: "linear-gradient(120deg, #f8fafc 0%, #38bdf8 55%, #a855f7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Engineering the <br /> Modern Supply Chain.
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: alpha("#cbd5f5", 0.7),
              maxWidth: 800,
              fontWeight: 300,
              lineHeight: 1.6,
            }}
          >
            From predictive telemetry to autonomous warehouse orchestration, explore the tools 
            redefining what it means to be a global logistics leader.
          </Typography>
        </Stack>

        {/* Features Grid */}
        <Grid container spacing={4}>
          {features.map((feature, idx) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={idx}>
              <Box
                sx={{
                  height: "100%",
                  p: 5,
                  borderRadius: 6,
                  background: "rgba(30, 41, 59, 0.4)",
                  backdropFilter: "blur(12px)",
                  border: `1px solid ${alpha("#38bdf8", 0.15)}`,
                  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  animation: `${fadeIn} 0.6s ease-out backwards`,
                  animationDelay: `${idx * 0.1}s`,
                  "&:hover": {
                    transform: "translateY(-12px) scale(1.02)",
                    borderColor: alpha("#38bdf8", 0.4),
                    background: "rgba(30, 41, 59, 0.6)",
                    boxShadow: `0 40px 80px -20px ${alpha("#000", 0.5)}`,
                    "& .feature-icon": {
                      animation: `${float} 2s ease-in-out infinite`,
                    }
                  }
                }}
              >
                <Stack spacing={3}>
                  <Box className="feature-icon" sx={{ transition: "transform 0.3s ease" }}>
                    {feature.icon}
                  </Box>
                  <Box>
                    <Chip
                      label={feature.tag}
                      size="small"
                      sx={{
                        bgcolor: alpha("#38bdf8", 0.05),
                        color: alpha("#38bdf8", 0.8),
                        border: `1px solid ${alpha("#38bdf8", 0.2)}`,
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        mb: 2
                      }}
                    />
                    <Typography variant="h5" fontWeight={800} mb={2}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha("#cbd5f5", 0.6), lineHeight: 1.8 }}>
                      {feature.description}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ pt: 2, borderTop: `1px solid ${alpha("#cbd5f5", 0.05)}` }}>
                    <Stack spacing={1}>
                      {feature.details.map((detail, dIdx) => (
                        <Stack direction="row" spacing={1.5} alignItems="center" key={dIdx}>
                          <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#38bdf8" }} />
                          <Typography variant="caption" sx={{ color: alpha("#cbd5f5", 0.8), fontWeight: 500 }}>
                            {detail}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Tech Stack Overlay (Visual Polish) */}
        <Box
          sx={{
            mt: 20,
            p: 8,
            borderRadius: 8,
            border: `1px solid ${alpha("#38bdf8", 0.2)}`,
            background: "linear-gradient(180deg, rgba(30, 41, 59, 0.2) 0%, rgba(30, 41, 59, 0) 100%)",
            textAlign: "center",
          }}
        >
          <Typography variant="overline" sx={{ color: "#38bdf8", letterSpacing: 4, fontWeight: 800 }}>
            Unified Infrastructure
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 900, mt: 3, mb: 4 }}>
            One Dashboard. Infinite Control.
          </Typography>
          <Typography variant="body1" sx={{ color: alpha("#cbd5f5", 0.7), maxWidth: 900, mx: "auto", mb: 6, lineHeight: 1.8 }}>
            Our features aren&apos;t standalone tools—they are part of a deeply integrated ecosystem. 
            When your warehouse updates, your fleet reacts. When traffic spikes, your customer knows. 
            That is the Logi-Track advantage.
          </Typography>
          
          <Grid container spacing={2} justifyContent="center">
            {["Cloud Native", "AI Optimized", "256-bit AES Encryption", "99.9% SLA", "PCI-DSS Compliant"].map((stat, sIdx) => (
              <Grid key={sIdx}>
                <Box
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 999,
                    border: `1px solid ${alpha("#cbd5f5", 0.1)}`,
                    bgcolor: alpha("#0f172a", 0.4),
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.8 }}>
                    {stat}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          py: 10,
          borderTop: `1px solid ${alpha("#cbd5f5", 0.05)}`,
          textAlign: "center",
          bgcolor: alpha("#0b1120", 0.5),
        }}
      >
        <Typography variant="body2" sx={{ color: alpha("#cbd5f5", 0.4) }}>
          © {new Date().getFullYear()} LogiTrack Intelligence Systems. All rights reserved. <br />
          Built for the enterprise, optimized for the road.
        </Typography>
      </Box>
    </Box>
  );
}
