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
import BuildIcon from "@mui/icons-material/Build";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useState } from "react";
import { updateVehicleStatus } from "@/app/lib/controllers/vehicle";
import { toast } from "sonner";

import { useDictionary } from "@/app/lib/language/DictionaryContext";

const VehicleTable = ({ state, actions }: VehicleTableProps) => {
  const dict = useDictionary();
  const { vehicles, loading = false, filters, meta: apiMeta } = state;
  const {
    selectVehicle,
    onEdit,
    onDelete,
    updateFilters,
    onUpdateSuccess,
    setPage,
    setLimit,
  } = actions;

  const [localPage, setLocalPage] = useState(1);
  const [localLimit, setLocalLimit] = useState(10);

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleStatusUpdate = useCallback(
    async (vehicleId: string, newStatus: VehicleStatus) => {
      try {
        setActionLoading(vehicleId);
        await updateVehicleStatus(vehicleId, newStatus);
        const statusLabel = dict.vehicles.statuses[newStatus as keyof typeof dict.vehicles.statuses] || newStatus.replace(/_/g, " ");
        toast.success(
          `${dict.toasts.successUpdate || "Updated"} - ${statusLabel}`
        );
        onUpdateSuccess?.();
      } catch (error) {
        toast.error(dict.toasts.errorGeneric || "Failed to update vehicle status");
        console.error(error);
      } finally {
        setActionLoading(null);
      }
    },
    [onUpdateSuccess, dict]
  );

  /* ---------------------------------- data ---------------------------------- */
  const STATUS_OPTIONS = useMemo(() => Object.values(VehicleStatus).map((s) => ({
    label: dict.vehicles.statuses[s as keyof typeof dict.vehicles.statuses] || s.replace(/_/g, " "),
    value: s,
  })), [dict]);

  const TYPE_OPTIONS = useMemo(() => Object.values(VehicleType).map((t) => ({
    label: dict.vehicles.types[t as keyof typeof dict.vehicles.types] || t.replace(/_/g, " "),
    value: t,
  })), [dict]);

  const VEHICLE_FILTERS = useMemo(() => [
    {
      key: "status",
      label: dict.vehicles.fields.status,
      options: STATUS_OPTIONS,
      multiple: true,
    },
    {
      key: "type",
      label: dict.vehicles.fields.type,
      options: TYPE_OPTIONS,
      multiple: true,
    },
  ], [dict, STATUS_OPTIONS, TYPE_OPTIONS]);

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
        label: dict.vehicles.fields.plate,
        render: (row) => (
          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 13 }}>
            {row.plate}
          </Typography>
        ),
      },
      {
        key: "brandModel",
        label: dict.vehicles.fields.brandModel,
        render: (row) => `${row.brand} – ${row.model} / ${row.year}`,
      },
      {
        key: "status",
        label: dict.vehicles.fields.status,
        render: (row) => <StatusChip status={row.status} />,
      },
      {
        key: "odometer",
        label: dict.vehicles.fields.odometer,
        render: (row) =>
          row.odometerKm ? `${row.odometerKm.toLocaleString()} ${dict.common.km}` : dict.common.na,
      },
      {
        key: "driver",
        label: dict.vehicles.fields.driver,
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
              {dict.vehicles.statuses.notAssigned || "Not Assigned"}
            </Typography>
          ),
      },
      {
        key: "type",
        label: dict.vehicles.fields.type,
        render: (row) => dict.vehicles.types[row.type as keyof typeof dict.vehicles.types] || row.type.replace(/_/g, " "),
      },
      {
        key: "fuelLevel",
        label: dict.vehicles.fields.fuelLevel,
        align: "right",
        render: (row) => `${row.fuelLevel ?? 0}%`,
      },
    ],
    [vehicles, dict]
  );

  /* --------------------------------- row actions --------------------------------- */
  const rowActions: DataTableRowAction<VehicleWithRelations>[] = useMemo(
    () => [
      {
        label: dict.vehicles.dialogs.details,
        icon: <ContentPasteIcon fontSize="small" />,
        onClick: (row) => selectVehicle(row.id),
      },
      {
        label: dict.common.edit,
        icon: <EditIcon fontSize="small" />,
        onClick: (row) => onEdit(row.id),
      },
      {
        label: dict.vehicles.dialogs.setMaintenance,
        icon: <BuildIcon fontSize="small" />,
        onClick: (row) => handleStatusUpdate(row.id, "MAINTENANCE"),
        hidden: (row) =>
          row.status === "MAINTENANCE" || row.status === "ON_TRIP",
      },
      {
        label: dict.vehicles.dialogs.returnToService,
        icon: <CheckCircleOutlineIcon fontSize="small" />,
        onClick: (row) => handleStatusUpdate(row.id, "AVAILABLE"),
        hidden: (row) => row.status !== "MAINTENANCE",
      },
      {
        label: dict.common.delete,
        icon: <DeleteIcon fontSize="small" />,
        onClick: (row) => onDelete(row.id),
        color: "error",
      },
    ],
    [selectVehicle, onEdit, onDelete, handleStatusUpdate, dict]
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
        emptyMessage={dict.vehicles.table.emptyMessage}
        searchValue={filters.search ?? ""}
        searchPlaceholder={dict.vehicles.table.searchPlaceholder}
        onSearchChange={handleSearchChange}
        filters={VEHICLE_FILTERS}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        rowActions={rowActions}
        meta={meta}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        wrapCard={true}
        tableTitle={dict.vehicles.table.title}
      />
    </>
  );
};

export default VehicleTable;
