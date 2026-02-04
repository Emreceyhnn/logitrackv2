"use client";

import React, { useMemo, useState } from 'react';
import { Box } from '@mui/material';
import mockData from "@/app/lib/mockData.json";
import InventoryHeader from '@/app/components/dashboard/inventory/InventoryHeader';
import InventoryKPI from '@/app/components/dashboard/inventory/InventoryKPI';
import InventoryTable from '@/app/components/dashboard/inventory/InventoryTable';

export default function InventoryPage() {
    const [searchTerm, setSearchTerm] = useState("");

    // Process data centrally
    const inventoryData = useMemo(() => {
        return mockData.inventory.catalog.map(item => {
            // Aggregate stock
            let onHand = 0;
            let lastUpdated = "";
            const warehouseCodes: string[] = [];

            // Filter stock items for this SKU
            const stockLines = mockData.inventory.stock.filter(s => s.skuId === item.id);

            stockLines.forEach(line => {
                const available = line.quantity - line.reserved;
                onHand += available;
                
                // Mocking lastUpdated as it's missing in stock items, using meta or fallback
                const now = new Date().toISOString(); 
                if (now > lastUpdated) lastUpdated = now;

                const warehouse = mockData.warehouses.find(w => w.id === line.warehouseId);
                if (warehouse) warehouseCodes.push(warehouse.code);
            });

            // Determine Status
            let status = "IN_STOCK";
            if (onHand === 0) status = "OUT_OF_STOCK";
            else if (onHand <= (item.reorderPoint || 0)) status = "LOW_STOCK";

            // Mock Price logic
            const seed = item.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const unitPrice = item.unitPrice || ((seed % 400) + 20);

            return {
                id: item.id,
                sku: item.code, // catalog uses 'code' for SKU
                name: item.name,
                category: item.category,
                onHand,
                unitPrice,
                status,
                warehouseCodes,
                lastUpdated,
                reorderPoint: item.reorderPoint || 0
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
