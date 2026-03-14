"use client";

import { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Container,
  Stack,
  Toolbar,
  Typography,
  alpha,
  useScrollTrigger,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import LandingHeaderAuth from "./LandingHeaderAuth";

export default function LandingNavbar() {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "transparent",
        top: trigger ? 10 : 20,
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        zIndex: 1100,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            py: trigger ? 1 : 1.5,
            px: { xs: 2, md: 4 },
            borderRadius: "24px",
            background: trigger 
              ? alpha("#020617", 0.85) 
              : alpha("#0f172a", 0.4),
            backdropFilter: "blur(20px)",
            border: `1px solid ${trigger ? alpha("#38bdf8", 0.2) : alpha("#cbd5f5", 0.1)}`,
            boxShadow: trigger ? "0 20px 40px rgba(0,0,0,0.4)" : "none",
            transition: "all 0.4s ease",
            justifyContent: "space-between",
          }}
        >
          {/* Logo Section */}
          <Link href="/" style={{ textDecoration: "none" }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: trigger ? 36 : 44,
                  height: trigger ? 36 : 44,
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #38bdf8, #6366f1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.4s ease",
                }}
              >
                <Image
                  src="/logo-beyaz-vector.png"
                  alt="LogiTrack"
                  width={trigger ? 22 : 28}
                  height={trigger ? 22 : 28}
                />
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 800, 
                  letterSpacing: 1.5,
                  fontSize: trigger ? "1rem" : "1.25rem",
                  color: "#fff",
                  transition: "all 0.4s ease",
                  display: { xs: "none", sm: "block" }
                }}
              >
                LOGI-TRACK
              </Typography>
            </Stack>
          </Link>

          {/* Nav Links */}
          <Stack 
            direction="row" 
            spacing={4} 
            alignItems="center"
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {[
              { label: "Features", href: "/#features" },
              { label: "How It Works", href: "/how-it-works" },
              { label: "Pricing", href: "/#pricing" },
              { label: "About", href: "/#about" },
            ].map((item) => (
              <Typography
                key={item.label}
                component={Link}
                href={item.href}
                variant="body2"
                sx={{
                  fontWeight: 600,
                  textDecoration: "none",
                  color: alpha("#e2e8f0", 0.7),
                  transition: "all 0.2s ease",
                  "&:hover": { color: "#38bdf8" },
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Stack>

          {/* Auth Section */}
          <LandingHeaderAuth />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
