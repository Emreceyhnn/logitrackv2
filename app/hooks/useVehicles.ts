"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  createVehicle,
  updateVehicle,
  deleteVehicle,
  updateVehicleStatus,
} from "@/app/lib/controllers/vehicle";
import {
  VehicleFilters,
  VehicleDashboardResponseType,
  VehicleWithRelations,
} from "@/app/lib/type/vehicle";
import { toast } from "sonner";

import { vehicleKeys } from "@/app/lib/query-keys/vehicle.keys";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { logger } from "@/app/lib/logger";


async function fetchVehicles(
  filters: VehicleFilters
): Promise<VehicleWithRelations[]> {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("pageSize", String(filters.limit));
  if (filters.search) params.set("search", filters.search);
  if (filters.status?.length)
    filters.status.forEach((s) => params.append("status", s));
  if (filters.type?.length)
    filters.type.forEach((t) => params.append("type", t));
  if (filters.hasIssues !== undefined)
    params.set("hasIssues", String(filters.hasIssues));
  if (filters.hasDriver !== undefined)
    params.set("hasDriver", String(filters.hasDriver));

  const res = await fetch(`/api/vehicles?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`[useVehicles] fetch failed: ${res.status}`);
  }

  return res.json() as Promise<VehicleWithRelations[]>;
}

export function useVehicles(filters: VehicleFilters = {}) {
  return useQuery({
    queryKey: vehicleKeys.list(filters),
    queryFn: () => fetchVehicles(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}

async function fetchVehicleDashboard(
  filters: VehicleFilters
): Promise<
  VehicleDashboardResponseType & { vehicles: VehicleWithRelations[] }
> {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("pageSize", String(filters.limit));
  if (filters.search) params.set("search", filters.search);
  if (filters.status?.length)
    filters.status.forEach((s) => params.append("status", s));
  if (filters.type?.length)
    filters.type.forEach((t) => params.append("type", t));
  if (filters.hasIssues !== undefined)
    params.set("hasIssues", String(filters.hasIssues));
  if (filters.hasDriver !== undefined)
    params.set("hasDriver", String(filters.hasDriver));

  const res = await fetch(`/api/vehicles/dashboard?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`[useVehicleWithDashboard] fetch failed: ${res.status}`);
  }

  return res.json() as Promise<
    VehicleDashboardResponseType & { vehicles: VehicleWithRelations[] }
  >;
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
  const dict = useDictionary();
  const queryClient = useQueryClient();

  const handleSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
    toast.success(message);
  };

  const handleError = (message: string, error: unknown) => {
    logger.error(message, error);
    toast.error(error instanceof Error ? error.message : message);
  };

  const createMutation = useMutation({
    mutationFn: (data: Parameters<typeof createVehicle>[0]) =>
      createVehicle(data),
    onSuccess: () => handleSuccess(dict.toasts.successAdd),
    onError: (error: Error) => handleError(dict.toasts.errorGeneric, error),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateVehicle>[1];
    }) => updateVehicle(id, data),
    onSuccess: () => handleSuccess(dict.toasts.successUpdate),
    onError: (error: Error) => handleError(dict.toasts.errorGeneric, error),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVehicle(id),
    onSuccess: () => handleSuccess(dict.toasts.successDelete),
    onError: (error: Error) => handleError(dict.toasts.errorGeneric, error),
  });

  const statusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: Parameters<typeof updateVehicleStatus>[1];
    }) => updateVehicleStatus(id, status),
    onSuccess: () => handleSuccess(dict.toasts.successUpdate),
    onError: (error: Error) =>
      handleError(dict.toasts.errorGeneric, error),
  });

  return {
    createVehicle: createMutation,
    updateVehicle: updateMutation,
    deleteVehicle: deleteMutation,
    updateVehicleStatus: statusMutation,
  };
}
