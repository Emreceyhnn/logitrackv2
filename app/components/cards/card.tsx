"use client";

import { Card, useTheme, alpha } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

interface CustomCardProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

export default function CustomCard({ children, sx }: CustomCardProps) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        backgroundImage: "none",
        backdropFilter: "blur(12px)",
        borderRadius: "20px",
        p: "20px 24px",
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        boxShadow: `0 4px 20px 0 ${alpha("#000", 0.15)}`,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        ...sx,
      }}
    >
      {children}
    </Card>
  );
}
