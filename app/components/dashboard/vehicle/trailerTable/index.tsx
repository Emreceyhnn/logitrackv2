"use client";

import React from "react";
import DataTable from "@/app/components/ui/DataTable";
import { DataTableColumn, DataTableRowAction } from "@/app/lib/type/dataTable";
import { TrailerWithRelations } from "@/app/lib/type/trailer";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import {
  Box,
  Typography,
  Chip,
  Tooltip,
  Stack,
} from "@mui/material";
import {
  Edit,
  Delete,
  Link,
  LinkOff,
  AcUnit,
  LocalShipping,
} from "@mui/icons-material";
import { TrailerStatus, TrailerType } from "@/app/lib/type/enums";

interface TrailerTableProps {
  trailers: TrailerWithRelations[];
  loading: boolean;
  onEdit: (trailer: TrailerWithRelations) => void;
  onDelete: (trailer: TrailerWithRelations) => void;
  onAssign: (trailer: TrailerWithRelations) => void;
  onDetach: (trailer: TrailerWithRelations) => void;
}

export default function TrailerTable({
  trailers,
  loading,
  onEdit,
  onDelete,
  onAssign,
  onDetach,
}: TrailerTableProps) {
  const dict = useDictionary();

  const columns: DataTableColumn<TrailerWithRelations>[] = [
    {
      key: "plate",
      label: dict.trailers.plate,
      render: (row) => (
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            {row.plate}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.fleetNo}
          </Typography>
        </Box>
      ),
      sortable: true,
    },
    {
      key: "type",
      label: dict.trailers.type,
      render: (row) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2">
            {dict.trailers.types[row.type as keyof typeof dict.trailers.types]}
          </Typography>
          {row.isColdChain && (
            <Tooltip title={dict.trailers.coldChain}>
              <AcUnit sx={{ fontSize: 16, color: "info.main" }} />
            </Tooltip>
          )}
        </Stack>
      ),
    },
    {
      key: "capacity",
      label: dict.trailers.capacity,
      render: (row) => (
        <Typography variant="body2">
          {row.capacityVolumeM3} m³
        </Typography>
      ),
      align: "right",
    },
    {
      key: "status",
      label: dict.trailers.status,
      render: (row) => {
        const colors: Record<string, "success" | "warning" | "error" | "default" | "primary"> = {
          AVAILABLE: "success",
          IN_USE: "primary",
          MAINTENANCE: "warning",
          RETIRED: "default",
        };
        return (
          <Chip
            label={dict.trailers.statuses[row.status as keyof typeof dict.trailers.statuses]}
            color={colors[row.status] || "default"}
            size="small"
            variant="outlined"
          />
        );
      },
    },
    {
      key: "currentVehicle",
      label: dict.trailers.currentVehicle,
      render: (row) => (
        row.currentVehicle ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocalShipping sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography variant="body2">
              {row.currentVehicle.plate}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {dict.trailers.notAssigned}
          </Typography>
        )
      ),
    },
  ];

  const rowActions: DataTableRowAction<TrailerWithRelations>[] = [
    {
      label: dict.common.edit,
      icon: <Edit fontSize="small" />,
      onClick: onEdit,
    },
    {
      label: dict.trailers.assignToVehicle,
      icon: <Link fontSize="small" />,
      onClick: (row) => onAssign(row),
      hidden: (row) => !!row.currentVehicle,
    },
    {
      label: dict.trailers.detach,
      icon: <LinkOff fontSize="small" />,
      onClick: (row) => onDetach(row),
      hidden: (row) => !row.currentVehicle,
    },
    {
      label: dict.common.delete,
      icon: <Delete fontSize="small" />,
      onClick: onDelete,
      color: "error",
    },
  ];

  return (
    <DataTable
      rows={trailers}
      columns={columns}
      loading={loading}
      rowActions={rowActions}
      tableTitle={dict.trailers.title}
      emptyMessage={dict.trailers.emptyMessage || "No trailers found"}
      wrapCard
    />
  );
}
