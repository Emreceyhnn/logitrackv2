"use client";

import { Box, Stack, Typography, alpha, useTheme } from "@mui/material";
import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Connect Your Fleet",
    description:
      "Integrate telematics, TMS, and WMS data sources in minutes with our prebuilt high-performance connectors.",
    color: "#38bdf8",
  },
  {
    step: "02",
    title: "Visualize Operations",
    description:
      "Monitor every shipment and asset in real time with adaptive dashboards, heatmaps, and live GPS tracking.",
    color: "#6366f1",
  },
  {
    step: "03",
    title: "Automate Decisions",
    description:
      "Trigger proactive workflows and automated alerts before potential delays or issues escalate.",
    color: "#a855f7",
  },
  {
    step: "04",
    title: "Optimize Routes",
    description:
      "Leverage AI-driven optimization to minimize fuel costs, reduce idle time, and maximize driver efficiency.",
    color: "#38bdf8",
  },
  {
    step: "05",
    title: "Analyze Performance",
    description:
      "Evaluate critical KPIs like delivery accuracy and cost per shipment with our advanced analytics suite.",
    color: "#6366f1",
  },
  {
    step: "06",
    title: "Scale Seamlessly",
    description:
      "Expand your logistics network globally with modular integrations and scalable cloud infrastructure.",
    color: "#a855f7",
  },
];

export default function TimelineSection() {
  const theme = useTheme();

  const coloredSteps = steps.map((step) => {
    let color = step.color;
    if (step.color === "#38bdf8") color = theme.palette.kpi.cyan;
    if (step.color === "#6366f1") color = theme.palette.kpi.indigo;
    if (step.color === "#a855f7") color = theme.palette.kpi.purple;
    return { ...step, color };
  });

  return (
    <Box sx={{ position: "relative", py: 10 }}>
      <Box
        sx={{
          position: "absolute",
          left: { xs: "20px", md: "50%" },
          top: 0,
          bottom: 0,
          width: "2px",
          background: `linear-gradient(to bottom, transparent, ${alpha(theme.palette.kpi.cyan, 0.3)}, ${alpha(theme.palette.kpi.indigo, 0.3)}, transparent)`,
          transform: { md: "translateX(-50%)" },
          zIndex: 0,
        }}
      />

      <Stack spacing={8}>
        {coloredSteps.map((item, index) => (
          <Box
            key={item.step}
            component={motion.div}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                md: index % 2 === 0 ? "row" : "row-reverse",
              },
              alignItems: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Box
              sx={{
                width: { xs: "100%", md: "45%" },
                textAlign: {
                  xs: "left",
                  md: index % 2 === 0 ? "right" : "left",
                },
                pl: { xs: "60px", md: 0 },
                pr: { xs: 0, md: 0 },
              }}
            >
              <Box
                sx={{
                  display: "inline-block",
                  p: 4,
                  borderRadius: "24px",
                  bgcolor: "rgba(8, 12, 24, 0.75)",
                  backdropFilter: "blur(20px)",
                  border: `1px solid ${alpha(item.color, 0.2)}`,
                  boxShadow: `0 8px 32px 0 ${alpha(item.color, 0.05)}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    border: `1px solid ${alpha(item.color, 0.4)}`,
                    boxShadow: `0 12px 40px 0 ${alpha(item.color, 0.1)}`,
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: item.color,
                    fontWeight: 800,
                    letterSpacing: 2,
                    mb: 1,
                    fontSize: "14px",
                  }}
                >
                  STEP {item.step}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, mb: 2, color: "#fff" }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.6)", lineHeight: 1.7 }}
                >
                  {item.description}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                position: "absolute",
                left: { xs: "20px", md: "50%" },
                top: { xs: "40px", md: "50%" },
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "rgba(8, 12, 24, 1)",
                border: `4px solid ${item.color}`,
                boxShadow: `0 0 20px ${item.color}`,
                transform: "translate(-50%, -50%)",
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: item.color,
                }}
              />
            </Box>

            <Box sx={{ width: { xs: 0, md: "10%" } }} />
            <Box sx={{ width: { xs: "100%", md: "45%" } }} />
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
