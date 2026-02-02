import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { Card, Stack, Typography, Grid, Box, useTheme, Paper } from "@mui/material";
import mockData from "@/app/lib/data.json";

export default function ShipmentCharts() {
    const theme = useTheme();

    // 1. Status Distribution (Pie)
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
            status === 'IN TRANSIT' ? theme.palette.info.main :
                theme.palette.warning.main
    }));

    // 2. Volume by Route (Bar)
    const routeShipmentCounts = mockData.routes.map(route => ({
        route: route.code,
        count: route.shipmentIds.length
    }));

    return (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Card sx={{
                    p: 3,
                    borderRadius: 4,
                    boxShadow: theme.shadows[2],
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Stack spacing={0.5} sx={{ mb: 3 }}>
                        <Typography variant="h6" fontWeight={700}>
                            Shipment Status
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Distribution of current shipment statuses
                        </Typography>
                    </Stack>

                    <Box sx={{ flex: 1, minHeight: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <PieChart
                            series={[
                                {
                                    data: pieData,
                                    innerRadius: 30,
                                    outerRadius: 100,
                                    paddingAngle: 5,
                                    cornerRadius: 5,
                                    highlightScope: { fade: 'global', highlight: 'item' },
                                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                },
                            ]}
                            width={400}
                            height={250}
                            slotProps={{
                                legend: { hidden: true } as any
                            }}
                        />
                    </Box>
                </Card>
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Card sx={{
                    p: 3,
                    borderRadius: 4,
                    boxShadow: theme.shadows[2],
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Stack spacing={0.5} sx={{ mb: 3 }}>
                        <Typography variant="h6" fontWeight={700}>
                            Volume by Route
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Total shipments per route code
                        </Typography>
                    </Stack>

                    <Box sx={{ flex: 1, minHeight: 300 }}>
                        <BarChart
                            dataset={routeShipmentCounts}
                            xAxis={[{ scaleType: 'band', dataKey: 'route' }]}
                            series={[{ dataKey: 'count', label: 'Shipments', color: theme.palette.primary.main }]}
                            height={300}
                            borderRadius={5}
                            grid={{ horizontal: true }}
                        />
                    </Box>
                </Card>
            </Box>
        </Stack>
    );
}
