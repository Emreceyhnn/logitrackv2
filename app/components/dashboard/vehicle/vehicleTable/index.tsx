"use client";

import { useCallback, useMemo } from "react";
import { Typography } from "@mui/material";
import { VehicleStatus, VehicleType } from "@prisma/client";
import DataTable from "@/app/components/ui/DataTable";
import type { DataTableColumn, DataTableRowAction } from "@/app/lib/type/dataTable";
import { StatusChip } from "@/app/components/chips/statusChips";
import DriverAvatar from "@/app/components/avatar";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { VehicleTableProps, VehicleWithRelations } from "@/app/lib/type/vehicle";
import BuildIcon from "@mui/icons-material/Build";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useState } from "react";
import { updateVehicleStatus } from "@/app/lib/controllers/vehicle";
import { toast } from "sonner";

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
  const { vehicles, loading = false, filters, meta: apiMeta } = state;
  const { selectVehicle, onEdit, onDelete, updateFilters, onUpdateSuccess, setPage, setLimit } = actions;

  const [localPage, setLocalPage] = useState(1);
  const [localLimit, setLocalLimit] = useState(10);

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleStatusUpdate = useCallback(async (vehicleId: string, newStatus: VehicleStatus) => {
    try {
      setActionLoading(vehicleId);
      await updateVehicleStatus(vehicleId, newStatus);
      toast.success(`Vehicle status updated to ${newStatus.replace(/_/g, " ")}`);
      onUpdateSuccess?.();
    } catch (error) {
      toast.error("Failed to update vehicle status");
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  }, [onUpdateSuccess]);

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
        label: "Set Maintenance",
        icon: <BuildIcon fontSize="small" />,
        onClick: (row) => handleStatusUpdate(row.id, "MAINTENANCE"),
        hidden: (row) => row.status === "MAINTENANCE" || row.status === "ON_TRIP",
      },
      {
        label: "Return to Service",
        icon: <CheckCircleOutlineIcon fontSize="small" />,
        onClick: (row) => handleStatusUpdate(row.id, "AVAILABLE"),
        hidden: (row) => row.status !== "MAINTENANCE",
      },
      {
        label: "Delete",
        icon: <DeleteIcon fontSize="small" />,
        onClick: (row) => onDelete(row.id),
        color: "error",
      },
    ],
    [selectVehicle, onEdit, onDelete, handleStatusUpdate]
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

  /* --------------------------------- pagination mock / logic --------------------------------- */
  const meta = apiMeta || {
    page: localPage,
    limit: localLimit,
    total: vehicles.length,
  };

  const paginatedVehicles = apiMeta
    ? vehicles
    : vehicles.slice((meta.page - 1) * meta.limit, meta.page * meta.limit);

  const handlePageChange = (newPage: number) => {
    if (setPage) setPage(newPage);
    else setLocalPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    if (setLimit) setLimit(newLimit);
    else {
      setLocalLimit(newLimit);
      setLocalPage(1);
    }
  };

  return (
    <>
      <DataTable<VehicleWithRelations>
        rows={paginatedVehicles}
        columns={columns}
        loading={loading || !!actionLoading}
        emptyMessage="No vehicles found"
        searchValue={filters.search ?? ""}
        searchPlaceholder="Search vehicles..."
        onSearchChange={handleSearchChange}
        filters={VEHICLE_FILTERS}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        rowActions={rowActions}
        meta={meta}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        wrapCard={true}
        tableTitle="Vehicle List"
      />
    </>
  );
};

export default VehicleTable;
