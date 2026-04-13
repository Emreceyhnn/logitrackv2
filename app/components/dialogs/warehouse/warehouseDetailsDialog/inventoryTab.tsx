"use client";

import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { WarehouseWithRelations } from "@/app/lib/type/warehouse";
import { InventoryWithRelations } from "@/app/lib/type/inventory";
import { getInventory } from "@/app/lib/controllers/inventory";
import InventoryTable from "@/app/components/dashboard/inventory/InventoryTable";

interface InventoryTabProps {
  warehouse: WarehouseWithRelations;
}

const InventoryTab = ({ warehouse }: InventoryTabProps) => {
  const dict = useDictionary();
  const [inventory, setInventory] = useState<InventoryWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const data = await getInventory(warehouse.id);
        if (isMounted) {
          setInventory(data as InventoryWithRelations[]);
        }
      } catch (error) {
        console.error("Failed to fetch inventory for warehouse:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchInventory();

    return () => {
      isMounted = false;
    };
  }, [warehouse.id]);

  return (
    <Box>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h6" fontWeight={600} color="white">
            {dict.warehouses.dialogs.details.currentInventory}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {dict.warehouses.dialogs.details.itemsStoredIn} {warehouse.name}
          </Typography>
        </Box>
      </Box>

      <InventoryTable
        items={inventory}
        loading={loading}
        onSelect={(id) => console.log("Selected inventory item:", id)}
        onEdit={(id) => console.log("Edit inventory item:", id)}
        onDelete={(id) => console.log("Delete inventory item:", id)}
      />
    </Box>
  );
};

export default InventoryTab;
