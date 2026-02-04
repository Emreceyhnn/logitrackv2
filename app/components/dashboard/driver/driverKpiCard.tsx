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
import { getDriverKpiValues } from "@/app/lib/analyticsUtils";

const DriverKpiCard = () => {
  const theme = useTheme();

  const DriverData = getDriverKpiValues();
  const kpiItems = [
    {
      label: "Total Drivers",
      value: DriverData.totalLength,
      icon: <GroupsIcon />,
      color: theme.palette.primary.main,
    },
    {
      label: "On Duty",
      value: DriverData.onDuty,
      icon: <WorkIcon />,
      color: theme.palette.success.main,
    },
    {
      label: "Off Duty",
      value: DriverData.offDuty,
      icon: <HomeIcon />,
      color: theme.palette.info.main,
    },
    {
      label: "Compliance Issues",
      value: DriverData.complianceIssues,
      icon: <ReportProblemIcon />,
      color: theme.palette.error.main,
    },
    {
      label: "Avg Safety Rating",
      value: DriverData.safetyScoreRating,
      icon: <ShieldIcon />,
      color: theme.palette.warning.main,
    },
    {
      label: "Efficiency Rating",
      value: DriverData.efficiencyRating,
      icon: <RocketLaunchIcon />,
      color: theme.palette.success.main,
    },
    {
      label: "Avg On-Time Delivery Rating",
      value: DriverData.onTimeDeliveryRating,
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
