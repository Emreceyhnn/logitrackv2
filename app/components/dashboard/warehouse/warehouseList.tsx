"use client";

import { useMemo, useState } from "react";
import { Typography, Stack, LinearProgress, alpha, useTheme } from "@mui/material";
import DataTable from "@/app/components/ui/DataTable";
import type { DataTableColumn, DataTableRowAction } from "@/app/lib/type/dataTable";
import { WarehouseTableProps, WarehouseWithRelations } from "@/app/lib/type/warehouse";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const WarehouseListTable = ({
  warehouses,
  loading,
  onSelect,
  onEdit,
  onDelete,
  onDetails,
  meta,
  onPageChange,
  onLimitChange,
}: WarehouseTableProps) => {
  const theme = useTheme();

  // Local pagination if API meta isn't provided
  const [localPage, setLocalPage] = useState(1);
  const [localLimit, setLocalLimit] = useState(10);

  const currentMeta = meta || {
    page: localPage,
    limit: localLimit,
    total: warehouses.length,
  };

  const paginatedWarehouses = meta
    ? warehouses
    : warehouses.slice((currentMeta.page - 1) * currentMeta.limit, currentMeta.page * currentMeta.limit);

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

  const columns: DataTableColumn<WarehouseWithRelations>[] = useMemo(() => [
    {
      key: "code",
      label: "Code",
      sortable: true,
      render: (row) => (
        <Typography variant="body2" fontWeight={800} color="primary.main">
          {row.code}
        </Typography>
      ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (row) => (
        <>
          <Typography variant="body2" fontWeight={700}>
            {row.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.7 }}>
            {row.address?.split(",")[0]}
          </Typography>
        </>
      ),
    },
    {
      key: "type",
      label: "Type / City",
      sortable: true,
      render: (row) => (
        <Stack spacing={0.5}>
          <Typography
            variant="caption"
            sx={{
              px: 1,
              py: 0.2,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              fontWeight: 800,
              fontSize: "0.6rem",
              textTransform: "uppercase",
              width: "fit-content",
            }}
          >
            {row.type.replace("_", " ")}
          </Typography>
          <Typography variant="body2" fontWeight={600} color="text.secondary">
            {row.city}
          </Typography>
        </Stack>
      ),
    },
    {
      key: "capacityPallet",
      label: "Capacity (Pallets)",
      width: "20%",
      render: (row) => {
        const usedPallets = (row._count?.inventory || 0) * 10;
        const totalPallets = row.capacityPallets || 5000;
        const palletPct = Math.min((usedPallets / totalPallets) * 100, 100);
        return (
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" fontWeight={700} color="text.secondary">
                {palletPct.toFixed(0)}% Utilized
              </Typography>
              <Typography variant="caption" sx={{ fontFamily: "monospace", opacity: 0.6 }}>
                {usedPallets.toLocaleString()} / {totalPallets.toLocaleString()}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={palletPct}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: alpha(theme.palette.divider, 0.05),
                "& .MuiLinearProgress-bar": {
                  bgcolor: palletPct > 85 ? "error.main" : "primary.main",
                  borderRadius: 3,
                  boxShadow: `0 0 8px ${alpha(palletPct > 85 ? theme.palette.error.main : theme.palette.primary.main, 0.4)}`,
                },
              }}
            />
          </Stack>
        );
      },
    },
    {
      key: "capacityVolume",
      label: "Capacity (Volume)",
      width: "20%",
      render: (row) => {
        const usedVolume = (row._count?.inventory || 0) * 5;
        const totalVolume = row.capacityVolumeM3 || 100000;
        const volumePct = Math.min((usedVolume / totalVolume) * 100, 100);
        return (
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" fontWeight={700} color="text.secondary">
                {volumePct.toFixed(0)}% Space
              </Typography>
              <Typography variant="caption" sx={{ fontFamily: "monospace", opacity: 0.6 }}>
                {usedVolume.toLocaleString()} / {totalVolume.toLocaleString()} m³
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={volumePct}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: alpha(theme.palette.divider, 0.05),
                "& .MuiLinearProgress-bar": {
                  bgcolor: "success.main",
                  borderRadius: 3,
                  boxShadow: `0 0 8px ${alpha(theme.palette.success.main, 0.4)}`,
                },
              }}
            />
          </Stack>
        );
      },
    },
    {
      key: "operatingHours",
      label: "Operating Hours",
      align: "right",
      render: (row) => {
        const oh = row.operatingHours || "24/7";
        const txt = typeof oh === "object" && oh !== null && "monFri" in oh ? (oh as { monFri: string }).monFri : String(oh);
        return (
          <Typography variant="body2" fontWeight={600} sx={{ fontFamily: "monospace" }}>
            {txt}
          </Typography>
        );
      },
    },
  ], [theme]);

  const rowActions: DataTableRowAction<WarehouseWithRelations>[] = useMemo(() => [
    {
      label: "View Details",
      icon: <VisibilityIcon fontSize="small" />,
      onClick: (row) => { if (onDetails) onDetails(row.id); else onSelect(row.id); },
    },
    {
      label: "Edit Warehouse",
      icon: <EditIcon fontSize="small" />,
      onClick: (row) => { if (onEdit) onEdit(row.id); },
    },
    {
      label: "Delete Factory",
      icon: <DeleteIcon fontSize="small" />,
      onClick: (row) => { if (onDelete) onDelete(row.id); },
      color: "error",
    },
  ], [onDetails, onSelect, onEdit, onDelete]);

  return (
    <DataTable<WarehouseWithRelations>
      rows={paginatedWarehouses}
      columns={columns}
      loading={loading}
      emptyMessage="No warehouses found"
      meta={currentMeta}
      onPageChange={handlePageChange}
      onLimitChange={handleLimitChange}
      rowActions={rowActions}
      wrapCard={true}
      tableTitle="Warehouse List"
    />
  );
};

export default WarehouseListTable;
