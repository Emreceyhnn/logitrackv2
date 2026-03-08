"use client";

import { Box, Container, Stack, Typography } from "@mui/material";
import CreateCompanyForm from "@/app/components/forms/createCompanyForm";
import { alpha } from "@mui/system";
import Image from "next/image";

export default function OnboardingPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Decorative Elements */}
      <Box
        sx={{
          position: "absolute",
          width: 500,
          height: 500,
          top: -200,
          left: -100,
          background:
            "radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 400,
          height: 400,
          bottom: -150,
          right: -50,
          background:
            "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Stack spacing={4} alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #38bdf8, #6366f1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 16px rgba(56, 189, 248, 0.25)",
              }}
            >
              <Image
                src="/logo-beyaz-vector.png"
                alt="LogiTrack Logo"
                width={32}
                height={32}
              />
            </Box>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{ color: "white", letterSpacing: -1 }}
            >
              LogiTrack
            </Typography>
          </Stack>

          <Box
            sx={{
              width: "100%",
              p: 1,
              bgcolor: alpha("#ffffff", 0.03),
              borderRadius: "24px",
              border: `1px solid ${alpha("#38bdf8", 0.15)}`,
              backdropFilter: "blur(12px)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
          >
            <CreateCompanyForm />
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: alpha("#cbd5f5", 0.6),
              textAlign: "center",
              px: 4,
            }}
          >
            Welcome to the future of logistics management. Create your company
            to start managing fleets, drivers, and shipments with AI-driven
            insights.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
