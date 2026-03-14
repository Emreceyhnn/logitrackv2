"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import CustomCard from "../../../cards/card";
import RowActions from "./menu";
import ShipmentDetailDialog from "../../../dialogs/shipment/shipmentDetailDialog";
import { useState } from "react";
import {
  ShipmentTableProps,
  ShipmentWithRelations,
} from "@/app/lib/type/shipment";
import { StatusChip } from "@/app/components/chips/statusChips";
import TableSkeleton from "@/app/components/skeletons/TableSkeleton";

const ShipmentTable = ({ state, actions }: ShipmentTableProps) => {
  const { shipments, loading = false } = state;
  const { selectShipment: onSelect, onEdit, onDelete } = actions;

  /* --------------------------------- states --------------------------------- */
  const [open, setOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] =
    useState<ShipmentWithRelations | null>(null);

  if (loading) {
    return <TableSkeleton title="Shipment List" rows={5} columns={9} />;
  }

  /* -------------------------------- handlers -------------------------------- */
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = (id: string) => {
    const shipment = shipments.find((s) => s.id === id);
    if (!shipment) return;

    setSelectedShipment(shipment);
    setOpen(true);
    onSelect(id);
  };

  return (
    <>
      <CustomCard sx={{ padding: "0 0 6px 0" }}>
        <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
          Shipment List
        </Typography>
        <Divider />

        <TableContainer component={Paper} elevation={0} sx={{ p: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Destination</TableCell>
                <TableCell>Driver</TableCell>
                <TableCell>Route</TableCell>
                <TableCell align="right">Items</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {shipments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      No shipments found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                shipments.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.trackingId}</TableCell>
                    <TableCell>
                      <StatusChip status={s.status} />
                    </TableCell>
                    <TableCell>{s.customer.name}</TableCell>
                    <TableCell>
                      {new Date(s.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{s.destination}</TableCell>
                    <TableCell>
                      {s.driver?.user.name
                        ? `${s.driver.user.name} ${s.driver.user.surname}`
                        : "-"}
                    </TableCell>
                    <TableCell>{s.route?.name || s.routeId || "-"}</TableCell>
                    <TableCell align="right">{s.itemsCount}</TableCell>
                    <TableCell align="right">
                      <RowActions
                        id={s.id}
                        handleOpenDetails={handleOpen}
                        handleEdit={onEdit}
                        handleDelete={onDelete}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CustomCard>

      <ShipmentDetailDialog
        open={open}
        onClose={handleClose}
        shipment={selectedShipment}
      />
    </>
  );
};

export default ShipmentTable;
