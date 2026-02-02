import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { Card, Stack, Typography, Grid, Paper, useTheme, Box, alpha } from "@mui/material";
import mockData from "@/app/lib/data.json";

export default function FleetCharts() {
    const theme = useTheme();

    // 1. Fuel Consumption per Vehicle
    const vehicleFuel = mockData.vehicles.map(v => ({
        plate: v.plate,
        consumption: v.fuel.consumptionLPer100Km,
    }));

    // 2. Odometer vs Maintenance Cost (Mocked correlation)
    const maintenanceAnalysis = mockData.vehicles
        .map(v => {
            const totalCost = v.maintenance?.history?.reduce((sum, h) => sum + h.cost, 0) || 0;
            return {
                plate: v.plate,
                odometer: v.odometerKm,
                cost: totalCost
            };
        })
        .sort((a, b) => a.odometer - b.odometer);

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
                            Fuel Consumption
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Liters per 100km by Vehicle
                        </Typography>
                    </Stack>

                    <Box sx={{ flex: 1, minHeight: 400 }}>
                        <BarChart
                            dataset={vehicleFuel}
                            yAxis={[{ scaleType: 'band', dataKey: 'plate' }]}
                            series={[{
                                dataKey: 'consumption',
                                label: 'L/100km',
                                color: theme.palette.error.main,
                                valueFormatter: (v) => `${v}L`
                            }]}
                            layout="horizontal"
                            borderRadius={4}
                            margin={{ left: 100 }}
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
                            Maintenance Cost Analysis
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Total Cost vs. Odometer Reading
                        </Typography>
                    </Stack>

                    <Box sx={{ flex: 1, minHeight: 400 }}>
                        <LineChart
                            xAxis={[{
                                data: maintenanceAnalysis.map(m => m.odometer),
                                label: 'Odometer (km)',
                                valueFormatter: (v: number) => `${(v / 1000).toFixed(0)}k`
                            }]}
                            series={[
                                {
                                    data: maintenanceAnalysis.map(m => m.cost),
                                    label: 'Total Maint. Cost ($)',
                                    color: theme.palette.warning.main,
                                    area: true,
                                    showMark: false,
                                    curve: "natural"
                                },
                            ]}
                            margin={{ left: 70 }}
                        />
                    </Box>
                </Card>
            </Box>
        </Stack>
    );
}
