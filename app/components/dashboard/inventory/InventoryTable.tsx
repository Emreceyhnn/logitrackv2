"use client";

import { useMemo, useState, useCallback } from "react";
import { Typography, Avatar, Stack, Chip, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

import DataTable from "@/app/components/ui/DataTable";
import type {
  DataTableColumn,
  DataTableRowAction,
} from "@/app/lib/type/dataTable";
import { InventoryWithRelations } from "@/app/lib/type/inventory";
import { InventoryTableProps } from "@/app/lib/type/inventory";

import { useParams } from "next/navigation";

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

const InventoryTable = ({
  items,
  loading = false,
  onSelect,
  onEdit,
  onDelete,
  meta,
  onPageChange,
  onLimitChange,
  sortField,
  sortOrder,
  onRequestSort,
}: InventoryTableProps) => {
  const dict = useDictionary();
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const [localPage, setLocalPage] = useState(1);
  const [localLimit, setLocalLimit] = useState(10);

  const formatPrice = useCallback(
    (price: number) => {
      try {
        return new Intl.NumberFormat(lang === "tr" ? "tr-TR" : "en-US", {
          style: "currency",
          currency: lang === "tr" ? "TRY" : "USD",
          maximumFractionDigits: 0,
        }).format(price);
      } catch {
        return lang === "tr" ? `₺${price.toFixed(0)}` : `$${price.toFixed(0)}`;
      }
    },
    [lang]
  );

  const currentMeta = meta || {
    page: localPage,
    limit: localLimit,
    total: items.length,
  };

  const paginatedItems = meta
    ? items
    : items.slice(
        (currentMeta.page - 1) * currentMeta.limit,
        currentMeta.page * currentMeta.limit
      );

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

  const columns: DataTableColumn<InventoryWithRelations>[] = useMemo(
    () => [
      {
        key: "productName",
        label: dict.inventory.table.productName,
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
        label: dict.inventory.table.sku,
        sortable: true,
        render: (row) => row.sku,
      },
      {
        key: "category",
        label: dict.inventory.table.category,
        render: () => (
          <Chip
            label={dict.inventory.category.general}
            size="small"
            variant="outlined"
          />
        ),
      },
      {
        key: "stockLevel",
        label: dict.inventory.table.stockLevel,
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
                {row.quantity}{" "}
                {status === "LOW_STOCK" && `(${dict.inventory.status.low})`}{" "}
                {status === "OUT_OF_STOCK" && `(${dict.inventory.status.out})`}
              </Typography>
            </Stack>
          );
        },
      },
      {
        key: "unitPrice",
        label: dict.inventory.table.unitPrice,
        sortable: true,
        sortKey: "unitValue",
        render: (row) => formatPrice(row.unitValue || 0),
      },
      {
        key: "warehouse",
        label: dict.inventory.table.warehouses,
        render: (row) => (
          <Stack direction="row" spacing={0.5}>
            <Chip
              label={row.warehouse.code}
              size="small"
              sx={{ fontSize: "0.7rem", height: 20 }}
            />
          </Stack>
        ),
      },
    ],
    [dict, formatPrice]
  );

  const rowActions: DataTableRowAction<InventoryWithRelations>[] = useMemo(
    () => [
      {
        label: dict.inventory.actions.details,
        icon: <InfoIcon fontSize="small" color="info" />,
        onClick: (row) => onSelect(row.id),
      },
      {
        label: dict.inventory.actions.edit,
        icon: <EditIcon fontSize="small" />,
        onClick: (row) => {
          if (onEdit) onEdit(row);
        },
      },

      {
        label: dict.inventory.actions.delete,
        icon: <DeleteIcon fontSize="small" />,
        onClick: (row) => {
          if (onDelete) onDelete(row.id);
        },
        color: "error",
      },
    ],
    [onSelect, onDelete, dict]
  );

  return (
    <DataTable<InventoryWithRelations>
      rows={paginatedItems}
      columns={columns}
      loading={loading}
      emptyMessage={dict.inventory.noItems}
      meta={currentMeta}
      onPageChange={handlePageChange}
      onLimitChange={handleLimitChange}
      rowActions={rowActions}
      sortField={sortField}
      sortOrder={sortOrder}
      onRequestSort={onRequestSort}
    />
  );
};

export default InventoryTable;
