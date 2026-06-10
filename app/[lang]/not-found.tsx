"use client";

import { Box, Button, Typography, Container, useTheme } from "@mui/material";
import { WarningRounded, Home } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            textAlign: "center",
            p: 6,
            borderRadius: 4,
            backgroundColor: "background.paper",
            boxShadow: theme.shadows[3],
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <WarningRounded
            sx={{
              fontSize: 80,
              color: "warning.main",
              mb: 2,
            }}
          />
          <Typography
            variant="h1"
            sx={{
              fontSize: "4rem",
              fontWeight: 800,
              color: "text.primary",
              mb: 1,
            }}
          >
            404
          </Typography>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, color: "text.secondary", mb: 2 }}
          >
            Page Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            The page you are looking for doesn&apos;t exist or has been moved.
          </Typography>
          
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => router.back()}
              sx={{ px: 4, py: 1.5, borderRadius: 2 }}
            >
              Go Back
            </Button>
            <Button
              component={Link}
              href="/"
              variant="contained"
              startIcon={<Home />}
              sx={{ px: 4, py: 1.5, borderRadius: 2 }}
            >
              Return Home
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
