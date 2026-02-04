"use client"
import { Box, Stack, Typography, useTheme, Divider } from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';
import CustomCard from "../../cards/card";
import mockData from "@/app/lib/mockData.json";

const DriverPerformanceCharts = () => {
    const theme = useTheme();
    const drivers = mockData.staff.drivers;

    // Prepare data for charts
    const driverNames = drivers.map(d => d.fullName.split(' ')[0]); // First names for brevity
    const ratings = drivers.map(d => d.rating.avg);
    const workingHours = drivers.map(d => Math.round(d.compliance.workingHours.weekMinutes / 60)); // Convert to hours

    return (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mt={2}>
            {/* Chart 1: Driver Ratings */}
            <Box flex={1}>
                <CustomCard sx={{ height: "100%", p: 2 }}>
                    <Stack spacing={2}>
                        <Typography variant="h6" fontWeight={600} sx={{ p: 1 }}>
                            Driver Ratings
                        </Typography>
                        <Divider />
                        <BarChart
                            xAxis={[{
                                scaleType: 'band',
                                data: driverNames,
                                label: 'Driver',
                                tickLabelStyle: { fill: theme.palette.text.secondary }
                            }]}
                            yAxis={[{
                                label: 'Rating (0-5)',
                                labelStyle: { fill: theme.palette.text.secondary }
                            }]}
                            series={[{
                                data: ratings,
                                color: theme.palette.primary.main,
                                label: 'Rating (0-5)',
                                highlightScope: { highlight: 'item', fade: 'global' },
                            }]}
                            height={300}
                            margin={{ top: 10, bottom: 40, left: 40, right: 10 }}
                            borderRadius={8}
                            slotProps={{
                                legend: {

                                }
                            }}
                        />
                    </Stack>
                </CustomCard>
            </Box>

            {/* Chart 2: Weekly Working Hours */}
            <Box flex={1}>
                <CustomCard sx={{ height: "100%", p: 2 }}>
                    <Stack spacing={2}>
                        <Typography variant="h6" fontWeight={600} sx={{ p: 1 }}>
                            Weekly Working Hours
                        </Typography>
                        <Divider />
                        <BarChart
                            xAxis={[{
                                scaleType: 'band',
                                data: driverNames,
                                label: 'Driver',
                                tickLabelStyle: { fill: theme.palette.text.secondary }
                            }]}
                            yAxis={[{
                                label: 'Hours',
                                labelStyle: { fill: theme.palette.text.secondary }
                            }]}
                            series={[{
                                data: workingHours,
                                color: theme.palette.secondary.main,
                                label: 'Hours this week',
                                highlightScope: { highlight: 'item', fade: 'global' },
                            }]}
                            height={300}
                            margin={{ top: 10, bottom: 40, left: 40, right: 10 }}
                            borderRadius={8}
                            slotProps={{
                                legend: {

                                }
                            }}
                        />
                    </Stack>
                </CustomCard>
            </Box>
        </Stack>
    );
};

export default DriverPerformanceCharts;
