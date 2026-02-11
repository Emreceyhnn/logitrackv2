"use client";

import React, { useMemo, useState } from "react";
import { Box } from "@mui/material";
import mockData from "@/app/lib/mockData.json";
import InventoryHeader from "@/app/components/dashboard/inventory/InventoryHeader";
import InventoryKPI from "@/app/components/dashboard/inventory/InventoryKPI";
import InventoryTable from "@/app/components/dashboard/inventory/InventoryTable";

export default function InventoryPage() {
  /* --------------------------------- states --------------------------------- */
  const [searchTerm, setSearchTerm] = useState("");
  const [inventoryData, setInventoryData] = useState<any[]>([]);

  /* --------------------------------- effects -------------------------------- */
  React.useEffect(() => {
    const fetchInventory = async () => {
      try {
        const COMPANY_ID = 'cmlgt985b0003x0cuhtyxoihd';
        const USER_ID = 'usr_001';
        const data = await import("@/app/lib/controllers/inventory").then(mod => mod.getInventory(COMPANY_ID, USER_ID));

        const mapped = data.map((item: any) => {
          let status = "IN_STOCK";
          if (item.quantity === 0) status = "OUT_OF_STOCK";
          else if (item.quantity <= (item.minStock || 0)) status = "LOW_STOCK";

          // Mock Price logic for UI consistency
          const seed = item.id
            .split("")
            .reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
          const unitPrice = (seed % 400) + 20;

          return {
            id: item.id,
            sku: item.sku,
            name: item.name,
            category: "General", // Placeholder
            onHand: item.quantity,
            unitPrice: unitPrice,
            status: status,
            warehouseCodes: item.warehouse ? [item.warehouse.code] : [],
            lastUpdated: item.updatedAt.toString(),
            reorderPoint: item.minStock || 0,
          };
        });

        setInventoryData(mapped);
      } catch (error) {
        console.error("Failed to fetch inventory", error);
      }
    };

    fetchInventory();
  }, []);

  /* --------------------------------- filter --------------------------------- */
  const filteredData = useMemo(() => {
    if (!searchTerm) return inventoryData;
    const lowerTerm = searchTerm.toLowerCase();
    return inventoryData.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerTerm) ||
        item.sku.toLowerCase().includes(lowerTerm) ||
        item.category.toLowerCase().includes(lowerTerm)
    );
  }, [inventoryData, searchTerm]);

  return (
    <Box sx={{ p: 3 }}>
      <InventoryHeader
        onSearch={setSearchTerm}
        onFilterClick={() => console.log("Filter clicked")}
        onAddClick={() => console.log("Add clicked")}
      />

      <InventoryKPI items={filteredData} />

      <InventoryTable items={filteredData} />
    </Box>
  );
}
