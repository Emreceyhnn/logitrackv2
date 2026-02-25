"use client";

import AddDriverDialog from "@/app/components/dialogs/driver/addDriverDialog";
import AddRouteDialog from "@/app/components/dialogs/routes/addRouteDialog";
import AddShipmentDialog from "@/app/components/dialogs/shipment/addShipmentDialog";
import AddVehicleDialog from "@/app/components/dialogs/vehicle/addVehicleDialog";
import AddInventoryDialog from "@/app/components/dialogs/inventory/addInventoryDialog";

import { Box, Button, Stack } from "@mui/material";
import { useState } from "react";
import AddCustomerDialog from "../../components/dialogs/customer/addCustomerDialog";
import AddWarehouseDialog from "@/app/components/dialogs/warehouse/addWarehouseDialog";

export default function Playground() {
  const [openDriver, setOpenDriver] = useState(false);
  const [openRoute, setOpenRoute] = useState(false);
  const [openShipment, setOpenShipment] = useState(false);
  const [openVehicle, setOpenVehicle] = useState(false); // New state for AddVehicleDialog
  const [openWarehouse, setOpenWarehouse] = useState(false); // New state for AddWarehouseDialog
  const [openInventory, setOpenInventory] = useState(false); // New state for AddInventoryDialog
  const [openCustomer, setOpenCustomer] = useState(false); // New state for AddCustomerDialog

  const onClose = () => {
    setOpenDriver(false);
    setOpenRoute(false);
    setOpenShipment(false);
    setOpenVehicle(false); // Close vehicle dialog
    setOpenWarehouse(false); // Close warehouse dialog
    setOpenInventory(false);
    setOpenCustomer(false);
  };

  const onSuccess = () => {
    // The original onSuccess used 'setOpen(false)'.
    // Given the new states, it should ideally close all or the specific one.
    // For now, we'll keep it as per the provided snippet's spirit,
    // assuming 'setOpen' was meant to be a generic close.
    // However, to be consistent with the new state variables,
    // and since the instruction implies adding a new dialog,
    // it's more logical to close all.
    // But the instruction's snippet for onSuccess is `setOpen(false);`.
    // I will make it close all dialogs for consistency with onClose.
    setOpenDriver(false);
    setOpenRoute(false);
    setOpenShipment(false);
    setOpenVehicle(false);
    setOpenWarehouse(false); // Close warehouse dialog
    setOpenInventory(false);
    setOpenCustomer(false);
  };

  return (
    <Box>
      This is playground page
      <Stack spacing={2} direction="row">
        <Button variant="contained" onClick={() => setOpenDriver(true)}>
          Open Driver Dialog
        </Button>
        <Button variant="contained" onClick={() => setOpenRoute(true)}>
          Open Route Dialog
        </Button>
        <Button variant="contained" onClick={() => setOpenShipment(true)}>
          Open Shipment Dialog
        </Button>
        <Button variant="contained" onClick={() => setOpenVehicle(true)}>
          Open Vehicle Dialog
        </Button>
        <Button variant="contained" onClick={() => setOpenWarehouse(true)}>
          Open Warehouse Dialog
        </Button>
        <Button variant="contained" onClick={() => setOpenInventory(true)}>
          Open Inventory Dialog
        </Button>
        <Button variant="contained" onClick={() => setOpenCustomer(true)}>
          Open Customer Dialog
        </Button>
        <AddDriverDialog
          open={openDriver}
          onClose={onClose}
          onSuccess={onSuccess}
        />
        <AddRouteDialog
          open={openRoute}
          onClose={onClose}
          onSuccess={onSuccess}
        />
        <AddShipmentDialog
          open={openShipment}
          onClose={onClose}
          onSuccess={onSuccess}
        />
        <AddVehicleDialog
          open={openVehicle}
          onClose={onClose}
          onSuccess={onSuccess}
        />
        <AddWarehouseDialog
          open={openWarehouse}
          onClose={onClose}
          onSuccess={onSuccess}
        />
        <AddInventoryDialog
          open={openInventory}
          onClose={onClose}
          onSuccess={onSuccess}
        />
        <AddCustomerDialog
          open={openCustomer}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      </Stack>
    </Box>
  );
}
