"use client";

import { Stack, useTheme } from "@mui/material";
import ShieldIcon from "@mui/icons-material/Shield";
import StatCard from "../../cards/StatCard";
import GroupsIcon from "@mui/icons-material/Groups";
import WorkIcon from "@mui/icons-material/Work";
import HomeIcon from "@mui/icons-material/Home";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import { useEffect, useState } from "react";
import { getDriverKpiStats } from "@/app/lib/controllers/driver";

const DriverKpiCard = () => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();
  const [stats, setStats] = useState({
    totalLength: 0,
    onDuty: 0,
    offDuty: 0,
    complianceIssues: 0,
    safetyScoreRating: 0,
    efficiencyRating: 0,
    onTimeDeliveryRating: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDriverKpiStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch driver stats:", error);
      }
    };
    fetchStats();
  }, []);

  /* ---------------------------------- utils --------------------------------- */
  const kpiItems = [
    {
      label: "Total Drivers",
      value: stats.totalLength,
      icon: <GroupsIcon />,
      color: theme.palette.primary.main,
    },
    {
      label: "On Duty",
      value: stats.onDuty,
      icon: <WorkIcon />,
      color: theme.palette.success.main,
    },
    {
      label: "Off Duty",
      value: stats.offDuty,
      icon: <HomeIcon />,
      color: theme.palette.info.main,
    },
    {
      label: "Compliance Issues",
      value: stats.complianceIssues,
      icon: <ReportProblemIcon />,
      color: theme.palette.error.main,
    },
    {
      label: "Avg Safety Rating",
      value: stats.safetyScoreRating.toFixed(1),
      icon: <ShieldIcon />,
      color: theme.palette.warning.main,
    },
    {
      label: "Efficiency Rating",
      value: stats.efficiencyRating.toFixed(1),
      icon: <RocketLaunchIcon />,
      color: theme.palette.success.main,
    },
    {
      label: "Avg On-Time Delivery Rating",
      value: stats.onTimeDeliveryRating,
      icon: <AccessAlarmsIcon />,
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
          flexBasis={{ xs: "100%", sm: "48%", md: "18%" }}
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

export default DriverKpiCard;
