"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  updateVehicleStatus,
} from "@/app/lib/controllers/vehicle";
import { VehicleFilters, VehicleDashboardResponseType, VehicleWithRelations } from "@/app/lib/type/vehicle";
import { toast } from "sonner";

// Imported for local use in the hooks below.
// Server Components (page.tsx) import vehicleKeys directly from
// "@/app/lib/query-keys/vehicle.keys" to avoid the "use client" boundary.
import { vehicleKeys } from "@/app/lib/query-keys/vehicle.keys";

export function useVehicles(filters: VehicleFilters = {}) {
  return useQuery({
    queryKey: vehicleKeys.list(filters),
    queryFn: () => getVehicles(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}

/**
 * Fetches vehicle dashboard data via the API route.
 *
 * We intentionally use a Route Handler instead of the Server Action
 * (getVehiclesWithDashboard) because Next.js triggers router.refresh()
 * automatically after every Server Action completes — even read-only ones.
 * This caused a full page reload on every filter/search change.
 * A plain HTTP fetch via the Route Handler has no such side-effect.
 */
async function fetchVehicleDashboard(
  filters: VehicleFilters
): Promise<VehicleDashboardResponseType & { vehicles: VehicleWithRelations[] }> {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.status?.length) filters.status.forEach((s) => params.append("status", s));
  if (filters.type?.length) filters.type.forEach((t) => params.append("type", t));
  if (filters.hasIssues !== undefined) params.set("hasIssues", String(filters.hasIssues));
  if (filters.hasDriver !== undefined) params.set("hasDriver", String(filters.hasDriver));

  const res = await fetch(`/api/vehicles/dashboard?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`[useVehicleWithDashboard] fetch failed: ${res.status}`);
  }

  return res.json() as Promise<VehicleDashboardResponseType & { vehicles: VehicleWithRelations[] }>;
}

export function useVehicleWithDashboard(filters: VehicleFilters = {}) {
  return useQuery({
    queryKey: vehicleKeys.dashboardWithFilters(filters),
    queryFn: () => fetchVehicleDashboard(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}

export function useVehicleMutations() {
  const queryClient = useQueryClient();

  const handleSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
    toast.success(message);
  };

  const handleError = (message: string, error: Error | unknown) => {
    console.error(message, error);
    toast.error((error as Error)?.message || message);
  };

  const createMutation = useMutation({
    mutationFn: (data: Parameters<typeof createVehicle>[0]) =>
      createVehicle(data),
    onSuccess: () => handleSuccess("Vehicle created successfully"),
    onError: (error: Error) => handleError("Failed to create vehicle", error),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateVehicle>[1];
    }) => updateVehicle(id, data),
    onSuccess: () => handleSuccess("Vehicle updated successfully"),
    onError: (error: Error) => handleError("Failed to update vehicle", error),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVehicle(id),
    onSuccess: () => handleSuccess("Vehicle deleted successfully"),
    onError: (error: Error) => handleError("Failed to delete vehicle", error),
  });

  const statusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: Parameters<typeof updateVehicleStatus>[1];
    }) => updateVehicleStatus(id, status),
    onSuccess: () => handleSuccess("Vehicle status updated successfully"),
    onError: (error: Error) =>
      handleError("Failed to update vehicle status", error),
  });

  return {
    createVehicle: createMutation,
    updateVehicle: updateMutation,
    deleteVehicle: deleteMutation,
    updateVehicleStatus: statusMutation,
  };
}
