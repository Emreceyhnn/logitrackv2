"use client"
import { Card, Grid, Stack, Typography, useTheme } from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';
import mockData from "@/app/lib/data.json";

const DriverPerformanceCharts = () => {
    const theme = useTheme();
    const drivers = mockData.drivers;

    // Prepare data for charts
    const driverNames = drivers.map(d => d.fullName.split(' ')[0]); // First names for brevity
    const ratings = drivers.map(d => d.rating.avg);
    const workingHours = drivers.map(d => Math.round(d.compliance.workingHours.weekMinutes / 60)); // Convert to hours

    return (
        <Grid container spacing={2} mt={2}>
            {/* Chart 1: Driver Ratings */}
            <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, borderRadius: "12px", boxShadow: 3 }}>
                    <Stack spacing={2}>
                        <Typography variant="h6" fontWeight={600}>
                            Driver Ratings
                        </Typography>
                        <BarChart
                            xAxis={[{
                                scaleType: 'band',
                                data: driverNames,
                                label: 'Driver'
                            }]}
                            series={[{
                                data: ratings,
                                color: theme.palette.primary.main,
                                label: 'Rating (0-5)'
                            }]}
                            height={300}
                            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                            borderRadius={4}
                        />
                    </Stack>
                </Card>
            </Grid>

            {/* Chart 2: Weekly Working Hours */}
            <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, borderRadius: "12px", boxShadow: 3 }}>
                    <Stack spacing={2}>
                        <Typography variant="h6" fontWeight={600}>
                            Weekly Working Hours
                        </Typography>
                        <BarChart
                            xAxis={[{
                                scaleType: 'band',
                                data: driverNames,
                                label: 'Driver'
                            }]}
                            series={[{
                                data: workingHours,
                                color: theme.palette.secondary.main,
                                label: 'Hours this week'
                            }]}
                            height={300}
                            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                            borderRadius={4}
                        />
                    </Stack>
                </Card>
            </Grid>
        </Grid>
    );
};

export default DriverPerformanceCharts;
