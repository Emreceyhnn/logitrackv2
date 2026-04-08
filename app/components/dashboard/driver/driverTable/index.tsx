"use client";

import { useMemo, useState } from "react";
import DataTable from "@/app/components/ui/DataTable";
import type { DataTableColumn, DataTableRowAction, DataTableFilter } from "@/app/lib/type/dataTable";
import { StatusChip } from "@/app/components/chips/statusChips";
import { DriverTableProps, DriverWithRelations } from "@/app/lib/type/driver";
import { DriverStatus } from "@prisma/client";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Typography } from "@mui/material";

const DriverTable = ({
  drivers,
  loading = false,
  meta: apiMeta,
  onDriverSelect,
  onEdit,
  onDelete,
  onPageChange,
  onLimitChange,
  sortField,
  sortOrder,
  onRequestSort,
  filters,
  onFilterChange,
}: DriverTableProps) => {

  const [localPage, setLocalPage] = useState(1);
  const [localLimit, setLocalLimit] = useState(10);

  const meta = useMemo(() => apiMeta || {
    page: localPage,
    limit: localLimit,
    total: drivers.length,
  }, [apiMeta, localPage, localLimit, drivers.length]);

  const paginatedDrivers = apiMeta
    ? drivers
    : drivers.slice((meta.page - 1) * meta.limit, meta.page * meta.limit);

  const handlePageChange = (newPage: number) => {
    if (onPageChange) onPageChange(newPage);
    else setLocalPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    if (onLimitChange) onLimitChange(newLimit);
    else {
      setLocalLimit(newLimit);
      setLocalPage(1);
    }
  };

  const columns: DataTableColumn<DriverWithRelations>[] = useMemo(() => [
    {
      key: "id",
      label: "#",
      width: 50,
      render: (row) => {
        const idx = drivers.findIndex((d) => d.id === row.id);
        const base = meta ? (meta.page - 1) * meta.limit : 0;
        return base + idx + 1;
      },
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 13 }}>
          {row.user.name} {row.user.surname}
        </Typography>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => <StatusChip status={row.status} />,
    },
    {
      key: "phone",
      label: "Phone",
      sortable: true,
      render: (row) => row.phone,
    },
    {
      key: "vehicle",
      label: "Vehicle",
      sortable: true,
      render: (row) => row.currentVehicle ? row.currentVehicle.plate : "No assigned vehicle",
    },
    {
      key: "homeBaseWarehouse",
      label: "Homebase",
      sortable: true,
      render: (row) => row.homeBaseWarehouse ? row.homeBaseWarehouse.name : "Not assigned",
    },
    {
      key: "licenseType",
      label: "License",
      sortable: true,
      render: (row) => row.licenseType,
    },
    {
      key: "safetyScore",
      label: "Safety Score",
      align: "right",
      sortable: true,
      render: (row) => row.safetyScore,
    },
  ], [drivers, meta]);

  const rowActions: DataTableRowAction<DriverWithRelations>[] = useMemo(() => [
    {
      label: "Details",
      icon: <ContentPasteIcon fontSize="small" />,
      onClick: (row) => onDriverSelect(row.id),
    },
    {
      label: "Edit",
      icon: <EditIcon fontSize="small" />,
      onClick: (row) => onEdit(row),
    },
    {
      label: "Delete",
      icon: <DeleteIcon fontSize="small" />,
      onClick: (row) => onDelete(row.id),
      color: "error",
    },
  ], [onDriverSelect, onEdit, onDelete]);

  const activeFilters: Record<string, string[]> = {};
  if (filters?.status && filters.status.length > 0) activeFilters["status"] = filters.status;
  if (filters?.hasVehicle === true) activeFilters["hasVehicle"] = ["assigned"];
  else if (filters?.hasVehicle === false) activeFilters["hasVehicle"] = ["unassigned"];

  const handleFilterChange = (key: string, values: string[]) => {
    if (!onFilterChange) return;
    if (key === "status") onFilterChange({ status: values as DriverStatus[] });
    if (key === "hasVehicle") {
      if (values[0] === "assigned") onFilterChange({ hasVehicle: true });
      else if (values[0] === "unassigned") onFilterChange({ hasVehicle: false });
      else onFilterChange({ hasVehicle: undefined });
    }
  };

  const DRIVER_FILTERS: DataTableFilter[] = [
    {
      key: "status",
      label: "Status",
      options: Object.values(DriverStatus).map((s) => ({
        label: s.replace(/_/g, " "),
        value: s,
      })),
      multiple: true,
    },
    {
      key: "hasVehicle",
      label: "Vehicle",
      options: [
        { label: "Assigned", value: "assigned" },
        { label: "Unassigned", value: "unassigned" }
      ],
      multiple: false,
    }
  ];

  return (
    <DataTable<DriverWithRelations>
      rows={paginatedDrivers}
      columns={columns}
      loading={loading}
      emptyMessage="No drivers found"
      meta={meta}
      onPageChange={handlePageChange}
      onLimitChange={handleLimitChange}
      rowActions={rowActions}
      sortField={sortField}
      sortOrder={sortOrder}
      onRequestSort={onRequestSort}
      wrapCard={true}
      tableTitle="Driver List"
      searchValue={filters?.search || ""}
      searchPlaceholder="Search drivers..."
      onSearchChange={(search) => onFilterChange && onFilterChange({ search })}
      filters={DRIVER_FILTERS}
      activeFilters={activeFilters}
      onFilterChange={handleFilterChange}
    />
  );
};

export default DriverTable;
