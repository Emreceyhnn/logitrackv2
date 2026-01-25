"use client"
import { Card, Stack, Typography, useTheme } from "@mui/material"
import mockData from "@/app/lib/data.json";

const VehicleKpiCard = () => {
    const theme = useTheme()

    const totalvehicle = mockData.vehicles.length
    const openIssues = mockData.vehicles.flatMap(i => i.maintenance.openIssues).length
    const docsDueSoon = mockData.vehicles.flatMap(i => i.documents.filter(y => y.status === "DUE_SOON")).length
    const onTrip = mockData.vehicles.map(i => i.status === "ON_TRIP").length
    const avaiLable = mockData.vehicles.map(i => i.status === "AVAILABLE").length
    const inService = mockData.vehicles.map(i => i.status === "IN_SERVICE").length


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
                    <Typography sx={{ fontSize: 18, fontWeight: 300 }}>Total Vehicle</Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 600 }}>{totalvehicle}</Typography>
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
                    <Typography sx={{ fontSize: 18, fontWeight: 300 }}>Available Vehicle</Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 600 }}>{avaiLable}</Typography>
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
                    <Typography sx={{ fontSize: 18, fontWeight: 300 }}>Vehicle in Service</Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 600 }}>{inService}</Typography>
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
                    <Typography sx={{ fontSize: 24, fontWeight: 600 }}>{onTrip}</Typography>
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
                    <Typography sx={{ fontSize: 18, fontWeight: 300 }}>Open Issues</Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 600 }}>{openIssues}</Typography>
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
                    <Typography sx={{ fontSize: 18, fontWeight: 300 }}>Docs Due Soon</Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 600 }}>{docsDueSoon}</Typography>
                </Stack>

            </Card>


        </Stack>

    )
}

export default VehicleKpiCard