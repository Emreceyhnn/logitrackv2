"use client"
import { Card, Stack, Typography, useTheme } from "@mui/material"
import mockData from "@/app/lib/mockData.json";

const WarehouseKpiCard = () => {
    const theme = useTheme()

    const warehouses = mockData.warehouses;
    const totalWarehouses = warehouses.length;
    const totalSkus = mockData.inventory.catalog.length;

    const totalPalletsCapacity = warehouses.reduce((acc, curr) => acc + curr.capacity.totalPallets, 0);


    const totalVolumeCapacity = warehouses.reduce((acc, curr) => acc + curr.capacity.totalVolumeM3, 0);


    const kpiItems = [
        { label: "WAREHOUSES", value: totalWarehouses },
        { label: "INVENTORY SKUS", value: totalSkus.toLocaleString() },
        { label: "TOTAL PALLETS", value: totalPalletsCapacity.toLocaleString() },
        { label: "TOTAL VOLUME (M³)", value: totalVolumeCapacity.toLocaleString() }
    ];

    return (
        <Stack direction={"row"} spacing={2} sx={{ width: '100%' }}>
            {kpiItems.map((item, index) => (
                <Card
                    key={index}
                    sx={{
                        backgroundColor: theme.palette.background.paper,
                        backgroundImage: "none",
                        borderRadius: "12px",
                        p: 3,
                        flex: 1,
                        boxShadow: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}
                >
                    <Stack spacing={1}>
                        <Typography variant="overline" color="text.secondary" fontWeight={600} sx={{ letterSpacing: 1 }}>
                            {item.label}
                        </Typography>
                        <Typography variant="h4" fontWeight={600}>
                            {item.value}
                        </Typography>
                    </Stack>
                </Card>
            ))}
        </Stack>
    )
}

export default WarehouseKpiCard
