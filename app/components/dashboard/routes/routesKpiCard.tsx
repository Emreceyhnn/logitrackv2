"use client";

import { Stack, useTheme } from "@mui/material";
import StatCard from "../../cards/StatCard";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import LoopIcon from "@mui/icons-material/Loop";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import { RoutesKpiCardProps } from "@/app/lib/type/routes";
import KpiSkeleton from "@/app/components/skeletons/KpiSkeleton";

const RoutesKpiCard = ({ stats, loading = false }: { stats: any; loading?: boolean }) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  if (loading) {
    return <KpiSkeleton count={4} />;
  }

  const values = stats || {
    active: 0,
    inProgress: 0,
    completedToday: 0,
    delayed: 0,
  };

  const kpiItems = [
    {
      label: "Active Routes",
      value: values.active,
      icon: <AltRouteIcon />,
      color: theme.palette.primary.main,
    },
    {
      label: "In Progress",
      value: values.inProgress,
      icon: <LoopIcon />,
      color: theme.palette.info.main,
    },
    {
      label: "Completed Today",
      value: values.completedToday,
      icon: <CheckCircleIcon />,
      color: theme.palette.success.main,
    },
    {
      label: "Delayed Routes",
      value: values.delayed,
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
            key={index}
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
