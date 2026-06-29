"use client";

import { useEffect } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  createDriver,
  updateDriver,
  deleteDriver,
  updateDriverStatus,
  assignVehicleToDriver,
  unassignVehicleFromDriver,
} from "@/app/lib/controllers/driver";
import {
  DriverWithRelations,
  PaginatedResponse,
  DriverFilters,
  DriverDashboardResponseType,
} from "@/app/lib/type/driver";
import { DriverStatus } from "@/app/lib/type/enums";
import { toast } from "sonner";

import { driverKeys } from "@/app/lib/query-keys/driver.keys";

async function fetchDrivers(
  page: number,
  limit: number,
  search?: string,
  status?: DriverStatus[],
  hasVehicle?: boolean,
  sortField?: string,
  sortOrder?: "asc" | "desc"
): Promise<PaginatedResponse<DriverWithRelations>> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (search) params.set("search", search);
  if (status?.length) status.forEach((s) => params.append("status", s));
  if (hasVehicle !== undefined) params.set("hasVehicle", String(hasVehicle));
  if (sortField) params.set("sortField", sortField);
  if (sortOrder) params.set("sortOrder", sortOrder);

  const res = await fetch(`/api/drivers?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`[useDrivers] fetch failed: ${res.status}`);
  }

  return res.json();
}

export function useDrivers(
  page: number = 1,
  limit: number = 10,
  search?: string,
  status?: DriverStatus[],
  hasVehicle?: boolean,
  sortField?: string,
  sortOrder?: "asc" | "desc"
) {
  return useQuery<PaginatedResponse<DriverWithRelations>>({
    queryKey: driverKeys.list({
      page,
      limit,
      search,
      status,
      hasVehicle,
      sortField,
      sortOrder,
    }),
    queryFn: () =>
      fetchDrivers(
        page,
        limit,
        search,
        status,
        hasVehicle,
        sortField,
        sortOrder
      ),
    staleTime: 1000 * 60 * 5,
  });
}

export function useDriverDashboardData() {
  return useQuery({
    queryKey: driverKeys.dashboard(),
    queryFn: async () => {
      const res = await fetch(`/api/drivers/dashboard`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`[useDriverDashboardData] fetch failed: ${res.status}`);
      }
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}

async function fetchDriverDashboard(filters: DriverFilters): Promise<{
  drivers: DriverWithRelations[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  driversKpis: DriverDashboardResponseType["driversKpis"];
  topPerformers: DriverDashboardResponseType["topPerformers"];
  performanceCharts: DriverDashboardResponseType["performanceCharts"];
  kpiTrends: DriverDashboardResponseType["kpiTrends"];
}> {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.search) params.set("search", filters.search);
  if (filters.status?.length)
    filters.status.forEach((s) => params.append("status", s));
  if (filters.hasVehicle !== undefined)
    params.set("hasVehicle", String(filters.hasVehicle));
  if (filters.sortField) params.set("sortField", filters.sortField);
  if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);

  const res = await fetch(`/api/drivers/dashboard?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`[useDriverWithDashboard] fetch failed: ${res.status}`);
  }

  return res.json();
}

export function useDriverWithDashboard(
  page: number = 1,
  limit: number = 10,
  search?: string,
  status?: DriverStatus[],
  hasVehicle?: boolean,
  sortField?: string,
  sortOrder?: "asc" | "desc"
) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: driverKeys.dashboardWithFilters({
      page,
      limit,
      search,
      status,
      hasVehicle,
      sortField,
      sortOrder,
    }),
    queryFn: () =>
      fetchDriverDashboard({
        page,
        limit,
        search,
        status,
        hasVehicle,
        sortField,
        sortOrder,
      }),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });

  // Prefetch the next ~30 items (multiple pages) so pagination feels instant.
  // prefetchQuery is a no-op for pages already in cache — only genuinely new
  // pages trigger a fetch (incremental behaviour).
  useEffect(() => {
    const totalPages = query.data?.meta?.totalPages;
    if (!totalPages) return;
    const pagesToPrefetch = Math.max(1, Math.ceil(30 / limit));
    for (let i = 1; i <= pagesToPrefetch; i++) {
      const nextPage = page + i;
      if (nextPage > totalPages) break;
      queryClient.prefetchQuery({
        queryKey: driverKeys.dashboardWithFilters({
          page: nextPage,
          limit,
          search,
          status,
          hasVehicle,
          sortField,
          sortOrder,
        }),
        queryFn: () =>
          fetchDriverDashboard({
            page: nextPage,
            limit,
            search,
            status,
            hasVehicle,
            sortField,
            sortOrder,
          }),
        staleTime: 1000 * 60 * 5,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient, query.data, page, limit]);

  return query;
}

export function useDriverMutations() {
  const queryClient = useQueryClient();

  const handleSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: driverKeys.all });
    toast.success(message);
  };

  const handleError = (message: string, error: unknown) => {
    console.error(message, error);
    toast.error(error instanceof Error ? error.message : message);
  };

  const createMutation = useMutation({
    mutationFn: (data: Parameters<typeof createDriver>[0]) =>
      createDriver(data),
    onSuccess: () => handleSuccess("Driver created successfully"),
    onError: (error: Error) => handleError("Failed to create driver", error),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateDriver>[1];
    }) => updateDriver(id, data),
    onSuccess: () => handleSuccess("Driver updated successfully"),
    onError: (error: Error) => handleError("Failed to update driver", error),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDriver(id),
    onSuccess: () => handleSuccess("Driver deleted successfully"),
    onError: (error: Error) => handleError("Failed to delete driver", error),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: DriverStatus }) =>
      updateDriverStatus(id, status),
    onSuccess: () => handleSuccess("Driver status updated successfully"),
    onError: (error: Error) =>
      handleError("Failed to update driver status", error),
  });

  const assignMutation = useMutation({
    mutationFn: ({
      driverId,
      vehicleId,
    }: {
      driverId: string;
      vehicleId: string;
    }) => assignVehicleToDriver(driverId, vehicleId),
    onSuccess: () => handleSuccess("Vehicle assigned successfully"),
    onError: (error: Error) => handleError("Failed to assign vehicle", error),
  });

  const unassignMutation = useMutation({
    mutationFn: (driverId: string) => unassignVehicleFromDriver(driverId),
    onSuccess: () => handleSuccess("Vehicle unassigned successfully"),
    onError: (error: Error) => handleError("Failed to unassign vehicle", error),
  });

  return {
    createDriver: createMutation,
    updateDriver: updateMutation,
    deleteDriver: deleteMutation,
    updateDriverStatus: statusMutation,
    assignVehicle: assignMutation,
    unassignVehicle: unassignMutation,
  };
}
