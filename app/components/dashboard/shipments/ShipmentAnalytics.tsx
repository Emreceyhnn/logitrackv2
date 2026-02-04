"use client";
import { Card, Stack, Typography, useTheme, Box } from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import mockData from "@/app/lib/mockData.json";

export default function ShipmentAnalytics() {
    const theme = useTheme();

    const statusCounts = mockData.shipments.reduce((acc, curr) => {
        const status = curr.status.replace('_', ' ');
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const pieData = Object.keys(statusCounts).map((status, index) => ({
        id: index,
        value: statusCounts[status],
        label: status,
        color: status === 'DELIVERED' ? theme.palette.success.main :
               status === 'IN_TRANSIT' ? theme.palette.info.main :
               status === 'DELAYED' ? theme.palette.error.main :
               theme.palette.warning.main
    }));


    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const volumeByDay = mockData.shipments.reduce((acc, curr) => {
        const date = new Date(curr.dates.created);
        const day = days[date.getDay()];
        acc[day] = (acc[day] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Ensure all days are present for x-axis consistency
    const barData = days.map(day => ({
        day,
        volume: volumeByDay[day] || Math.floor(Math.random() * 5) + 1 // Filling gaps for visual demo if mock dates are sparse
    }));

    return (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} mt={3}>
            {/* Status Distribution */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Card sx={{
                    flex: 1,
                    p: 2.5,
                    borderRadius: "16px",
                    boxShadow: theme.shadows[2],
                    display: 'flex',
                    flexDirection: 'column',
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    background: `${theme.palette.background.paper}`,
                    "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: theme.shadows[8],
                    },
                }}>
                    <Stack spacing={0.5} sx={{ mb: 3 }}>
                        <Typography variant="h6" fontWeight={700}>
                            Status Overview
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Live breakdown of shipment statuses
                        </Typography>
                    </Stack>

                    <Box sx={{ flex: 1, minHeight: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <PieChart
                            series={[
                                {
                                    data: pieData,
                                    innerRadius: 60,
                                    outerRadius: 100,
                                    paddingAngle: 5,
                                    cornerRadius: 8,
                                    highlightScope: { fade: 'global', highlight: 'item' },
                                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                },
                            ]}
                            height={300}
                            margin={{ right: 150 }}
                        />
                    </Box>
                </Card>
            </Box>

            {/* Daily Volume */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Card sx={{
                    flex: 1,
                    p: 2.5,
                    borderRadius: "16px",
                    boxShadow: theme.shadows[2],
                    display: 'flex',
                    flexDirection: 'column',
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    background: `${theme.palette.background.paper}`,
                    "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: theme.shadows[8],
                    },
                }}>
                    <Stack spacing={0.5} sx={{ mb: 3 }}>
                        <Typography variant="h6" fontWeight={700}>
                            Volume Trend
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Daily shipment creation volume (Last 7 Days)
                        </Typography>
                    </Stack>

                    <Box sx={{ flex: 1, minHeight: 300 }}>
                        <BarChart
                            dataset={barData}
                            xAxis={[{ scaleType: 'band', dataKey: 'day' }]}
                            series={[{ 
                                dataKey: 'volume', 
                                label: 'Shipments', 
                                color: theme.palette.primary.main,
                                valueFormatter: (v) => `${v} units`
                            }]}
                            height={300}
                            borderRadius={8}
                        />
                    </Box>
                </Card>
            </Box>
        </Stack>
    );
}
