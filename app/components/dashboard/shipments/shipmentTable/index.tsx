"use client";

import { useState, useCallback, useMemo } from "react";
import { Typography } from "@mui/material";
import DataTable from "@/app/components/ui/DataTable";
import type { DataTableColumn, DataTableFilter, DataTableRowAction } from "@/app/lib/type/dataTable";
import { StatusChip } from "@/app/components/chips/statusChips";
import ShipmentDetailDialog from "@/app/components/dialogs/shipment/shipmentDetailDialog";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  ShipmentTableProps,
  ShipmentWithRelations,
} from "@/app/lib/type/shipment";
import { ShipmentStatus } from "@prisma/client";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

const ShipmentTable = ({ state, actions }: ShipmentTableProps) => {
  const dict = useDictionary();
  const { shipments, loading = false, filters } = state;
  const { selectShipment, onEdit, onDelete, updateFilters } = actions;

  // Localized statuses for the filter
  const SHIPMENT_STATUS_VALUES = Object.values(ShipmentStatus) as ShipmentStatus[];
  const SHIPMENT_FILTERS: DataTableFilter[] = useMemo(() => [
    {
      key: "status",
      label: dict.shipments.table.columns.status,
      options: SHIPMENT_STATUS_VALUES.map((s: ShipmentStatus) => {
        const statusKey = s.toUpperCase();
        return {
          label: dict.routes.statuses[statusKey as keyof typeof dict.routes.statuses] || s.replace(/_/g, " "),
          value: s as string,
        };
      }),
      multiple: false,
    },
  ], [dict]);

  /* --------------------------------- dialog state --------------------------------- */
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] =
    useState<ShipmentWithRelations | null>(null);

  /* --------------------------------- pagination fallback --------------------------------- */
  const [localPage, setLocalPage] = useState(1);
  const [localLimit, setLocalLimit] = useState(10);

  const meta = useMemo(() => ({
    page: localPage,
    limit: localLimit,
    total: shipments.length,
  }), [localPage, localLimit, shipments.length]);

  const paginatedShipments = useMemo(() => {
    return shipments.slice((meta.page - 1) * meta.limit, meta.page * meta.limit);
  }, [shipments, meta.page, meta.limit]);

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
        updateFilters({ status: values[0] as ShipmentStatus | undefined });
      }
    },
    [updateFilters]
  );

  /* --------------------------------- columns --------------------------------- */
  const columns: DataTableColumn<ShipmentWithRelations>[] = [
    {
      key: "trackingId",
      label: dict.shipments.table.columns.code,
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 13 }}>
          {row.trackingId}
        </Typography>
      ),
    },
    {
      key: "status",
      label: dict.shipments.table.columns.status,
      render: (row) => <StatusChip status={row.status} />,
    },
    {
      key: "customer",
      label: dict.shipments.table.columns.customer,
      render: (row) => row.customer?.name ?? "-",
    },
    {
      key: "createdAt",
      label: dict.shipments.table.columns.created,
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: "destination",
      label: dict.shipments.table.columns.destination,
      render: (row) => row.destination,
    },
    {
      key: "driver",
      label: dict.shipments.table.columns.driver,
      render: (row) =>
        row.driver?.user.name
          ? `${row.driver.user.name} ${row.driver.user.surname}`
          : "-",
    },
    {
      key: "route",
      label: dict.shipments.table.columns.route,
      render: (row) => row.route?.name ?? row.routeId ?? "-",
    },
    {
      key: "items",
      label: dict.shipments.table.columns.items,
      align: "right",
      render: (row) => row.itemsCount,
    },
  ];

  /* --------------------------------- row actions --------------------------------- */
  const rowActions: DataTableRowAction<ShipmentWithRelations>[] = [
    {
      label: dict.common.details,
      icon: <ContentPasteIcon fontSize="small" />,
      onClick: handleOpenDetails,
    },
    {
      label: dict.common.edit,
      icon: <EditIcon fontSize="small" />,
      onClick: (row) => onEdit(row.id),
    },
    {
      label: dict.common.delete,
      icon: <DeleteIcon fontSize="small" />,
      onClick: (row) => onDelete(row.id),
      color: "error",
    },
  ];

  const activeFilters: Record<string, string[]> = {};
  if (filters.status) activeFilters["status"] = [filters.status as string];

  return (
    <>
      <DataTable<ShipmentWithRelations>
        rows={paginatedShipments}
        columns={columns}
        loading={loading}
        emptyMessage={dict.shipments.table.noShipments}
        searchValue={filters.search ?? ""}
        searchPlaceholder={dict.shipments.table.searchPlaceholder}
        onSearchChange={handleSearchChange}
        filters={SHIPMENT_FILTERS}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        rowActions={rowActions}
        meta={meta}
        onPageChange={setLocalPage}
        onLimitChange={(lim) => { setLocalLimit(lim); setLocalPage(1); }}
        wrapCard={true}
        tableTitle={dict.shipments.table.title}
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
