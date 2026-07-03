"use client";

import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { motion } from "framer-motion";

export default function HeroSection() {
  const dict = useDictionary();

  return (
    <Box
      component="section"
      className="bg-hero-glow"
      sx={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, md: 5 },
        py: 12,
        overflow: "hidden",
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: 0.6,
        }}
      >
        <Image
          src="/bg-high-reso.webp"
          alt="LogiTrack Background"
          fill
          priority
          fetchPriority="high"
          quality={75}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        <Box
          className="bg-grid-pattern"
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.1,
            willChange: "transform", // Optimize for GPU
          }}
        />
      </Box>

      {/* Subdued Scanline Overlay */}
      <Box className="pointer-events-none fixed inset-0 z-[100] overflow-hidden opacity-[0.02] mix-blend-overlay">
        <Box className="h-[200vh] w-full animate-scanline bg-gradient-to-b from-transparent via-white to-transparent" />
      </Box>

      {/* Technical Overlays */}
      <Typography
        className="font-label-md"
        sx={{
          position: "absolute",
          top: "40%",
          left: 48,
          color: "primary.main",
          opacity: 0.3,
          fontSize: "0.75rem",
          letterSpacing: "0.4em",
          transform: "rotate(90deg) origin-left",
          display: { xs: "none", xl: "block" },
          textTransform: "uppercase",
        }}
      >
        NAV.PROC.01 // SYNC_ACTIVE // LAT 52.3676 N 4.9041 E
      </Typography>

      <Typography
        className="font-label-md"
        sx={{
          position: "absolute",
          bottom: "40%",
          right: 48,
          color: "primary.main",
          opacity: 0.3,
          fontSize: "0.75rem",
          letterSpacing: "0.4em",
          transform: "rotate(-90deg) origin-right",
          display: { xs: "none", xl: "block" },
          textTransform: "uppercase",
        }}
      >
        SECURE.ENDPOINT.942 // ENCR_AES_256 // VERIFIED
      </Typography>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 10 }}>
        <Stack spacing={4} alignItems="center" textAlign="center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 0.75,
                borderRadius: "4px",
                bgcolor: "rgba(0, 242, 255, 0.05)",
                border: "1px solid rgba(0, 242, 255, 0.3)",
                backdropFilter: "blur(20px)",
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: "#00f2ff",
                  boxShadow: "0 0 10px #00f2ff",
                }}
              />
              <Typography
                className="font-label-md"
                sx={{
                  fontSize: "0.75rem",
                  color: "#00f2ff",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  fontWeight: 700,
                }}
              >
                {dict.landing.hero.badge}
              </Typography>
            </Box>
          </motion.div>

          {/* Title */}
          <Box
            sx={{
              animation: "fadeInUp 0.8s ease-out forwards",
              "@keyframes fadeInUp": {
                from: { opacity: 0.01, transform: "translateY(20px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.5rem", md: "4rem" },
                fontWeight: 900,
                color: "white",
                lineHeight: 1.1,
                maxWidth: "900px",
                letterSpacing: "-0.04em",
              }}
            >
              {dict.landing.hero.titleMain}{" "}
              <Box
                component="span"
                className="text-glow"
                sx={{
                  color: "transparent",
                  background: "linear-gradient(90deg, #fff, #00f2ff, #7bd0ff)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                }}
              >
                {dict.landing.hero.titleHighlight}
              </Box>
            </Typography>
          </Box>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "1rem", md: "1.125rem" },
                color: "rgba(255, 255, 255, 0.7)",
                maxWidth: "600px",
                lineHeight: 1.6,
              }}
            >
              {dict.landing.hero.description}
            </Typography>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              sx={{ mt: 2 }}
            >
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#00f2ff",
                  color: "#00363a",
                  px: 5,
                  py: 1.5,
                  fontWeight: 900,
                  fontSize: "0.875rem",
                  "&:hover": {
                    bgcolor: "white",
                    boxShadow: "0 0 40px rgba(0, 242, 255, 0.3)",
                  },
                }}
              >
                {dict.landing.hero.startTrial}
              </Button>
              <Button
                variant="outlined"
                startIcon={<PlayCircleOutlineIcon />}
                sx={{
                  color: "white",
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  bgcolor: "rgba(255, 255, 255, 0.04)",
                  px: 5,
                  py: 1.5,
                  fontWeight: 900,
                  fontSize: "0.875rem",
                  "&:hover": {
                    borderColor: "#00f2ff",
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                {dict.landing.hero.demo}
              </Button>
            </Stack>
          </motion.div>
        </Stack>
      </Container>
    </Box>
  );
}
