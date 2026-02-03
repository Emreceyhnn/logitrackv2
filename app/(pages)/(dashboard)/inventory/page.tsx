"use client";

import React, { useMemo, useState } from 'react';
import { Box } from '@mui/material';
import mockData from "@/app/lib/data.json";
import InventoryHeader from '@/app/components/dashboard/inventory/InventoryHeader';
import InventoryKPI from '@/app/components/dashboard/inventory/InventoryKPI';
import InventoryTable from '@/app/components/dashboard/inventory/InventoryTable';

export default function InventoryPage() {
    const [searchTerm, setSearchTerm] = useState("");

    // Process data centrally
    const inventoryData = useMemo(() => {
        return mockData.inventory.items.map(item => {
            // Aggregate stock
            let onHand = 0;
            let lastUpdated = "";
            const warehouseCodes: string[] = [];

            mockData.inventory.stockByWarehouse.forEach(wh => {
                const line = wh.lines.find(l => l.skuId === item.id);
                if (line) {
                    onHand += line.available; // Using available as onHand for simplicity of "sellable" stock
                    if (line.lastCountAt > lastUpdated) lastUpdated = line.lastCountAt;

                    const warehouse = mockData.warehouses.find(w => w.id === wh.warehouseId);
                    if (warehouse) warehouseCodes.push(warehouse.code);
                }
            });

            // Determine Status
            let status = "IN_STOCK";
            if (onHand === 0) status = "OUT_OF_STOCK";
            else if (onHand <= item.reorderPoint) status = "LOW_STOCK";

            // Mock Price (consistent per item ID using simple hash or just static random seeded by ID char codes)
            const seed = item.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const unitPrice = (seed % 400) + 20; // Price between 20 and 420

            return {
                id: item.id,
                sku: item.sku,
                name: item.name,
                category: item.category,
                onHand,
                unitPrice,
                status,
                warehouseCodes,
                lastUpdated,
                reorderPoint: item.reorderPoint // Needed for KPI usage if we moved logic there, but here we passed computed status. 
                // Actually KPI uses onHand and unitPrice to sum value.
            };
        });
    }, []);

    // Filter data
    const filteredData = useMemo(() => {
        if (!searchTerm) return inventoryData;
        const lowerTerm = searchTerm.toLowerCase();
        return inventoryData.filter(item =>
            item.name.toLowerCase().includes(lowerTerm) ||
            item.sku.toLowerCase().includes(lowerTerm) ||
            item.category.toLowerCase().includes(lowerTerm)
        );
    }, [inventoryData, searchTerm]);

    return (
        <Box sx={{ p: 3 }}>
            <InventoryHeader
                onSearch={setSearchTerm}
                onFilterClick={() => console.log('Filter clicked')}
                onAddClick={() => console.log('Add clicked')}
            />

            <InventoryKPI items={filteredData} />

            <InventoryTable items={filteredData} />
        </Box>
    );
}
