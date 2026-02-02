import { PieChart } from '@mui/x-charts/PieChart';
import { Card, Stack, Typography, Grid, Paper, useTheme, Box } from "@mui/material";
import mockData from "@/app/lib/data.json";

export default function InventoryCharts() {
    const theme = useTheme();

    // 1. Stock Value by Category
    const categoryStats = mockData.inventory.items.reduce((acc, item) => {
        // Deterministic hash for price
        const seed = item.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const unitPrice = (seed % 400) + 20;

        // Find aggregated stock
        let totalStock = 0;
        mockData.inventory.stockByWarehouse.forEach(wh => {
            const line = wh.lines.find(l => l.skuId === item.id);
            if (line) totalStock += line.available;
        });

        const value = totalStock * unitPrice;

        if (!acc[item.category]) acc[item.category] = { value: 0, count: 0 };
        acc[item.category].value += value;
        acc[item.category].count += 1;
        return acc;
    }, {} as Record<string, { value: number, count: number }>);

    const valuePieData = Object.keys(categoryStats).map((cat, index) => ({
        id: index,
        value: categoryStats[cat].value,
        label: cat
    }));

    const countPieData = Object.keys(categoryStats).map((cat, index) => ({
        id: index,
        value: categoryStats[cat].count,
        label: cat
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
                            Inventory Value
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Distribution by category ($)
                        </Typography>
                    </Stack>

                    <Box sx={{ flex: 1, minHeight: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <PieChart
                            series={[
                                {
                                    data: valuePieData,
                                    highlightScope: { fade: 'global', highlight: 'item' },
                                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                    innerRadius: 40,
                                    paddingAngle: 2,
                                    cornerRadius: 4,
                                },
                            ]}
                            height={300}
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
                            SKU Count
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Items count by category
                        </Typography>
                    </Stack>

                    <Box sx={{ flex: 1, minHeight: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <PieChart
                            series={[
                                {
                                    data: countPieData,
                                    highlightScope: { fade: 'global', highlight: 'item' },
                                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                    innerRadius: 40,
                                    paddingAngle: 2,
                                    cornerRadius: 4,
                                },
                            ]}
                            height={300}
                            colors={['#0088FE', '#00C49F', '#FFBB28', '#FF8042']}
                        />
                    </Box>
                </Card>
            </Box>
        </Stack>
    );
}
