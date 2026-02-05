import { Card, Box, Stack, Typography, useTheme, alpha } from "@mui/material";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: string;
  onClick?: () => void;
}

const StatCard = ({
  title,
  value,
  icon,
  color = "#1976d2",
  onClick,
}: StatCardProps) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  return (
    <Card
      onClick={onClick}
      sx={{
        flex: 1,
        p: 2.5,
        borderRadius: "16px",
        boxShadow: theme.shadows[2],
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: onClick ? "pointer" : "default",
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(
          theme.palette.background.paper,
          0.9
        )} 100%)`,
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[8],
          borderColor: alpha(color, 0.3),
        },
      }}
    >
      <Stack spacing={1}>
        <Typography
          variant="overline"
          color="text.secondary"
          fontWeight={700}
          sx={{
            letterSpacing: 1.2,
            fontSize: "0.75rem",
            opacity: 0.8,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{
            color: theme.palette.text.primary,
            fontSize: { xs: "1.5rem", md: "2rem" },
            lineHeight: 1.2,
          }}
        >
          {value}
        </Typography>
      </Stack>

      {icon && (
        <Box
          sx={{
            p: 1.5,
            borderRadius: "16px",
            color: color,
            bgcolor: alpha(color, 0.1),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            "&:hover": {
              bgcolor: alpha(color, 0.2),
              transform: "rotate(5deg)",
            },
          }}
        >
          {icon}
        </Box>
      )}
    </Card>
  );
};

export default StatCard;
