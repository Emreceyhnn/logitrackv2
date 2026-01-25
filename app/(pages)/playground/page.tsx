"use client";

import FuelByVehicleCard from "@/app/components/cards/fuelByVehicleCard";
import AlertInventoryCard from "@/app/components/cards/inventoryCard";
import MapCard from "@/app/components/cards/mapCard";
import OnTimeTrendsCard from "@/app/components/cards/onTimeTrends";
import PicksPacksDailyCard from "@/app/components/cards/picsPacksDailyCard";
import ShipmentOnStatusCard from "@/app/components/cards/shipmentsByStatusCard";
import WarehouseCapacityCard from "@/app/components/cards/warehouseCapacityCard";
import CustomDialog from "@/app/components/dialogs/customDialog";
import GoogleMapView from "@/app/components/map";
import CustomToast from "@/app/components/toast";
import { Box, Button, Stack } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

export default function Playground() {


  return (
    <Box>
      This is playground page
      <Stack>
        <MapCard />


      </Stack>
    </Box>
  );
}
