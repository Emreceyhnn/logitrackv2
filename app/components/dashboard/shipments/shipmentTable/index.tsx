"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
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
  const theme = useTheme();

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
    <TableContainer sx={{ p: 0 }}>
      <Table size="small">
        <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
          <TableRow>
            <TableCell sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}>
              Code
            </TableCell>
            <TableCell sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}>
              Status
            </TableCell>
            <TableCell sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}>
              Customer
            </TableCell>
            <TableCell sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}>
              Created
            </TableCell>
            <TableCell sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}>
              Destination
            </TableCell>
            <TableCell sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}>
              Driver
            </TableCell>
            <TableCell sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}>
              Route
            </TableCell>
            <TableCell
              align="right"
              sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}
            >
              Items
            </TableCell>
            <TableCell
              align="right"
              sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody sx={{ "& tr:last-child td": { border: 0 } }}>
          {shipments.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                align="center"
                sx={{ py: 3, borderColor: alpha(theme.palette.divider, 0.1) }}
              >
                <Typography variant="body2" color="text.secondary">
                  No shipments found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            shipments.map((s) => (
              <TableRow
                key={s.id}
                hover
                sx={{
                  "& td": { borderColor: alpha(theme.palette.divider, 0.1) },
                }}
              >
                <TableCell>{s.trackingId}</TableCell>
                <TableCell>
                  <StatusChip status={s.status} />
                </TableCell>
                <TableCell>{s.customer?.name || "-"}</TableCell>
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

      <ShipmentDetailDialog
        open={open}
        onClose={handleClose}
        shipment={selectedShipment}
      />
    </>
  );
};

export default ShipmentTable;
