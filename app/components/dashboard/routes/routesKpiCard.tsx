"use client"
import { Card, Stack, Typography, useTheme } from "@mui/material"
import mockData from "@/app/lib/data.json";

const RoutesKpiCard = () => {
    const theme = useTheme()

    const today = new Date().toISOString().slice(0, 10);

    const activeRoutes = mockData.routes.map(i => i.status === "ACTIVE").length
    const inProgress = mockData.routes.map(i => i.status === "IN_PROGRESS").length
    const completedToday = mockData.routes.map(i => i.status === "COMPLETED" && i.completedDate === today).length
    const delayedRoutes = mockData.routes.map(i => i.status === "DELAYED").length

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
                    <Typography sx={{ fontSize: 18, fontWeight: 300 }}>ACTIVE ROUTES</Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 600 }}>{activeRoutes}</Typography>
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
                    <Typography sx={{ fontSize: 18, fontWeight: 300 }}>IN PROGRESS</Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 600 }}>{inProgress}</Typography>
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
                    <Typography sx={{ fontSize: 18, fontWeight: 300 }}>Completed Today</Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 600 }}>{completedToday}</Typography>
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
                    <Typography sx={{ fontSize: 18, fontWeight: 300 }}>Delayed Routes</Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 600 }}>{delayedRoutes}</Typography>
                </Stack>

            </Card>



        </Stack>

    )
}

export default RoutesKpiCard