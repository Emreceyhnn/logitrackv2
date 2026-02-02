import { LinearProgress, Stack, Typography } from "@mui/material"
import CustomCard from "../../cards/card"


interface Params {
    routeId: string
}

const RoutesTelemetryCards = (params: Params) => {

    return (
        <Stack spacing={2} px={2}>
            <Typography>LIVE TELEMETRY</Typography>
            <Stack direction={"row"} spacing={2}>
                <CustomCard sx={{ padding: 4 }}>
                    <Stack spacing={1}>
                        <Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.secondary" }}>DIST. TRAVELLED</Typography>
                        <Stack direction={"row"} spacing={1} alignItems={"center"}>
                            <Typography>142</Typography>
                            <Typography sx={{ fontSize: 12, fontWeight: 300, color: "text.secondary" }}>km</Typography>
                        </Stack>
                    </Stack>


                </CustomCard>
                <CustomCard sx={{ padding: 4 }}>
                    <Stack spacing={1}>
                        <Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.secondary" }}>Remaining</Typography>
                        <Stack direction={"row"} spacing={1}>
                            <Typography>118</Typography>
                            <Typography sx={{ fontSize: 12, fontWeight: 300, color: "text.secondary" }}>km</Typography>
                        </Stack>
                    </Stack>
                </CustomCard>
            </Stack>
            <CustomCard sx={{ padding: 4 }}>
                <Stack spacing={1}>
                    <Stack direction={"row"} justifyContent={"space-between"}>
                        <Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.secondary" }}>Fuel level</Typography>
                        <Typography sx={{ fontSize: 14, fontWeight: 600, color: "info.main" }}>87%</Typography>

                    </Stack>
                    <LinearProgress variant="determinate" value={87} sx={{
                        bgcolor: "background.dashboardBg",
                        borderRadius: "8px",
                        "& .MuiLinearProgress-bar": {
                            borderRadius: "8px",
                            backgroundColor: `info.main`,
                        },
                    }} />

                </Stack>
            </CustomCard>

        </Stack>
    )
}



export default RoutesTelemetryCards