"use client";

import FuelByVehicleCard from "@/app/components/dashboard/overview/fuelByVehicleCard";
import AlertInventoryCard from "@/app/components/dashboard/overview/inventoryCard";
import MapCard from "@/app/components/dashboard/overview/overViewMapCard";
import OnTimeTrendsCard from "@/app/components/dashboard/overview/onTimeTrends";
import PicksPacksDailyCard from "@/app/components/dashboard/overview/picsPacksDailyCard";
import ShipmentOnStatusCard from "@/app/components/dashboard/overview/shipmentsByStatusCard";
import WarehouseCapacityCard from "@/app/components/dashboard/overview/warehouseCapacityCard";
import CustomDialog from "@/app/components/dialogs/customDialog";
import GoogleMapView from "@/app/components/map";
import CustomToast from "@/app/components/toast";
import { Box, Button, Stack } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import mockData from "@/app/lib/data.json"
import DriverCard from "@/app/components/cards/driverCard";
import WarehouseDialog from "@/app/components/dialogs/warehouse";

export default function Playground() {

  const driver = mockData.drivers[0]

  return (
    <Box>
      This is playground page
      <Stack>
        <DriverCard {...driver} />
        <WarehouseDialog open={true} onClose={() => { }} warehouseData={mockData.warehouses[0]} />
      </Stack>
    </Box>
  );
}
