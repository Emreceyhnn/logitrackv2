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
  Skeleton,
} from "@mui/material";
import CustomCard from "../../../cards/card";
import RowActions from "./menu";
import ShipmentDetailDialog from "../../../dialogs/shipment/shipmentDetailDialog";
import { useState } from "react";
import { ShipmentWithRelations } from "@/app/lib/type/shipment";
import { StatusChip } from "@/app/components/chips/statusChips";
import { PriorityChip } from "@/app/components/chips/priorityChips";
interface ShipmentTableProps {
  shipments: ShipmentWithRelations[];
  loading?: boolean;
  onSelect: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ShipmentTable = ({
  shipments,
  loading,
  onSelect,
  onEdit,
  onDelete,
}: ShipmentTableProps) => {
  /* --------------------------------- states --------------------------------- */
  const [open, setOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] =
    useState<ShipmentWithRelations | null>(null);

  /* -------------------------------- handlers -------------------------------- */
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = (id: string) => {
    // We notify parent on select, but also might want local dialog loop for now
    // The previous implementation had the dialog inside the table.
    // For now we keep the dialog here but it should eventually move to page.
    const shipment = shipments.find((s) => s.id === id);
    if (!shipment) return;

    // TODO: Dialog expects legacy 'Shipment' type. We cast or map it.
    // For now passing as any to unblock the table refactor.
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
              {loading ? (
                Array.from(new Array(5)).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton variant="text" width={80} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rounded" width={90} height={24} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={120} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={80} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={120} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={80} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={80} />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton variant="text" width={30} />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton variant="circular" width={24} height={24} />
                    </TableCell>
                  </TableRow>
                ))
              ) : shipments.length === 0 ? (
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
