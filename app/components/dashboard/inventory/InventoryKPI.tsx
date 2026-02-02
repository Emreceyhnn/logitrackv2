"use client";

import { Card, Stack, Typography, useTheme, Box, alpha } from "@mui/material";
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

interface InventoryItem {
    id: string;
    sku: string;
    name: string;
    category: string;
    onHand: number;
    unitPrice: number;
    status: string;
    warehouseCodes: string[];
    lastUpdated: string;
    reorderPoint: number;
}

interface InventoryKPIProps {
    items: InventoryItem[];
}

const InventoryKPI = ({ items }: InventoryKPIProps) => {
    const theme = useTheme();

    const totalItems = items.length;
    const lowStockItems = items.filter((item) => item.status === 'LOW_STOCK').length;
    const outOfStockItems = items.filter((item) => item.status === 'OUT_OF_STOCK').length;
    const totalValue = items.reduce((acc, item) => acc + (item.onHand * item.unitPrice), 0);

    const kpiItems = [
        {
            label: "TOTAL ITEMS",
            value: totalItems.toLocaleString(),
            icon: <InventoryIcon color="inherit" />,
            color: theme.palette.primary.main,
            bgColor: alpha(theme.palette.primary.main, 0.1),
        },
        {
            label: "LOW STOCK",
            value: lowStockItems.toLocaleString(),
            icon: <WarningIcon color="inherit" />,
            color: theme.palette.warning.main,
            bgColor: alpha(theme.palette.warning.main, 0.1),
        },
        {
            label: "OUT OF STOCK",
            value: outOfStockItems.toLocaleString(),
            icon: <ErrorIcon color="inherit" />,
            color: theme.palette.error.main,
            bgColor: alpha(theme.palette.error.main, 0.1),
        },
        {
            label: "TOTAL VALUE",
            value: new Intl.NumberFormat('en-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(totalValue),
            icon: <AttachMoneyIcon color="inherit" />,
            color: theme.palette.success.main, // Using Success color for consistency
            bgColor: alpha(theme.palette.success.main, 0.1),
        },
    ];

    return (
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ width: "100%", mb: 3 }}>
            {kpiItems.map((item, index) => (
                <Card
                    key={index}
                    sx={{
                        flex: 1,
                        p: 2,
                        borderRadius: "16px",
                        boxShadow: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderLeft: `4px solid ${item.color}`,
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 4
                        }
                    }}
                >
                    <Stack spacing={0.5}>
                        <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ letterSpacing: 0.5 }}>
                            {item.label}
                        </Typography>
                        <Typography variant="h4" fontWeight={800} sx={{ color: theme.palette.text.primary }}>
                            {item.value}
                        </Typography>
                    </Stack>
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: "12px",
                            backgroundColor: item.bgColor,
                            color: item.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {item.icon}
                    </Box>
                </Card>
            ))}
        </Stack>
    );
};

export default InventoryKPI;
