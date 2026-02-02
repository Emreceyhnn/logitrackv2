"use client";

import { Stack, Typography, Button, Box, useTheme, TextField, MenuItem } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export default function AnalyticsHeader() {
    const theme = useTheme();

    return (
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'start', md: 'center' }} spacing={2} sx={{ mb: 4 }}>
            <Box>
                <Typography variant="h4" fontWeight={700} sx={{ color: theme.palette.text.primary }}>
                    Business Analytics
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Executive overview of operational performance and financial trends
                </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
                <TextField
                    select
                    defaultValue="30"
                    size="small"
                    sx={{ width: 150 }}
                    slotProps={{ input: { startAdornment: <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> } }}
                >
                    <MenuItem value="7">Last 7 Days</MenuItem>
                    <MenuItem value="30">Last 30 Days</MenuItem>
                    <MenuItem value="90">Last Quarter</MenuItem>
                    <MenuItem value="365">Year to Date</MenuItem>
                </TextField>

                <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                    Export Report
                </Button>
            </Stack>
        </Stack>
    );
}
