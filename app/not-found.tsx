"use client";

import { Box, Button, Typography, Container } from "@mui/material";
import { useRouter } from "next/navigation";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export default function NotFound() {
  const router = useRouter();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <WarningAmberIcon sx={{ fontSize: 80, color: "warning.main", mb: 2 }} />
        <Typography variant="h1" fontWeight={800} gutterBottom sx={{ fontSize: "4rem" }}>
          404
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Oops! The page you are looking for does not exist.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          It might have been moved or deleted, or perhaps you mistyped the URL.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => router.push("/")}
          sx={{ borderRadius: 2, px: 4, py: 1.5 }}
        >
          Return to Dashboard
        </Button>
      </Box>
    </Container>
  );
}
