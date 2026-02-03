"use client"

import { Stack, useTheme } from "@mui/material"
import mockData from "@/app/lib/data.json";
import StatCard from "../../cards/StatCard";
import GroupsIcon from '@mui/icons-material/Groups';
import WorkIcon from '@mui/icons-material/Work';
import HomeIcon from '@mui/icons-material/Home';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import StarIcon from '@mui/icons-material/Star';

const DriverKpiCard = () => {
    const theme = useTheme()

    const drivers = mockData.drivers;
    const totalDrivers = drivers.length;
    const onDuty = drivers.filter(d => d.status === "ON_DUTY").length;
    const offDuty = drivers.filter(d => d.status === "OFF_DUTY").length;
    // Count drivers with compliance issues (either rest requirement not met or medical check > 1 year old - simplified to just rest requirement for now)
    const complianceIssues = drivers.filter(d => !d.compliance.restRequirement.met).length;

    // Average rating
    const avgRating = (drivers.reduce((acc, curr) => acc + curr.rating.avg, 0) / totalDrivers).toFixed(1);

    const kpiItems = [
        {
            label: "Total Drivers",
            value: totalDrivers,
            icon: <GroupsIcon />,
            color: theme.palette.primary.main
        },
        {
            label: "On Duty",
            value: onDuty,
            icon: <WorkIcon />,
            color: theme.palette.success.main
        },
        {
            label: "Off Duty",
            value: offDuty,
            icon: <HomeIcon />,
            color: theme.palette.info.main
        },
        {
            label: "Compliance Issues",
            value: complianceIssues,
            icon: <ReportProblemIcon />,
            color: theme.palette.error.main
        },
        {
            label: "Avg Rating",
            value: avgRating,
            icon: <StarIcon />,
            color: theme.palette.warning.main
        }
    ];

    return (
        <Stack direction={"row"} flexWrap="wrap" gap={2} mt={2} justifyContent={"center"} >
            {kpiItems.map((item, index) => (
                <Stack key={index} flexBasis={{ xs: "100%", sm: "48%", md: "18%" }} flexGrow={1}>
                    <StatCard
                        title={item.label}
                        value={item.value}
                        icon={item.icon}
                        color={item.color}
                    />
                </Stack>
            ))}
        </Stack>
    )
}

export default DriverKpiCard
