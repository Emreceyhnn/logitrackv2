"use client";

import { Card, useTheme } from "@mui/material";
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
                backgroundColor: theme.palette.background.paper,
                backgroundImage: "none",
                borderRadius: "8px",
                p: "6px 12px",
                ...sx,
                boxShadow: theme.shadows[4],
            }}
        >
            {children}
        </Card>
    );
}
