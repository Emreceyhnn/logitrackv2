"use client";

import { Stack, useTheme, CircularProgress, Box } from "@mui/material";
import ShieldIcon from "@mui/icons-material/Shield";
import StatCard from "../../cards/StatCard";
import GroupsIcon from "@mui/icons-material/Groups";
import WorkIcon from "@mui/icons-material/Work";
import HomeIcon from "@mui/icons-material/Home";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { DriverKpiCardProps } from "@/app/lib/type/driver";

const DriverKpiCard = ({ data, loading }: DriverKpiCardProps) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  /* --------------------------------- render --------------------------------- */
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data) return null;

  const kpiItems = [
    {
      label: "Total Drivers",
      value: data.totalDrivers,
      icon: <GroupsIcon />,
      color: theme.palette.primary.main,
    },
    {
      label: "On Duty",
      value: data.onDuty,
      icon: <WorkIcon />,
      color: theme.palette.success.main,
    },
    {
      label: "Off Duty",
      value: data.offDuty,
      icon: <HomeIcon />,
      color: theme.palette.info.main,
    },
    {
      label: "On Leave",
      value: data.onLeave,
      icon: <HomeIcon />,
      color: theme.palette.warning.main,
    },
    {
      label: "Compliance Issues",
      value: data.complianceIssues,
      icon: <ReportProblemIcon />,
      color: theme.palette.error.main,
    },
    {
      label: "Avg Safety Rating",
      value: data.avgSafetyScore.toFixed(1),
      icon: <ShieldIcon />,
      color: theme.palette.warning.main,
    },
    {
      label: "Efficiency Rating",
      value: data.avgEfficiencyScore.toFixed(1),
      icon: <RocketLaunchIcon />,
      color: theme.palette.success.main,
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
