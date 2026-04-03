"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getVehicles, 
  getVehiclesDashboardData, 
  createVehicle, 
  updateVehicle, 
  deleteVehicle,
  updateVehicleStatus
} from "@/app/lib/controllers/vehicle";
import { VehicleWithRelations, VehicleDashboardResponseType, VehicleFilters } from "@/app/lib/type/vehicle";
import { toast } from "sonner";

export const vehicleKeys = {
  all: ["vehicles"] as const,
  lists: () => [...vehicleKeys.all, "list"] as const,
  list: (filters: VehicleFilters) => [...vehicleKeys.lists(), { filters }] as const,
  details: () => [...vehicleKeys.all, "detail"] as const,
  detail: (id: string) => [...vehicleKeys.details(), id] as const,
  dashboard: () => [...vehicleKeys.all, "dashboard"] as const,
};

export function useVehicles(filters: VehicleFilters = {}) {
  return useQuery<VehicleWithRelations[]>({
    queryKey: vehicleKeys.list(filters),
    queryFn: () => getVehicles(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useVehiclesDashboardData() {
  return useQuery<VehicleDashboardResponseType>({
    queryKey: vehicleKeys.dashboard(),
    queryFn: () => getVehiclesDashboardData(),
    staleTime: 1000 * 60 * 5,
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
    mutationFn: (data: Parameters<typeof createVehicle>[0]) => createVehicle(data),
    onSuccess: () => handleSuccess("Vehicle created successfully"),
    onError: (error: Error) => handleError("Failed to create vehicle", error),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateVehicle>[1] }) => updateVehicle(id, data),
    onSuccess: () => handleSuccess("Vehicle updated successfully"),
    onError: (error: Error) => handleError("Failed to update vehicle", error),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVehicle(id),
    onSuccess: () => handleSuccess("Vehicle deleted successfully"),
    onError: (error: Error) => handleError("Failed to delete vehicle", error),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Parameters<typeof updateVehicleStatus>[1] }) => updateVehicleStatus(id, status),
    onSuccess: () => handleSuccess("Vehicle status updated successfully"),
    onError: (error: Error) => handleError("Failed to update vehicle status", error),
  });

  return {
    createVehicle: createMutation,
    updateVehicle: updateMutation,
    deleteVehicle: deleteMutation,
    updateVehicleStatus: statusMutation,
  };
}
