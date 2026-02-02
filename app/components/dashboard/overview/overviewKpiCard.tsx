"use client"
import { Card, Stack, Typography, useTheme } from "@mui/material"
import mockData from "@/app/lib/data.json";




const OverviewKpiCard = () => {
    const theme = useTheme()

    const values = mockData.overview.kpis

    return (
        <Stack direction={"row"} spacing={2} mt={2} justifyContent={"center"} >
            <Card
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    backgroundImage: "none",
                    borderRadius: "8px",
                    p: "6px 12px",
                    flexBasis: "calc(20% - 16px)",
                    flexGrow: 0,
                    boxShadow: 3
                }}
            >
                <Stack justifyContent={"space-between"} height={"100%"}>
                    <Typography sx={{ fontSize: 18, fontWeight: 300 }}>Active Shipments</Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 600 }}>{values.activeShipments}</Typography>
                </Stack>

            </Card>
            <Card
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    backgroundImage: "none",
                    borderRadius: "8px",
                    p: "6px 12px",
                    flexBasis: "calc(20% - 16px)",
                    flexGrow: 0,
                }}
            >
                <Stack justifyContent={"space-between"} height={"100%"}>
                    <Typography sx={{ fontSize: 18, fontWeight: 300 }}>Delayed Shipments</Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 600 }}>{values.delayedShipments}</Typography>
                </Stack>

            </Card>
            <Card
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    backgroundImage: "none",
                    borderRadius: "8px",
                    p: "6px 12px",
                    flexBasis: "calc(20% - 16px)",
                    flexGrow: 0,
                }}
            >
                <Stack justifyContent={"space-between"} height={"100%"}>
                    <Typography sx={{ fontSize: 18, fontWeight: 300 }}>Vehicles On Trip</Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 600 }}>{values.vehiclesOnTrip}</Typography>
                </Stack>

            </Card>
            <Card
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    backgroundImage: "none",
                    borderRadius: "8px",
                    p: "6px 12px",
                    flexBasis: "calc(20% - 16px)",
                    flexGrow: 0,
                }}
            >
                <Stack justifyContent={"space-between"} height={"100%"}>
                    <Typography sx={{ fontSize: 18, fontWeight: 300 }}>Vehicles In Service</Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 600 }}>{values.vehiclesInService}</Typography>
                </Stack>

            </Card>
            <Card
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    backgroundImage: "none",
                    borderRadius: "8px",
                    p: "6px 12px",
                    flexBasis: "calc(20% - 16px)",
                    flexGrow: 0,
                }}
            >
                <Stack justifyContent={"space-between"} height={"100%"}>
                    <Typography sx={{ fontSize: 18, fontWeight: 300 }}>Available Vehicles</Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 600 }}>{values.availableVehicles}</Typography>
                </Stack>

            </Card>
            <Card
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    backgroundImage: "none",
                    borderRadius: "8px",
                    p: "6px 12px",
                    flexBasis: "calc(20% - 16px)",
                    flexGrow: 0,
                }}
            >
                <Stack justifyContent={"space-between"} height={"100%"}>
                    <Typography sx={{ fontSize: 18, fontWeight: 300 }}>Active Drivers</Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 600 }}>{values.activeDrivers}</Typography>
                </Stack>

            </Card>
            <Card
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    backgroundImage: "none",
                    borderRadius: "8px",
                    p: "6px 12px",
                    flexBasis: "calc(20% - 16px)",
                    flexGrow: 0,
                }}
            >
                <Stack justifyContent={"space-between"} height={"100%"}>
                    <Typography sx={{ fontSize: 18, fontWeight: 300 }}>Warehouses</Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 600 }}>{values.warehouses}</Typography>
                </Stack>

            </Card>
            <Card
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    backgroundImage: "none",
                    borderRadius: "8px",
                    p: "6px 12px",
                    flexBasis: "calc(20% - 16px)",
                    flexGrow: 0,
                }}
            >
                <Stack justifyContent={"space-between"} height={"100%"}>
                    <Typography sx={{ fontSize: 18, fontWeight: 300 }}>Inventory Skus</Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 600 }}>{values.inventorySkus}</Typography>
                </Stack>

            </Card>

        </Stack>

    )
}

export default OverviewKpiCard




