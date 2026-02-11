"use client";

import { Stack, useTheme } from "@mui/material";
import StatCard from "../../cards/StatCard";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import LoopIcon from "@mui/icons-material/Loop";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import { useEffect, useState } from "react";
import { getRouteStats } from "@/app/lib/controllers/routes";

const RoutesKpiCard = () => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();
  const [stats, setStats] = useState({ active: 0, inProgress: 0, completedToday: 0, delayed: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      // TODO: Use actual auth context
      const COMPANY_ID = 'cmlgt985b0003x0cuhtyxoihd';
      const USER_ID = 'usr_001';
      try {
        const data = await getRouteStats(COMPANY_ID, USER_ID);
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchStats();
  }, []);

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
