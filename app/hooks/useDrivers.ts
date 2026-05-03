"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDrivers,
  getDriverDashboardData,
  createDriver,
  updateDriver,
  deleteDriver,
  updateDriverStatus,
  assignVehicleToDriver,
  unassignVehicleFromDriver,
} from "@/app/lib/controllers/driver";
import { DriverWithRelations, PaginatedResponse, DriverFilters, DriverDashboardResponseType } from "@/app/lib/type/driver";
import { DriverStatus } from "@/app/lib/type/enums";
import { toast } from "sonner";

// Imported for local use in the hooks below.
// Server Components (page.tsx) import driverKeys directly from
// "@/app/lib/query-keys/driver.keys" to avoid the "use client" boundary.
import { driverKeys } from "@/app/lib/query-keys/driver.keys";

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
      getDrivers(page, limit, search, status, hasVehicle, sortField, sortOrder),
    staleTime: 1000 * 60 * 5,
  });
}

export function useDriverDashboardData() {
  return useQuery({
    queryKey: driverKeys.dashboard(),
    queryFn: () => getDriverDashboardData(),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Fetches driver dashboard data via the API route.
 *
 * We intentionally use a Route Handler instead of the Server Action
 * (getDriverWithDashboardData) because Next.js triggers router.refresh()
 * automatically after every Server Action completes — even read-only ones.
 * This caused a full page reload on every filter/search change.
 * A plain HTTP fetch via the Route Handler has no such side-effect.
 */
async function fetchDriverDashboard(
  filters: DriverFilters
): Promise<{
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
}> {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.search) params.set("search", filters.search);
  if (filters.status?.length) filters.status.forEach((s) => params.append("status", s));
  if (filters.hasVehicle !== undefined) params.set("hasVehicle", String(filters.hasVehicle));
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
  return useQuery({
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
    placeholderData: (previousData, previousQuery) => previousData,
  });
}

export function useDriverMutations() {
  const queryClient = useQueryClient();

  const handleSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: driverKeys.all });
    toast.success(message);
  };

  const handleError = (message: string, error: Error | unknown) => {
    console.error(message, error);
    toast.error((error as Error)?.message || message);
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
