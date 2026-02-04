"use client"

import { Stack, useTheme } from "@mui/material"
import mockData from "@/app/lib/mockData.json";
import StatCard from "../../cards/StatCard";
import AltRouteIcon from '@mui/icons-material/AltRoute';
import LoopIcon from '@mui/icons-material/Loop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

const RoutesKpiCard = () => {
    const theme = useTheme()

    const today = new Date().toISOString().slice(0, 10);

    const activeRoutes = mockData.routes.filter(i => i.status === "ACTIVE").length
    const inProgress = mockData.routes.filter(i => i.status === "IN_PROGRESS").length
    const completedRoutes = mockData.routes.filter(r => r.status === 'COMPLETED').length;
    const delayedRoutes = mockData.routes.filter(i => i.status === "DELAYED").length

    const kpiItems = [
        {
            label: "Active Routes",
            value: activeRoutes,
            icon: <AltRouteIcon />,
            color: theme.palette.primary.main
        },
        {
            label: "In Progress",
            value: inProgress,
            icon: <LoopIcon />,
            color: theme.palette.info.main
        },
        {
            label: "Completed Today",
            value: completedRoutes,
            icon: <CheckCircleIcon />,
            color: theme.palette.success.main
        },
        {
            label: "Delayed Routes",
            value: delayedRoutes,
            icon: <WarningIcon />,
            color: theme.palette.error.main
        }
    ];

    return (
        <Stack direction={"row"} flexWrap="wrap" gap={2} mt={2} justifyContent={"center"} >
            {kpiItems.map((item, index) => (
                <Stack key={index} flexBasis={{ xs: "100%", sm: "48%", md: "23%" }} flexGrow={1}>
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

export default RoutesKpiCard