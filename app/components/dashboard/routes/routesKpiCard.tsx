"use client";

import { Stack, useTheme, Skeleton } from "@mui/material";
import StatCard from "../../cards/StatCard";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import LoopIcon from "@mui/icons-material/Loop";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import { RoutesKpiCardProps } from "@/app/lib/type/routes";

const RoutesKpiCard = ({ stats, loading }: RoutesKpiCardProps) => {
  const theme = useTheme();

  if (loading || !stats) {
    return (
      <Stack
        direction={"row"}
        flexWrap="wrap"
        gap={2}
        mt={2}
        justifyContent={"center"}
      >
        {[1, 2, 3, 4].map((i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            height={100}
            sx={{
              flexBasis: { xs: "100%", sm: "48%", md: "23%" },
              flexGrow: 1,
              borderRadius: "12px",
            }}
          />
        ))}
      </Stack>
    );
  }

  const kpiItems = [
    {
      label: "Active Routes",
      value: stats.active,
      icon: <AltRouteIcon />,
      color: theme.palette.primary.main,
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      icon: <LoopIcon />,
      color: theme.palette.info.main,
    },
    {
      label: "Completed Today",
      value: stats.completedToday,
      icon: <CheckCircleIcon />,
      color: theme.palette.success.main,
    },
    {
      label: "Delayed Routes",
      value: stats.delayed,
      icon: <WarningIcon />,
      color: theme.palette.error.main,
    },
  ];

  return (
    <Stack
      direction={"row"}
      flexWrap="wrap"
      gap={2}
      mt={2}
      justifyContent={"center"}
    >
      {kpiItems.map((item, index) => (
        <Stack
          key={index}
          flexBasis={{ xs: "100%", sm: "48%", md: "23%" }}
          flexGrow={1}
        >
          <StatCard
            title={item.label}
            value={item.value}
            icon={item.icon}
            color={item.color}
          />
        </Stack>
      ))}
    </Stack>
  );
};

export default RoutesKpiCard;
