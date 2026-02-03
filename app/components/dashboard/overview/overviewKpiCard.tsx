"use client"

import { Stack, useTheme } from "@mui/material";
import { getOverviewKpis } from "@/app/lib/analyticsUtils";
import StatCard from "../../cards/StatCard";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import InventoryIcon from '@mui/icons-material/Inventory';

const OverviewKpiCard = () => {
    const theme = useTheme()

    const values = getOverviewKpis()

    const kpiItems = [
        {
            label: "Active Shipments",
            value: values.activeShipments,
            icon: <LocalShippingIcon />,
            color: theme.palette.primary.main
        },
        {
            label: "Delayed Shipments",
            value: values.delayedShipments,
            icon: <AccessTimeIcon />,
            color: theme.palette.error.main
        },
        {
            label: "Vehicles On Trip",
            value: values.vehiclesOnTrip,
            icon: <DirectionsCarIcon />,
            color: theme.palette.info.main
        },
        {
            label: "Vehicles In Service",
            value: values.vehiclesInService,
            icon: <BuildIcon />,
            color: theme.palette.warning.main
        },
        {
            label: "Available Vehicles",
            value: values.availableVehicles,
            icon: <CheckCircleIcon />,
            color: theme.palette.success.main
        },
        {
            label: "Active Drivers",
            value: values.activeDrivers,
            icon: <PersonIcon />,
            color: theme.palette.secondary.main
        },
        {
            label: "Warehouses",
            value: values.warehouses,
            icon: <WarehouseIcon />,
            color: theme.palette.grey[700]
        },
        {
            label: "Inventory Skus",
            value: values.inventorySkus,
            icon: <InventoryIcon />,
            color: theme.palette.info.dark
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

export default OverviewKpiCard




