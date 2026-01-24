"use client";

import FuelByVehicleCard from "@/app/components/cards/fuelByVehicleCard";
import AlertInventoryCard from "@/app/components/cards/inventoryCard";
import OnTimeTrendsCard from "@/app/components/cards/onTimeTrends";
import PicksPacksDailyCard from "@/app/components/cards/picsPacksDailyCard";
import ShipmentOnStatusCard from "@/app/components/cards/shipmentsByStatusCard";
import WarehouseCapacityCard from "@/app/components/cards/warehouseCapacityCard";
import CustomDialog from "@/app/components/dialogs/customDialog";
import CustomToast from "@/app/components/toast";
import { Box, Button, Stack } from "@mui/material";
import { useState } from "react";

export default function Playground() {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      This is playground page
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        dakmsmdads
      </Button>
      <Stack>

        <CustomToast
          open={open}
          onClose={handleClose}
          type="info"
          message="İşlem başarılı"
        />
        <ShipmentOnStatusCard />
        <FuelByVehicleCard />
        <OnTimeTrendsCard />
        <WarehouseCapacityCard />
        <AlertInventoryCard />
        <PicksPacksDailyCard />
      </Stack>
    </Box>
  );
}
