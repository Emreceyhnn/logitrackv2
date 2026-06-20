"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Typography } from "@mui/material";
import DataTable from "@/app/components/ui/DataTable";
import type {
  DataTableColumn,
  DataTableRowAction,
} from "@/app/lib/type/dataTable";
import RouteDetailsDialog from "@/app/components/dialogs/routes";
import { StatusChip } from "@/app/components/chips/statusChips";
import { RouteTableProps, RouteWithRelations } from "@/app/lib/type/routes";

import { useDateSettings } from "@/app/hooks/useDateSettings";
import { formatDisplayDateTime } from "@/app/lib/utils/date";

import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { updateRouteStatus } from "@/app/lib/controllers/routes";
import { RouteStatus } from "@/app/lib/type/enums";
import { toast } from "sonner";
import { getStatusMeta } from "@/app/lib/priorityColor";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

interface ExtendedRouteTableProps extends RouteTableProps {
  onRefresh?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  filters?: { status?: RouteStatus[]; search?: string };
  onFilterChange?: (filters: { status?: RouteStatus[]; search?: string }) => void;
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
  filters,
  onFilterChange,
}: ExtendedRouteTableProps) => {
  const dict = useDictionary();

  const dateSettings = useDateSettings();

  /* --------------------------------- states --------------------------------- */
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<RouteWithRelations | null>(
    null
  );

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Local Pagination Fallback
  const [localPage, setLocalPage] = useState(1);
  const [localLimit, setLocalLimit] = useState(10);

  const meta = useMemo(() => {
    if (pagination)
      return {
        page: pagination.page,
        limit: pagination.pageSize,
        total: pagination.total,
      };
    return { page: localPage, limit: localLimit, total: routes.length };
  }, [pagination, localPage, localLimit, routes.length]);

  useEffect(() => {
    if (selectedRoute) {
      const updated = routes.find((r) => r.id === selectedRoute.id);
      if (updated && updated !== selectedRoute) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedRoute(updated);
      }
    }
  }, [routes, selectedRoute]);

  const paginatedRoutes = pagination
    ? routes
    : routes.slice((meta.page - 1) * meta.limit, meta.page * meta.limit);

  /* -------------------------------- handlers -------------------------------- */
  const handleCloseDetails = useCallback(() => {
    setOpenDetails(false);
    setSelectedRoute(null);
    if (onSelect) onSelect("");
  }, [onSelect]);

  const handleOpenDetails = useCallback(
    (id: string) => {
      const route = routes.find((v) => v.id === id);
      if (!route) return;
      setSelectedRoute(route);
      setOpenDetails(true);
      if (onSelect) onSelect(id);
    },
    [routes, onSelect]
  );

  const handleChangePage = useCallback(
    (newPage: number) => {
      if (onPageChange) onPageChange(newPage);
      else setLocalPage(newPage);
    },
    [onPageChange]
  );

  const handleLimitChange = useCallback(
    (newLimit: number) => {
      // There is no onLimitChange passed down in ExtendedRouteTableProps currently, handle locally
      setLocalLimit(newLimit);
      if (!onPageChange) setLocalPage(1);
    },
    [onPageChange]
  );

  /* ---------------------------------- filters ---------------------------------- */
  const STATUS_OPTIONS = useMemo(
    () =>
      Object.values(RouteStatus).map((s) => ({
        label: getStatusMeta(s, dict).label || s.replace(/_/g, " "),
        value: s,
      })),
    [dict]
  );

  const ROUTE_FILTERS = useMemo(
    () => [
      {
        key: "status",
        label: dict.routes.table.columns.status || "Status",
        options: STATUS_OPTIONS,
        multiple: true,
      },
    ],
    [dict, STATUS_OPTIONS]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      onFilterChange?.({ search: value });
    },
    [onFilterChange]
  );

  const handleFilterChange = useCallback(
    (key: string, values: string[]) => {
      if (key === "status") {
        onFilterChange?.({ status: values as RouteStatus[] });
      }
    },
    [onFilterChange]
  );

  const activeFilters: Record<string, string[]> = useMemo(
    () => ({
      ...(filters?.status && filters.status.length > 0
        ? { status: filters.status as string[] }
        : {}),
    }),
    [filters]
  );

  const handleStatusChange = useCallback(
    async (id: string, newStatus: RouteStatus) => {
      setActionLoading(id);
      try {
        await updateRouteStatus(id, newStatus);
        const statusLabel = getStatusMeta(newStatus, dict).label || "";
        const successMsg =
          dict.routes.toasts.updateSuccess || "Route updated to {status}";
        toast.success(successMsg.replace("{status}", statusLabel));
        onRefresh?.();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : dict.routes.toasts.updateError;
        toast.error(message);
      } finally {
        setActionLoading(null);
      }
    },
    [onRefresh, dict]
  );

  const columns: DataTableColumn<RouteWithRelations>[] = useMemo(
    () => [
      {
        key: "routeId",
        label: dict.routes.table.columns.routeId,
        render: (row) => (
          <Typography variant="body2" fontWeight={600}>
            {row.name || row.id}
          </Typography>
        ),
      },
      {
        key: "vehiclePlate",
        label: dict.routes.table.columns.vehiclePlate,
        render: (row) => row.vehicle?.plate || dict.common.unassigned,
      },
      {
        key: "origin",
        label: dict.routes.table.columns.origin,
        render: (row) => {
          const firstStop = Array.isArray(row.stops) ? row.stops[0] as { address?: string } : null;
          return firstStop?.address || dict.common.na;
        },
      },
      {
        key: "destination",
        label: dict.routes.table.columns.destination,
        render: (row) => {
          const lastStop = Array.isArray(row.stops) && row.stops.length > 0 ? row.stops[row.stops.length - 1] as { address?: string } : null;
          return lastStop?.address || dict.common.na;
        },
      },
      {
        key: "eta",
        label: dict.routes.table.columns.eta,
        render: (row) =>
          row.endTime
            ? formatDisplayDateTime(row.endTime, dateSettings)
            : dict.common.na,
      },
      {
        key: "status",
        label: dict.routes.table.columns.status,
        render: (row) => <StatusChip status={row.status} />,
      },
    ],
    [dict, dateSettings]
  );

  const rowActions: DataTableRowAction<RouteWithRelations>[] = useMemo(() => {
    const actions: DataTableRowAction<RouteWithRelations>[] = [
      {
        label: dict.common.details,
        icon: <ContentPasteIcon fontSize="small" />,
        onClick: (row) => handleOpenDetails(row.id),
      },
      {
        label: dict.routes.table.actions.activate,
        icon: <PlayArrowIcon fontSize="small" />,
        onClick: (row) => handleStatusChange(row.id, "ACTIVE"),
        hidden: (row) => row.status !== "PLANNED",
      },
      {
        label: dict.routes.table.actions.complete,
        icon: <CheckCircleIcon fontSize="small" />,
        onClick: (row) => handleStatusChange(row.id, "COMPLETED"),
        hidden: (row) => row.status !== "ACTIVE",
      },
    ];

    if (onEdit) {
      actions.push({
        label: dict.common.edit,
        icon: <EditIcon fontSize="small" />,
        onClick: (row) => onEdit(row.id),
      });
    }

    if (onDelete) {
      actions.push({
        label: dict.common.delete,
        icon: <DeleteIcon fontSize="small" />,
        onClick: (row) => onDelete(row.id),
        color: "error",
      });
    }

    return actions;
  }, [handleOpenDetails, handleStatusChange, onEdit, onDelete, dict]);

  return (
    <>
      <DataTable<RouteWithRelations>
        rows={paginatedRoutes}
        columns={columns}
        rowActions={rowActions}
        loading={loading || !!actionLoading}
        emptyMessage={dict.routes.table.noRoutes}
        searchValue={filters?.search ?? ""}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        searchPlaceholder={(dict.routes.table as any).searchPlaceholder || dict.common.search || "Search route..."}
        onSearchChange={handleSearchChange}
        filters={ROUTE_FILTERS}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        meta={meta}
        onPageChange={handleChangePage}
        onLimitChange={handleLimitChange}
        wrapCard={true}
        tableTitle={dict.routes.table.title}
      />

      <RouteDetailsDialog
        open={openDetails}
        onClose={handleCloseDetails}
        onSuccess={onRefresh}
        route={selectedRoute}
      />
    </>
  );
};

export default RouteTable;
