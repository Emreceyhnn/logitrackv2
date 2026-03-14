"use client";

import Image from "next/image";
import {
  Box,
  Container,
  Stack,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import { alpha, keyframes } from "@mui/system";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";


const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

export default function AboutPage() {
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
      {/* Background Gradients */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 20%, rgba(59,130,246,0.15) 0%, transparent 40%)," +
            "radial-gradient(circle at 80% 80%, rgba(99,102,241,0.1) 0%, transparent 50%)",
          zIndex: 0,
        }}
      />


      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
          pt: { xs: 8, md: 12 },
          pb: { xs: 10, md: 16 },
        }}
      >
        {/* Hero Section */}
        <Stack spacing={4} alignItems="center" textAlign="center" mb={12}>
          <Chip
            label="Our Mission"
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
              fontSize: "0.75rem",
            }}
          />
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              lineHeight: 1.1,
              background: "linear-gradient(120deg, #f8fafc 0%, #38bdf8 55%, #a855f7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              maxWidth: 800,
            }}
          >
            Orchestrating the Future of Global Trade.
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: alpha("#cbd5f5", 0.8),
              maxWidth: 700,
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            At LogiTrack, we don’t just track shipments—we synchronize entire supply chains. 
            Our mission is to transform fragmented logistics data into live intelligence.
          </Typography>
        </Stack>

        <Divider sx={{ borderColor: alpha("#cbd5f5", 0.1), mb: 12 }} />

        {/* Vision Section */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={8}
          alignItems="center"
          mb={16}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="overline" sx={{ color: "#38bdf8", letterSpacing: 3, fontWeight: 700 }}>
              The LogiTrack Vision
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, mt: 2, mb: 4 }}>
              Eliminating the blind spots in modern logistics.
            </Typography>
            <Typography variant="body1" sx={{ color: alpha("#cbd5f5", 0.9), fontSize: "1.1rem", lineHeight: 1.8 }}>
              Born from the intersection of AI innovation and operational expertise, LogiTrack was built to 
              solve the most complex challenges in freight and warehouse management. We envision a world 
              where every vehicle, warehouse, and shipment is part of a unified, self-optimizing ecosystem.
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              position: "relative",
              height: 400,
              width: "100%",
              borderRadius: 6,
              overflow: "hidden",
              border: `1px solid ${alpha("#38bdf8", 0.2)}`,
              background: alpha("#1e293b", 0.4),
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: "80%",
                height: "60%",
                position: "relative",
                animation: `${float} 6s ease-in-out infinite`,
              }}
            >
              <Image
                src="/logo1-vector.png"
                alt="LogiTrack Vision"
                fill
                style={{ objectFit: "contain", opacity: 0.8 }}
              />
            </Box>
          </Box>
        </Stack>

        {/* Core Pillars */}
        <Box mb={16}>
          <Typography
            variant="h4"
            textAlign="center"
            fontWeight={800}
            mb={8}
          >
            Our Core Pillars
          </Typography>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={4}
          >
            {[
              {
                icon: <BoltRoundedIcon sx={{ fontSize: 40, color: "#38bdf8" }} />,
                title: "Predictive Resilience",
                description: "We anticipate disruptions before they escalate. Our AI models analyze live traffic and capacity to keep your SLA at 98%+."
              },
              {
                icon: <VisibilityRoundedIcon sx={{ fontSize: 40, color: "#a855f7" }} />,
                title: "Radical Transparency",
                description: "Empowering every stakeholder with a single source of truth. From the driver’s cab to the C-suite, total visibility is standard."
              },
              {
                icon: <SpeedRoundedIcon sx={{ fontSize: 40, color: "#22d3ee" }} />,
                title: "Scalable Efficiency",
                description: "Built to grow with your network. Whether managing a local fleet or a global supply chain, our infrastructure scales seamlessly."
              }
            ].map((pillar, idx) => (
              <Box
                key={idx}
                sx={{
                  flex: 1,
                  p: 5,
                  borderRadius: 5,
                  background: alpha("#1e293b", 0.4),
                  border: `1px solid ${alpha("#38bdf8", 0.1)}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    borderColor: alpha("#38bdf8", 0.3),
                    background: alpha("#1e293b", 0.6),
                    boxShadow: `0 20px 40px ${alpha("#000", 0.4)}`,
                  }
                }}
              >
                <Box mb={3}>{pillar.icon}</Box>
                <Typography variant="h5" fontWeight={700} mb={2}>
                  {pillar.title}
                </Typography>
                <Typography variant="body2" sx={{ color: alpha("#cbd5f5", 0.7), lineHeight: 1.7 }}>
                  {pillar.description}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Why We Do It */}
        <Box
          sx={{
            p: { xs: 6, md: 10 },
            borderRadius: 8,
            background: "linear-gradient(135deg, rgba(56,189,248,0.1) 0%, rgba(99,102,241,0.05) 100%)",
            border: `1px solid ${alpha("#38bdf8", 0.2)}`,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -100,
              right: -100,
              width: 300,
              height: 300,
              background: "radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <Typography variant="h4" fontWeight={800} mb={3}>
            Why We Do It
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: alpha("#cbd5f5", 0.9),
              maxWidth: 800,
              mx: "auto",
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            In an era of instant expectations, logistics is no longer a back-office function—it is a competitive advantage. 
            LogiTrack provides the tools to turn that advantage into a market-leading reality.
          </Typography>
        </Box>
      </Container>

      {/* Footer-like simple section */}
      <Box
        sx={{
          py: 8,
          borderTop: `1px solid ${alpha("#cbd5f5", 0.05)}`,
          textAlign: "center",
          bgcolor: alpha("#0b1120", 0.5),
        }}
      >
        <Typography variant="body2" sx={{ color: alpha("#cbd5f5", 0.4) }}>
          © {new Date().getFullYear()} LogiTrack Intelligence Systems. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
