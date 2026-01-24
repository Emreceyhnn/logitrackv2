"use client"
import { Card, Stack, Typography, useTheme } from "@mui/material"
import mockData from "@/app/lib/data.json";




const KpiCard = () => {


    const theme = useTheme()


    const values = mockData.analytics.kpis


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
                }}
            >
                <Stack justifyContent={"space-between"} height={"100%"}>
                    <Typography sx={{ fontSize: 18, fontWeight: 300 }}>On Time Delivery Package</Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 600 }}>{values.onTimeDeliveryPct}</Typography>
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
                    <Typography sx={{ fontSize: 18, fontWeight: 300 }}>Average Delay Min</Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 600 }}>{values.avgDelayMin}</Typography>
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
                    <Typography sx={{ fontSize: 18, fontWeight: 300 }}>Average Route Completion</Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 600 }}>{values.avgRouteCompletionPct}</Typography>
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
                    <Typography sx={{ fontSize: 18, fontWeight: 300 }}>Cost Per Km/TRY</Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 600 }}>{values.costPerKmTry}</Typography>
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
                    <Typography sx={{ fontSize: 18, fontWeight: 300 }}>Fuel Cost/TRY</Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 600 }}>{values.fuelCostTry}</Typography>
                </Stack>

            </Card>

        </Stack>

    )
}

export default KpiCard