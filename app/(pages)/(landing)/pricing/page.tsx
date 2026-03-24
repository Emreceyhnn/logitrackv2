"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  Chip,
  Grid,
  Button,
  Switch,
  alpha,
  Divider,
} from "@mui/material";
import { keyframes } from "@mui/system";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 20px rgba(56,189,248,0.2); }
  50% { box-shadow: 0 0 40px rgba(56,189,248,0.4); }
  100% { box-shadow: 0 0 20px rgba(56,189,248,0.2); }
`;

const pricingTiers = [
  {
    title: "Starter",
    priceMonthly: 49,
    priceYearly: 39,
    description: "Perfect for local fleet owners and individual operators.",
    features: [
      "Live GPS Tracking",
      "5 Active Routes",
      "Basic WMS Integration",
      "Email Support",
      "Mobile App Access"
    ],
    buttonText: "Start Free Trial",
    highlight: false,
  },
  {
    title: "Pro",
    priceMonthly: 199,
    priceYearly: 159,
    description: "Optimized for regional logistics and growing teams.",
    features: [
      "AI Route Optimization",
      "Unlimited Active Routes",
      "Predictive ETAs",
      "24/7 Priority Support",
      "Advanced Analytics",
      "Driver Performance Scores"
    ],
    buttonText: "Start Free Trial",
    highlight: true,
  },
  {
    title: "Enterprise",
    priceMonthly: null,
    priceYearly: null,
    description: "Custom solutions for global supply chain leaders.",
    features: [
      "Full Telematics Integration",
      "Custom SLA Monitoring",
      "Dedicated Account Manager",
      "White-Label Options",
      "On-Premise Deployment",
      "Infinite Custom Connectors"
    ],
    buttonText: "Contact Sales",
    highlight: false,
  }
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

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

      <Box
        sx={{
          position: "absolute",
          top: "-5%",
          right: "-5%",
          width: "50vw",
          height: "50vw",
          background: "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)",
          filter: "blur(100px)",
          zIndex: 0,
        }}
      />


      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
          pt: { xs: 10, md: 15 },
          pb: { xs: 12, md: 20 },
        }}
      >

        <Stack spacing={4} alignItems="center" textAlign="center" mb={10} sx={{ animation: `${fadeIn} 0.8s ease-out` }}>
          <Chip
            label="Pricing Plans"
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
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: { xs: "2.5rem", md: "4rem" },
              lineHeight: 1.1,
              background: "linear-gradient(120deg, #f8fafc 0%, #38bdf8 55%, #a855f7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Predictable Pricing for <br /> Unpredictable Logistics.
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" sx={{ color: !isYearly ? "#38bdf8" : alpha("#cbd5f5", 0.6), fontWeight: 600 }}>
              Monthly
            </Typography>
            <Switch
              checked={isYearly}
              onChange={() => setIsYearly(!isYearly)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': { color: '#38bdf8' },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#38bdf8' },
              }}
            />
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" sx={{ color: isYearly ? "#38bdf8" : alpha("#cbd5f5", 0.6), fontWeight: 600 }}>
                Yearly
              </Typography>
              <Chip
                label="Save 20%"
                size="small"
                sx={{
                  bgcolor: alpha("#10b981", 0.1),
                  color: "#10b981",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  fontSize: "0.65rem",
                  fontWeight: 800
                }}
              />
            </Stack>
          </Stack>
        </Stack>


        <Grid container spacing={4} alignItems="center">
          {pricingTiers.map((tier, idx) => (
            <Grid size={{ xs: 12, md: 4 }} key={idx}>
              <Box
                sx={{
                  p: 5,
                  borderRadius: 8,
                  bgcolor: tier.highlight ? alpha("#1e293b", 0.6) : alpha("#1e293b", 0.4),
                  backdropFilter: "blur(12px)",
                  border: `1px solid ${tier.highlight ? alpha("#38bdf8", 0.4) : alpha("#cbd5f5", 0.1)}`,
                  position: "relative",
                  transition: "all 0.3s ease",
                  animation: tier.highlight ? `${glow} 3s infinite ease-in-out` : "none",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    borderColor: alpha("#38bdf8", 0.6),
                    bgcolor: alpha("#1e293b", 0.7),
                  }
                }}
              >
                {tier.highlight && (
                  <Chip
                    label="Most Popular"
                    sx={{
                      position: "absolute",
                      top: -16,
                      left: "50%",
                      transform: "translateX(-50%)",
                      bgcolor: "linear-gradient(135deg, #38bdf8, #6366f1)",
                      color: "#fff",
                      fontWeight: 800,
                      px: 1,
                    }}
                  />
                )}

                <Typography variant="h5" fontWeight={800} mb={1}>
                  {tier.title}
                </Typography>
                <Typography variant="body2" sx={{ color: alpha("#cbd5f5", 0.6), mb: 4, height: 40 }}>
                  {tier.description}
                </Typography>

                <Stack direction="row" alignItems="flex-end" spacing={1} mb={4}>
                  <Typography variant="h3" fontWeight={900}>
                    {tier.priceMonthly === null ? "Custom" : `$${isYearly ? tier.priceYearly : tier.priceMonthly}`}
                  </Typography>
                  {tier.priceMonthly !== null && (
                    <Typography variant="body2" sx={{ color: alpha("#cbd5f5", 0.4), mb: 1 }}>
                      /mo
                    </Typography>
                  )}
                </Stack>

                <Divider sx={{ borderColor: alpha("#cbd5f5", 0.05), mb: 4 }} />

                <Stack spacing={2} mb={5}>
                  {tier.features.map((feature, fIdx) => (
                    <Stack direction="row" spacing={1.5} alignItems="center" key={fIdx}>
                      <CheckCircleRoundedIcon sx={{ fontSize: 18, color: "#38bdf8", opacity: 0.8 }} />
                      <Typography variant="body2" sx={{ color: alpha("#cbd5f5", 0.8) }}>
                        {feature}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>

                <Button
                  fullWidth
                  variant={tier.highlight ? "contained" : "outlined"}
                  sx={{
                    py: 1.5,
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "1rem",
                    background: tier.highlight ? "linear-gradient(135deg, #38bdf8, #6366f1)" : "transparent",
                    borderColor: alpha("#38bdf8", 0.4),
                    "&:hover": {
                      background: tier.highlight ? "linear-gradient(135deg, #0ea5e9, #4f46e5)" : alpha("#38bdf8", 0.1),
                    }
                  }}
                >
                  {tier.buttonText}
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>


        <Box
          sx={{
            mt: 15,
            p: { xs: 5, md: 8 },
            borderRadius: 8,
            border: `1px solid ${alpha("#38bdf8", 0.2)}`,
            background: "linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(30, 41, 59, 0.1) 100%)",
            textAlign: "center",
          }}
        >
          <Stack spacing={3} alignItems="center">
            <BoltRoundedIcon sx={{ fontSize: 48, color: "#38bdf8" }} />
            <Typography variant="h4" fontWeight={900}>
              Enterprise-Grade Security & Performance
            </Typography>
            <Typography variant="body1" sx={{ color: alpha("#cbd5f5", 0.7), maxWidth: 800, mx: "auto", lineHeight: 1.8 }}>
              Need more than 10,000 routes per month? Our Global infrastructure handles millions of telemetry events
              per second with 99.99% uptime. Contact our engineering team for custom integration solutions
              and volume-based pricing.
            </Typography>
            <Button
              variant="text"
              sx={{
                color: "#38bdf8",
                fontWeight: 700,
                "&:hover": { background: alpha("#38bdf8", 0.1) }
              }}
            >
              Learn about our Infrastructure →
            </Button>
          </Stack>
        </Box>
      </Container>


      <Box
        sx={{
          py: 8,
          borderTop: `1px solid ${alpha("#cbd5f5", 0.05)}`,
          textAlign: "center",
          bgcolor: alpha("#0b1120", 0.5),
        }}
      >
        <Typography variant="body2" sx={{ color: alpha("#cbd5f5", 0.4) }}>
          © {new Date().getFullYear()} LogiTrack Intelligence Systems. All plans subject to our TOS. <br />
          Enterprise customers get dedicated support channels.
        </Typography>
      </Box>
    </Box>
  );
}
