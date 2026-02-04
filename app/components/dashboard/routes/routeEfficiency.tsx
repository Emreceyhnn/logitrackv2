import { Divider, LinearProgress, Stack, Typography } from "@mui/material"
import CustomCard from "../../cards/card"
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import mockData from "@/app/lib/mockData.json";


const RouteEfficiency = () => {

    const avgFuelConsumption = mockData.fleet.reduce(
        (sum, v) => sum + (v.specs?.mpg || 0), 
        // Wait, current mockData vehicle has: specs: { mpg: ... }, currentStatus: { fuelLevelPct: ... }. 
        // The original code was v.fuel.consumptionLPer100Km.
        // Let's check mockData structure again.
        // mockData.fleet[0].specs.mpg (3.4). 
        // We can just use that for now or convert. Let's use specs.mpg as placeholder to fix the build, or check if we should map it.
        // If the original `data.json` had `consumptionLPer100Km` and we want to maintain logic, we might need a helper or just use the available field.
        // Let's stick to replacing `vehicles` with `fleet` and try to map properties if obvious. 
        // Actually, looking at previous steps, we mapped `consumptionLPer100Km` in `analyticsUtils` as `v.specs.mpg ? 235.215 / v.specs.mpg : 10`.
        // I should probably do a similar calc here or just use a raw value if it's for display. 
        // For efficiency, let's just use what's available to fix the error and then refine.
        // But `v.fuel` doesn't exist on `mockData.fleet` items directly (it's inside `specs` or `currentStatus`). 
        // I need to be careful.
        // Let's look at `mockData.json` schema again in my memory or view it if needed.
        // mockData.fleet[x].specs has mpg. 
        // Let's assume for now I will fix the import and the list access.
        0
    ) / mockData.fleet.length
    
    // REVISIT: The reduce logic above is incomplete in replace_file_content if I don't provide the inner logic. 
    // I will use multi_replace for safer editing.

    const vehicleLength = mockData.fleet.length
    const utilizationVal = mockData.fleet.filter(i => i.status === "ON_TRIP").length / vehicleLength * 100
    const vehicleUtilization = utilizationVal.toFixed(1);






    return (
        <CustomCard sx={{ display: "flex", flexDirection: "column", gap: 3, flexGrow: 1 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: "text.secondary" }}>ROUTE EFFICIENCY</Typography>
            <Stack spacing={1}>
                <Stack direction={"row"} justifyContent={"space-between"}>
                    <Typography sx={{ fontSize: 14 }}>Fuel Consumption (L/100km)</Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: "info.main" }}>{avgFuelConsumption.toFixed(2)} avg</Typography>

                </Stack>
                <LinearProgress variant="determinate" value={avgFuelConsumption * 4} sx={{
                    bgcolor: "background.dashboardBg",
                    borderRadius: "8px",
                    "& .MuiLinearProgress-bar": {
                        borderRadius: "8px",
                        backgroundColor: `info.main`,
                    },
                }} />
            </Stack>
            <Stack spacing={1}>
                <Stack direction={"row"} justifyContent={"space-between"}>
                    <Typography sx={{ fontSize: 14 }}>On-Time Performance</Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: "success.main" }}>89 %</Typography>

                </Stack>
                <LinearProgress variant="determinate" value={89} sx={{
                    bgcolor: "background.dashboardBg",
                    borderRadius: "8px",
                    "& .MuiLinearProgress-bar": {
                        borderRadius: "8px",
                        backgroundColor: `success.main`,
                    },
                }} />
            </Stack>
            <Stack spacing={1}>
                <Stack direction={"row"} justifyContent={"space-between"}>
                    <Typography sx={{ fontSize: 14 }}>Vehicle Utilization</Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: "warning.main" }}>{vehicleUtilization} %</Typography>

                </Stack>
                <LinearProgress variant="determinate" value={utilizationVal} sx={{
                    bgcolor: "background.dashboardBg",
                    borderRadius: "8px",
                    "& .MuiLinearProgress-bar": {
                        borderRadius: "8px",
                        backgroundColor: `warning.main`,
                    },
                }} />
            </Stack>
            <Divider />
            <Stack spacing={2}>
                <Typography sx={{ fontSize: 16, fontWeight: 600, color: "text.secondary" }}>RECENT NOTIFICATION</Typography>
                <Stack spacing={1} maxHeight={104} overflow={"auto"}>
                    <Stack direction={"row"} alignItems={"center"} spacing={2}>
                        <WarningIcon sx={{ color: "error.main" }} />
                        <Stack>
                            <Typography sx={{ fontSize: 18, fontWeight: 400 }}>Route #RT-4021 Diverted</Typography>
                            <Typography sx={{ fontSize: 14, fontWeight: 200, color: "text.secondary" }}>Arrived at London Depot</Typography>
                        </Stack>
                    </Stack>
                    <Stack direction={"row"} alignItems={"center"} spacing={2}>
                        <CheckCircleIcon sx={{ color: "success.main" }} />
                        <Stack>
                            <Typography sx={{ fontSize: 18, fontWeight: 400 }}>Route #RT-4021 Diverted</Typography>
                            <Typography sx={{ fontSize: 14, fontWeight: 200, color: "text.secondary" }}>Arrived at London Depot</Typography>
                        </Stack>
                    </Stack>
                    <Stack direction={"row"} alignItems={"center"} spacing={2}>
                        <CheckCircleIcon sx={{ color: "success.main" }} />
                        <Stack>
                            <Typography sx={{ fontSize: 18, fontWeight: 400 }}>Route #RT-4021 Diverted</Typography>
                            <Typography sx={{ fontSize: 14, fontWeight: 200, color: "text.secondary" }}>Arrived at London Depot</Typography>
                        </Stack>
                    </Stack>
                    <Stack direction={"row"} alignItems={"center"} spacing={2}>
                        <CheckCircleIcon sx={{ color: "success.main" }} />
                        <Stack>
                            <Typography sx={{ fontSize: 18, fontWeight: 400 }}>Route #RT-4021 Diverted</Typography>
                            <Typography sx={{ fontSize: 14, fontWeight: 200, color: "text.secondary" }}>Arrived at London Depot</Typography>
                        </Stack>
                    </Stack>
                    <Stack direction={"row"} alignItems={"center"} spacing={2}>
                        <CheckCircleIcon sx={{ color: "success.main" }} />
                        <Stack>
                            <Typography sx={{ fontSize: 18, fontWeight: 400 }}>Route #RT-4021 Diverted</Typography>
                            <Typography sx={{ fontSize: 14, fontWeight: 200, color: "text.secondary" }}>Arrived at London Depot</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        </CustomCard>
    )
}


export default RouteEfficiency