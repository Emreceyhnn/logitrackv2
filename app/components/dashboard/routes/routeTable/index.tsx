"use client";

import { useState, useMemo, useCallback } from "react";
import { Typography } from "@mui/material";
import DataTable from "@/app/components/ui/DataTable";
import type { DataTableColumn, DataTableRowAction } from "@/app/lib/type/dataTable";
import RouteDetailsDialog from "@/app/components/dialogs/routes";
import { StatusChip } from "@/app/components/chips/statusChips";
import { RouteTableProps, RouteWithRelations } from "@/app/lib/type/routes";

import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { updateRouteStatus } from "@/app/lib/controllers/routes";
import { RouteStatus } from "@prisma/client";
import { toast } from "sonner";

interface ExtendedRouteTableProps extends RouteTableProps {
  onRefresh?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const RouteTable = ({
  routes,
  loading = false,
  pagination,
  onPageChange,
  onSelect,
  onEdit,
  onDelete,
  onRefresh,
}: ExtendedRouteTableProps) => {

  /* --------------------------------- states --------------------------------- */
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<RouteWithRelations | null>(null);

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Local Pagination Fallback
  const [localPage, setLocalPage] = useState(1);
  const [localLimit, setLocalLimit] = useState(10);

  const meta = useMemo(() => {
    if (pagination) return { page: pagination.page, limit: pagination.pageSize, total: pagination.total };
    return { page: localPage, limit: localLimit, total: routes.length };
  }, [pagination, localPage, localLimit, routes.length]);

  const paginatedRoutes = pagination
    ? routes
    : routes.slice((meta.page - 1) * meta.limit, meta.page * meta.limit);

  /* -------------------------------- handlers -------------------------------- */
  const handleCloseDetails = useCallback(() => {
    setOpenDetails(false);
    setSelectedRoute(null);
    if (onSelect) onSelect("");
  }, [onSelect]);

  const handleOpenDetails = useCallback((id: string) => {
    const route = routes.find((v) => v.id === id);
    if (!route) return;
    setSelectedRoute(route);
    setOpenDetails(true);
    if (onSelect) onSelect(id);
  }, [routes, onSelect]);

  const handleChangePage = useCallback((newPage: number) => {
    if (onPageChange) onPageChange(newPage);
    else setLocalPage(newPage);
  }, [onPageChange]);
  
  const handleLimitChange = useCallback((newLimit: number) => {
    // There is no onLimitChange passed down in ExtendedRouteTableProps currently, handle locally
    setLocalLimit(newLimit);
    if (!onPageChange) setLocalPage(1);
  }, [onPageChange]);

  const handleStatusChange = useCallback(async (id: string, newStatus: RouteStatus) => {
    setActionLoading(id);
    try {
      await updateRouteStatus(id, newStatus);
      toast.success(`Route updated to ${newStatus}`);
      onRefresh?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update route";
      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  }, [onRefresh]);

  const columns: DataTableColumn<RouteWithRelations>[] = useMemo(() => [
    {
      key: "routeId",
      label: "Route Id",
      render: (row) => (
        <Typography variant="body2" fontWeight={600}>
          {row.name || row.id}
        </Typography>
      ),
    },
    {
      key: "vehiclePlate",
      label: "Vehicle Plate",
      render: (row) => row.vehicle?.plate || "Unassigned",
    },
    {
      key: "origin",
      label: "Origin",
      render: (row) => row.startAddress || "N/A",
    },
    {
      key: "destination",
      label: "Destination",
      render: (row) => row.endAddress || "N/A",
    },
    {
      key: "eta",
      label: "ETA",
      render: (row) => (row.endTime ? new Date(row.endTime).toLocaleString() : "N/A"),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusChip status={row.status} />,
    },
  ], []);

  const rowActions: DataTableRowAction<RouteWithRelations>[] = useMemo(() => {
    const actions: DataTableRowAction<RouteWithRelations>[] = [
      {
        label: "Details",
        icon: <ContentPasteIcon fontSize="small" />,
        onClick: (row) => handleOpenDetails(row.id),
      },
      {
        label: "Activate Route",
        icon: <PlayArrowIcon fontSize="small" />,
        onClick: (row) => handleStatusChange(row.id, "ACTIVE"),
        hidden: (row) => row.status !== "PLANNED",
      },
      {
        label: "Complete Route",
        icon: <CheckCircleIcon fontSize="small" />,
        onClick: (row) => handleStatusChange(row.id, "COMPLETED"),
        hidden: (row) => row.status !== "ACTIVE",
      },
    ];

    if (onEdit) {
      actions.push({
        label: "Edit",
        icon: <EditIcon fontSize="small" />,
        onClick: (row) => onEdit(row.id),
      });
    }

    if (onDelete) {
      actions.push({
        label: "Delete",
        icon: <DeleteIcon fontSize="small" />,
        onClick: (row) => onDelete(row.id),
        color: "error",
      });
    }

    return actions;
  }, [handleOpenDetails, handleStatusChange, onEdit, onDelete]);

  return (
    <>
      <DataTable<RouteWithRelations>
        rows={paginatedRoutes}
        columns={columns}
        rowActions={rowActions}
        loading={loading || !!actionLoading}
        emptyMessage="No routes found."
        meta={meta}
        onPageChange={handleChangePage}
        onLimitChange={handleLimitChange}
        wrapCard={true}
        tableTitle="Route List"
      />
      
      <RouteDetailsDialog
        open={openDetails}
        onClose={handleCloseDetails}
        route={selectedRoute}
      />
    </>
  );
};

export default RouteTable;
