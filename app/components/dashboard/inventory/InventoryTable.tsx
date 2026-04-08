"use client";

import { useMemo, useState } from "react";
import {
  Typography,
  Avatar,
  Stack,
  Chip,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";

import DataTable from "@/app/components/ui/DataTable";
import type { DataTableColumn, DataTableRowAction } from "@/app/lib/type/dataTable";
import { InventoryWithRelations } from "@/app/lib/type/inventory";
import { InventoryTableProps } from "@/app/lib/type/inventory";

// Helper to derive status for UI
const getStatus = (quantity: number, minStock: number) => {
  if (quantity === 0) return "OUT_OF_STOCK";
  if (quantity <= minStock) return "LOW_STOCK";
  return "IN_STOCK";
};

const getStockColor = (status: string) => {
  if (status === "IN_STOCK") return "success";
  if (status === "LOW_STOCK") return "warning";
  return "error";
};

const formatPrice = (price: number) => {
  try {
    return new Intl.NumberFormat("en-TR", {
      style: "currency",
      currency: "TRY",
    }).format(price);
  } catch {
    return `₺${price.toFixed(2)}`;
  }
};

const InventoryTable = ({
  items,
  loading = false,
  onSelect,
  onEdit,
  onDelete,
  meta,
  onPageChange,
  onLimitChange,
}: InventoryTableProps) => {

  const [localPage, setLocalPage] = useState(1);
  const [localLimit, setLocalLimit] = useState(10);

  const currentMeta = meta || {
    page: localPage,
    limit: localLimit,
    total: items.length,
  };

  const paginatedItems = meta
    ? items
    : items.slice((currentMeta.page - 1) * currentMeta.limit, currentMeta.page * currentMeta.limit);

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

  const columns: DataTableColumn<InventoryWithRelations>[] = useMemo(() => [
    {
      key: "productName",
      label: "Product Name",
      sortable: true,
      sortKey: "name",
      render: (row) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            variant="rounded"
            src={row.imageUrl || undefined}
            sx={{
              bgcolor: "primary.light",
              color: "primary.main",
              width: 40,
              height: 40,
              fontSize: "1rem",
              fontWeight: 600,
              "& img": { objectFit: "cover" },
            }}
          >
            {!row.imageUrl && row.name.charAt(0)}
          </Avatar>
          <Typography variant="body2" fontWeight={600}>
            {row.name}
          </Typography>
        </Stack>
      ),
    },
    {
      key: "sku",
      label: "SKU",
      sortable: true,
      render: (row) => row.sku,
    },
    {
      key: "category",
      label: "Category",
      render: () => <Chip label="General" size="small" variant="outlined" />,
    },
    {
      key: "stockLevel",
      label: "Stock Level",
      sortable: true,
      sortKey: "quantity",
      render: (row) => {
        const status = getStatus(row.quantity, row.minStock);
        return (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: `${getStockColor(status)}.main`,
              }}
            />
            <Typography
              variant="body2"
              sx={{ color: `${getStockColor(status)}.main`, fontWeight: 500 }}
            >
              {row.quantity} {status === "LOW_STOCK" && "(Low)"}{" "}
              {status === "OUT_OF_STOCK" && "(Out)"}
            </Typography>
          </Stack>
        );
      },
    },
    {
      key: "unitPrice",
      label: "Unit Price",
      sortable: true,
      sortKey: "unitValue",
      render: (row) => formatPrice(row.unitValue || 0),
    },
    {
      key: "warehouse",
      label: "Warehouses",
      render: (row) => (
        <Stack direction="row" spacing={0.5}>
          <Chip label={row.warehouse.code} size="small" sx={{ fontSize: "0.7rem", height: 20 }} />
        </Stack>
      ),
    },
  ], []);

  const rowActions: DataTableRowAction<InventoryWithRelations>[] = useMemo(() => [
    {
      label: "Details",
      icon: <InfoIcon fontSize="small" color="info" />,
      onClick: (row) => onSelect(row.id),
    },
    {
      label: "Edit",
      icon: <EditIcon fontSize="small" />,
      onClick: (row) => onEdit(row),
    },
    {
      label: "Delete",
      icon: <DeleteIcon fontSize="small" />,
      onClick: (row) => { if (onDelete) onDelete(row.id); },
      color: "error",
    },
  ], [onSelect, onEdit, onDelete]);

  return (
    <DataTable<InventoryWithRelations>
      rows={paginatedItems}
      columns={columns}
      loading={loading}
      emptyMessage="No inventory items found"
      meta={currentMeta}
      onPageChange={handlePageChange}
      onLimitChange={handleLimitChange}
      rowActions={rowActions}
    />
  );
};

export default InventoryTable;
