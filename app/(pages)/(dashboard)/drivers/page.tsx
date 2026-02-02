"use client"

import DriverKpiCard from "@/app/components/dashboard/driver/driverKpiCard";
import DriverTable from "@/app/components/dashboard/driver/driverTable";
import DriverPerformanceCharts from "@/app/components/dashboard/driver/driverPerformanceCharts";
import { Box, Divider, Stack, Typography } from "@mui/material";



export default function DriverPage() {

    return (
        <Box position={"relative"} p={4} width={"100%"}>
            <Typography sx={{
                fontSize: 24,
                fontWeight: 600,
                letterSpacing: "-2%"
            }}>Drivers</Typography>
            <Divider />
            <DriverKpiCard />
            <DriverPerformanceCharts />
            <Stack mt={2}>
                <DriverTable />
            </Stack>
        </Box>
    )
}
