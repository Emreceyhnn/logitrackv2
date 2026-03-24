"use client";

import { useState, useCallback } from "react";
import { Typography } from "@mui/material";
import DataTable from "@/app/components/ui/DataTable";
import type { DataTableColumn, DataTableFilter, DataTableRowAction } from "@/app/lib/type/dataTable";
import { StatusChip } from "@/app/components/chips/statusChips";
import ShipmentDetailDialog from "@/app/components/dialogs/shipment/shipmentDetailDialog";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type {
  ShipmentTableProps,
  ShipmentWithRelations,
} from "@/app/lib/type/shipment";

// Shipment status is a string field (no Prisma enum). Based on StatusChip categories.
const SHIPMENT_STATUS_VALUES = [
  "PENDING",
  "PICKED_UP",
  "IN_TRANSIT",
  "DELIVERED",
  "COMPLETED",
  "FAILED",
  "CANCELLED",
] as const;

const SHIPMENT_FILTERS: DataTableFilter[] = [
  {
    key: "status",
    label: "Status",
    options: SHIPMENT_STATUS_VALUES.map((s) => ({
      label: s.replace(/_/g, " "),
      value: s,
    })),
    multiple: false,
  },
];

const ShipmentTable = ({ state, actions }: ShipmentTableProps) => {
  const { shipments, loading = false, filters } = state;
  const { selectShipment, onEdit, onDelete, updateFilters } = actions;

  /* --------------------------------- dialog state --------------------------------- */
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] =
    useState<ShipmentWithRelations | null>(null);

  /* --------------------------------- handlers --------------------------------- */
  const handleOpenDetails = useCallback(
    (row: ShipmentWithRelations) => {
      setSelectedShipment(row);
      setDetailOpen(true);
      selectShipment(row.id);
    },
    [selectShipment]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      updateFilters({ search: value });
    },
    [updateFilters]
  );

  const handleFilterChange = useCallback(
    (key: string, values: string[]) => {
      if (key === "status") {
        updateFilters({ status: values[0] as string | undefined });
      }
    },
    [updateFilters]
  );

  /* --------------------------------- columns --------------------------------- */
  const columns: DataTableColumn<ShipmentWithRelations>[] = [
    {
      key: "trackingId",
      label: "Code",
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 13 }}>
          {row.trackingId}
        </Typography>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusChip status={row.status} />,
    },
    {
      key: "customer",
      label: "Customer",
      render: (row) => row.customer?.name ?? "-",
    },
    {
      key: "createdAt",
      label: "Created",
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: "destination",
      label: "Destination",
      render: (row) => row.destination,
    },
    {
      key: "driver",
      label: "Driver",
      render: (row) =>
        row.driver?.user.name
          ? `${row.driver.user.name} ${row.driver.user.surname}`
          : "-",
    },
    {
      key: "route",
      label: "Route",
      render: (row) => row.route?.name ?? row.routeId ?? "-",
    },
    {
      key: "items",
      label: "Items",
      align: "right",
      render: (row) => row.itemsCount,
    },
  ];

  /* --------------------------------- row actions --------------------------------- */
  const rowActions: DataTableRowAction<ShipmentWithRelations>[] = [
    {
      label: "Details",
      icon: <ContentPasteIcon fontSize="small" />,
      onClick: handleOpenDetails,
    },
    {
      label: "Edit",
      icon: <EditIcon fontSize="small" />,
      onClick: (row) => onEdit(row.id),
    },
    {
      label: "Delete",
      icon: <DeleteIcon fontSize="small" />,
      onClick: (row) => onDelete(row.id),
      color: "error",
    },
  ];

  const activeFilters: Record<string, string[]> = {};
  if (filters.status) activeFilters["status"] = [filters.status];

  return (
    <>
      <DataTable<ShipmentWithRelations>
        rows={shipments}
        columns={columns}
        loading={loading}
        emptyMessage="No shipments found"
        searchValue={filters.search ?? ""}
        searchPlaceholder="Search shipments..."
        onSearchChange={handleSearchChange}
        filters={SHIPMENT_FILTERS}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        rowActions={rowActions}
      />

      <ShipmentDetailDialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        shipment={selectedShipment}
      />
    </>
  );
};

export default ShipmentTable;
