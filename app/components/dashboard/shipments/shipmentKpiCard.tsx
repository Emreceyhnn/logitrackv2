"use client"
import { Card, Stack, Typography, useTheme } from "@mui/material"
import mockData from "@/app/lib/data.json";

const ShipmentKpiCard = () => {
    const theme = useTheme()

    const totalShipments = mockData.shipments.length;
    const activeShipments = mockData.overview.kpis.activeShipments;
    const delayedShipments = mockData.overview.kpis.delayedShipments;

    const deliveredShipments = mockData.shipments.filter(s => s.status === 'DELIVERED').length;

    const inTransit = mockData.shipments.filter(s => s.status === 'IN_TRANSIT').length;

    const kpiItems = [
        { label: "Active Shipments", value: activeShipments },
        { label: "Delayed Shipments", value: delayedShipments },
        { label: "In Transit", value: inTransit },

    ];

    return (
        <Stack direction={"row"} spacing={2} mt={2} justifyContent={"space-between"} >
            <Card
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    backgroundImage: "none",
                    borderRadius: "8px",
                    p: "6px 12px",
                    flexBasis: "calc(25% - 16px)",
                    flexGrow: 0,
                    boxShadow: 3
                }}
            >
                <Stack justifyContent={"space-between"} height={"100%"}>
                    <Typography sx={{ fontSize: 18, fontWeight: 300 }}>Total Shipments</Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 600 }}>{totalShipments}</Typography>
                </Stack>
            </Card>

            <Card
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    backgroundImage: "none",
                    borderRadius: "8px",
                    p: "6px 12px",
                    flexBasis: "calc(25% - 16px)",
                    flexGrow: 0,
                }}
            >
                <Stack justifyContent={"space-between"} height={"100%"}>
                    <Typography sx={{ fontSize: 18, fontWeight: 300 }}>Active Shipments</Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 600 }}>{activeShipments}</Typography>
                </Stack>
            </Card>

            <Card
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    backgroundImage: "none",
                    borderRadius: "8px",
                    p: "6px 12px",
                    flexBasis: "calc(25% - 16px)",
                    flexGrow: 0,
                }}
            >
                <Stack justifyContent={"space-between"} height={"100%"}>
                    <Typography sx={{ fontSize: 18, fontWeight: 300 }}>Delayed Shipments</Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 600 }}>{delayedShipments}</Typography>
                </Stack>
            </Card>

            <Card
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    backgroundImage: "none",
                    borderRadius: "8px",
                    p: "6px 12px",
                    flexBasis: "calc(25% - 16px)",
                    flexGrow: 0,
                }}
            >
                <Stack justifyContent={"space-between"} height={"100%"}>
                    <Typography sx={{ fontSize: 18, fontWeight: 300 }}>In Transit</Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 600 }}>{inTransit}</Typography>
                </Stack>
            </Card>

        </Stack>
    )
}

export default ShipmentKpiCard
