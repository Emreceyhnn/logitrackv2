"use client";

import { useCallback, useMemo } from "react";
import { Typography } from "@mui/material";
import { VehicleStatus, VehicleType } from "@prisma/client";
import DataTable from "@/app/components/ui/DataTable";
import type {
  DataTableColumn,
  DataTableRowAction,
} from "@/app/lib/type/dataTable";
import { StatusChip } from "@/app/components/chips/statusChips";
import DriverAvatar from "@/app/components/avatar";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type {
  VehicleTableProps,
  VehicleWithRelations,
} from "@/app/lib/type/vehicle";

const STATUS_OPTIONS = Object.values(VehicleStatus).map((s) => ({
  label: s.replace(/_/g, " "),
  value: s,
}));

const TYPE_OPTIONS = Object.values(VehicleType).map((t) => ({
  label: t.replace(/_/g, " "),
  value: t,
}));

const VEHICLE_FILTERS = [
  {
    key: "status",
    label: "Status",
    options: STATUS_OPTIONS,
    multiple: true,
  },
  {
    key: "type",
    label: "Type",
    options: TYPE_OPTIONS,
    multiple: true,
  },
];

const VehicleTable = ({ state, actions }: VehicleTableProps) => {
  const { vehicles, loading = false, filters } = state;
  const { selectVehicle, onEdit, onDelete, updateFilters } = actions;

  /* --------------------------------- handlers --------------------------------- */
  const handleSearchChange = useCallback(
    (value: string) => {
      updateFilters({ search: value });
    },
    [updateFilters]
  );

  const handleFilterChange = useCallback(
    (key: string, values: string[]) => {
      if (key === "status") {
        updateFilters({ status: values as VehicleStatus[] });
      } else if (key === "type") {
        updateFilters({ type: values as VehicleType[] });
      }
    },
    [updateFilters]
  );

  /* --------------------------------- columns --------------------------------- */
  const columns: DataTableColumn<VehicleWithRelations>[] = useMemo(
    () => [
      {
        key: "index",
        label: "#",
        width: 50,
        render: (_row) => {
          const idx = vehicles.indexOf(_row);
          return idx + 1;
        },
      },
      {
        key: "plate",
        label: "Plate",
        render: (row) => (
          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 13 }}>
            {row.plate}
          </Typography>
        ),
      },
      {
        key: "brandModel",
        label: "Brand / Model",
        render: (row) => `${row.brand} – ${row.model} / ${row.year}`,
      },
      {
        key: "status",
        label: "Status",
        render: (row) => <StatusChip status={row.status} />,
      },
      {
        key: "odometer",
        label: "Odometer",
        render: (row) =>
          row.odometerKm ? `${row.odometerKm.toLocaleString()} km` : "N/A",
      },
      {
        key: "driver",
        label: "Driver",
        render: (row) =>
          row.driver?.user ? (
            <DriverAvatar
              avatarUrl={row.driver.user.avatarUrl ?? ""}
              name={row.driver.user.name}
              surname={row.driver.user.surname}
              rating={row.driver.rating ?? 0}
              size="small"
            />
          ) : (
            <Typography variant="caption" color="text.secondary">
              Not Assigned
            </Typography>
          ),
      },
      {
        key: "type",
        label: "Type",
        render: (row) => row.type.replace(/_/g, " "),
      },
      {
        key: "fuelLevel",
        label: "Fuel Level",
        align: "right",
        render: (row) => `${row.fuelLevel ?? 0}%`,
      },
    ],
    [vehicles]
  );

  /* --------------------------------- row actions --------------------------------- */
  const rowActions: DataTableRowAction<VehicleWithRelations>[] = useMemo(
    () => [
      {
        label: "Details",
        icon: <ContentPasteIcon fontSize="small" />,
        onClick: (row) => selectVehicle(row.id),
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
    ],
    [selectVehicle, onEdit, onDelete]
  );

  /* --------------------------------- active filters --------------------------------- */
  const activeFilters: Record<string, string[]> = useMemo(
    () => ({
      ...(filters.status && filters.status.length > 0
        ? { status: filters.status as string[] }
        : {}),
      ...(filters.type && filters.type.length > 0
        ? { type: filters.type as string[] }
        : {}),
    }),
    [filters]
  );

  return (
    <DataTable<VehicleWithRelations>
      rows={vehicles}
      columns={columns}
      loading={loading}
      emptyMessage="No vehicles found"
      searchValue={filters.search ?? ""}
      searchPlaceholder="Search vehicles..."
      onSearchChange={handleSearchChange}
      filters={VEHICLE_FILTERS}
      activeFilters={activeFilters}
      onFilterChange={handleFilterChange}
      rowActions={rowActions}
    />
  );
};

export default VehicleTable;
