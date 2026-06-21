"use client";

import React from "react";
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
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ApartmentIcon from "@mui/icons-material/Apartment";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import HubIcon from "@mui/icons-material/Hub";

interface SolutionsPageClientProps {
  pageKey: "enterprisePage" | "smbLogisticsPage" | "supplyChainPage";
}

export default function SolutionsPageClient({
  pageKey,
}: SolutionsPageClientProps) {
  const dict = useDictionary();
  const sDict = dict.landing[pageKey];

  if (!sDict) {
    return (
      <Box sx={{ p: 10, color: "white", bgcolor: "black" }}>
        Error: {pageKey} dictionary configuration is missing.
      </Box>
    );
  }

  // Choose icon based on pageKey
  const getHeroIcon = () => {
    switch (pageKey) {
      case "enterprisePage":
        return <ApartmentIcon sx={{ fontSize: 50, color: "#a855f7" }} />;
      case "smbLogisticsPage":
        return <LocalShippingIcon sx={{ fontSize: 50, color: "#38bdf8" }} />;
      case "supplyChainPage":
        return <HubIcon sx={{ fontSize: 50, color: "#f43f5e" }} />;
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
          right: "-10%",
          width: "50%",
          height: "60%",
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)",
          filter: "blur(140px)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-15%",
          left: "-10%",
          width: "50%",
          height: "60%",
          background:
            "radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, transparent 70%)",
          filter: "blur(140px)",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Hero Header */}
        <Stack
          spacing={3}
          alignItems="center"
          textAlign="center"
          sx={{ mb: 12 }}
        >
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
                color: "#38bdf8",
                fontWeight: 700,
                letterSpacing: 2,
              }}
            >
              {sDict.overline}
            </Typography>
          </Stack>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              lineHeight: 1.1,
              maxWidth: 800,
              background: "linear-gradient(to right, #fff, #94a3b8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {sDict.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "1.2rem",
              maxWidth: 700,
              lineHeight: 1.7,
            }}
          >
            {sDict.subtitle}
          </Typography>
        </Stack>

        {/* Highlight Metrics */}
        <Grid container spacing={4} sx={{ mb: 15 }}>
          {(sDict.metrics || []).map(
            (metric: { value: string; label: string }, idx: number) => (
              <Grid size={{ xs: 12, md: 4 }} key={idx}>
                <Paper
                  sx={{
                    p: 4,
                    bgcolor: "rgba(255, 255, 255, 0.01)",
                    border: "1px solid rgba(255, 255, 255, 0.03)",
                    borderRadius: "20px",
                    textAlign: "center",
                    boxShadow: "none",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 160,
                    transition: "all 0.3s ease",
                    background:
                      "linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.005) 100%)",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      borderColor: "rgba(255, 255, 255, 0.08)",
                      bgcolor: "rgba(255, 255, 255, 0.03)",
                    },
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 900,
                      mb: 1.5,
                      background:
                        "linear-gradient(135deg, #fff 30%, #94a3b8 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {metric.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255, 255, 255, 0.4)",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      fontSize: "0.75rem",
                    }}
                  >
                    {metric.label}
                  </Typography>
                </Paper>
              </Grid>
            )
          )}
        </Grid>

        {/* Feature Grid */}
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
            {sDict.features.title}
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            sx={{
              color: "rgba(255, 255, 255, 0.5)",
              maxWidth: 600,
              mx: "auto",
              mb: 8,
            }}
          >
            {sDict.features.description}
          </Typography>
          <Grid container spacing={4}>
            {sDict.features.items.map(
              (item: { title: string; description: string }, idx: number) => (
                <Grid size={{ xs: 12, md: 6 }} key={idx}>
                  <Stack
                    direction="row"
                    spacing={3}
                    sx={{
                      p: 4,
                      height: "100%",
                      borderRadius: "16px",
                      bgcolor: "rgba(255, 255, 255, 0.01)",
                      border: "1px solid rgba(255, 255, 255, 0.03)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.03)",
                        borderColor: "rgba(56, 189, 248, 0.2)",
                      },
                    }}
                  >
                    <CheckCircleIcon sx={{ color: "#38bdf8", mt: 0.5 }} />
                    <Stack spacing={1}>
                      <Typography variant="h6" fontWeight={800} color="#fff">
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255, 255, 255, 0.5)",
                          lineHeight: 1.7,
                        }}
                      >
                        {item.description}
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>
              )
            )}
          </Grid>
        </Box>

        {/* CTA Banner */}
        <Paper
          sx={{
            p: { xs: 6, md: 10 },
            borderRadius: "24px",
            background:
              "linear-gradient(135deg, rgba(56, 189, 248, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            textAlign: "center",
          }}
        >
          <Typography variant="h3" fontWeight={900} mb={3}>
            {sDict.cta.title}
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
            {sDict.cta.subtitle}
          </Typography>
          <Button
            component={Link}
            href="/auth/sign-up"
            variant="contained"
            sx={{
              bgcolor: "#38bdf8",
              color: "#000",
              fontWeight: 700,
              borderRadius: "12px",
              px: 5,
              py: 1.5,
              "&:hover": { bgcolor: "#0ea5e9" },
            }}
          >
            {sDict.cta.button}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
