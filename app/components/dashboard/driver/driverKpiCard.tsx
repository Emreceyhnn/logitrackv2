"use client"
import { Card, Stack, Typography, useTheme } from "@mui/material"
import mockData from "@/app/lib/data.json";

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
        { label: "Total Drivers", value: totalDrivers },
        { label: "On Duty", value: onDuty },
        { label: "Off Duty", value: offDuty },
        { label: "Compliance Issues", value: complianceIssues },
        { label: "Avg Rating", value: avgRating }
    ];

    return (
        <Stack direction={"row"} spacing={2} mt={2} justifyContent={"center"} >
            {kpiItems.map((item, index) => (
                <Card
                    key={index}
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
                        <Typography sx={{ fontSize: 18, fontWeight: 300 }}>{item.label}</Typography>
                        <Typography sx={{ fontSize: 24, fontWeight: 600 }}>{item.value}</Typography>
                    </Stack>
                </Card>
            ))}
        </Stack>
    )
}

export default DriverKpiCard
