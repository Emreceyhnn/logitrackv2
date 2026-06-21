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
  Chip,
} from "@mui/material";
import { useLanguage } from "@/app/lib/language/DictionaryContext";
import InfoIcon from "@mui/icons-material/Info";
import DeveloperModeIcon from "@mui/icons-material/DeveloperMode";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import WorkIcon from "@mui/icons-material/Work";
import GetAppIcon from "@mui/icons-material/GetApp";

interface CompanyPageClientProps {
  pageKey: "missionPage" | "engineeringPage" | "pressKitPage" | "careersPage";
}

export default function CompanyPageClient({ pageKey }: CompanyPageClientProps) {
  const { dict } = useLanguage();
  const cDict = dict.landing[pageKey];

  if (!cDict) {
    return (
      <Box sx={{ p: 10, color: "white", bgcolor: "black" }}>
        Error: {pageKey} dictionary configuration is missing.
      </Box>
    );
  }

  // Choose icon based on pageKey
  const getHeroIcon = () => {
    switch (pageKey) {
      case "missionPage":
        return <InfoIcon sx={{ fontSize: 50, color: "#3b82f6" }} />;
      case "engineeringPage":
        return <DeveloperModeIcon sx={{ fontSize: 50, color: "#10b981" }} />;
      case "pressKitPage":
        return <PhotoLibraryIcon sx={{ fontSize: 50, color: "#ec4899" }} />;
      case "careersPage":
        return <WorkIcon sx={{ fontSize: 50, color: "#f59e0b" }} />;
    }
  };

  // Render extra widgets based on pageType
  const renderCustomCompanyWidget = () => {
    if (pageKey === "engineeringPage") {
      const engDict = cDict as typeof dict.landing.engineeringPage;
      return (
        <Box sx={{ mt: 8 }}>
          <Typography variant="h5" fontWeight={800} color="#fff" mb={4}>
            {engDict.techStackTitle || "Technology Stack"}
          </Typography>
          <Grid container spacing={2}>
            {[
              "Next.js 16 (App Router)",
              "React 19",
              "TypeScript",
              "Material UI v7",
              "Prisma ORM",
              "PostgreSQL",
              "Redis Cache",
              "Docker & K8s",
              "Tailwind CSS",
            ].map((tech) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={tech}>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color="rgba(255,255,255,0.8)"
                  >
                    {tech}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      );
    }

    if (pageKey === "pressKitPage") {
      const pressDict = cDict as typeof dict.landing.pressKitPage;
      return (
        <Box sx={{ mt: 8 }}>
          <Typography variant="h5" fontWeight={800} color="#fff" mb={4}>
            {pressDict.assetsTitle || "Media Assets"}
          </Typography>
          <Grid container spacing={4}>
            {[
              { name: "LogiTrack Logo Pack (SVG/PNG)", size: "4.2 MB" },
              { name: "Brand Guidelines (PDF)", size: "12.8 MB" },
              { name: "High-Res Dashboard Screenshots", size: "28.5 MB" },
            ].map((asset, idx) => (
              <Grid size={{ xs: 12, md: 4 }} key={idx}>
                <Paper
                  sx={{
                    p: 3,
                    bgcolor: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <GetAppIcon sx={{ fontSize: 40, color: "#ec4899", mb: 2 }} />
                  <Typography
                    variant="body1"
                    fontWeight={800}
                    color="#fff"
                    mb={1}
                  >
                    {asset.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255,255,255,0.4)", mb: 2 }}
                  >
                    {(pressDict.fileSizeLabel || "File Size: ") + asset.size}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      color: "#ec4899",
                      borderColor: "rgba(236,72,153,0.3)",
                    }}
                  >
                    {pressDict.downloadButton || "Download"}
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      );
    }

    if (pageKey === "careersPage") {
      const careersDict = cDict as typeof dict.landing.careersPage;
      return (
        <Box sx={{ mt: 8 }}>
          <Typography variant="h5" fontWeight={800} color="#fff" mb={4}>
            {careersDict.openPositionsTitle || "Open Positions"}
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                title: "Senior Fullstack Engineer",
                team: "Engineering",
                type: "Remote (Global)",
              },
              {
                title: "Product Designer",
                team: "Design",
                type: "Hybrid (Istanbul)",
              },
              {
                title: "DevOps Infrastructure Lead",
                team: "Infrastructure",
                type: "Remote (Global)",
              },
            ].map((job, idx) => (
              <Grid size={{ xs: 12 }} key={idx}>
                <Paper
                  sx={{
                    p: 4,
                    bgcolor: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    borderRadius: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 3,
                    transition: "border-color 0.2s ease",
                    "&:hover": { borderColor: "rgba(245,158,11,0.3)" },
                  }}
                >
                  <Stack spacing={1}>
                    <Typography variant="h6" fontWeight={800} color="#fff">
                      {job.title}
                    </Typography>
                    <Stack direction="row" spacing={2}>
                      <Chip
                        label={job.team}
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,255,255,0.05)",
                          color: "rgba(255,255,255,0.6)",
                        }}
                      />
                      <Chip
                        label={job.type}
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,255,255,0.05)",
                          color: "rgba(255,255,255,0.6)",
                        }}
                      />
                    </Stack>
                  </Stack>
                  <Button
                    variant="contained"
                    sx={{ bgcolor: "#f59e0b", color: "#000", fontWeight: 700 }}
                  >
                    {careersDict.applyButton || "Apply"}
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      );
    }

    return null;
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
            "radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)",
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
            "radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 70%)",
          filter: "blur(140px)",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Hero */}
        <Stack
          spacing={3}
          alignItems="center"
          textAlign="center"
          sx={{ mb: 12 }}
        >
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
            variant="h2"
            sx={{
              fontWeight: 900,
              lineHeight: 1.1,
              background: "linear-gradient(to right, #fff, #94a3b8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {cDict.hero.title}
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
            {cDict.hero.subtitle}
          </Typography>
        </Stack>

        {/* Content sections */}
        <Grid container spacing={6} sx={{ mb: 8 }}>
          {cDict.sections.map(
            (section: { title: string; content: string }, idx: number) => (
              <Grid size={{ xs: 12, md: 4 }} key={idx}>
                <Paper
                  sx={{
                    p: 4,
                    height: "100%",
                    bgcolor: "rgba(255, 255, 255, 0.01)",
                    border: "1px solid rgba(255, 255, 255, 0.03)",
                    borderRadius: "16px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.02)",
                      borderColor: "rgba(59, 130, 246, 0.2)",
                    },
                  }}
                >
                  <Typography variant="h5" fontWeight={800} color="#fff" mb={2}>
                    {section.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "rgba(255, 255, 255, 0.5)", lineHeight: 1.8 }}
                  >
                    {section.content}
                  </Typography>
                </Paper>
              </Grid>
            )
          )}
        </Grid>

        {/* Custom page-specific widgets */}
        {renderCustomCompanyWidget()}
      </Container>
    </Box>
  );
}
