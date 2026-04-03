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
  unassignVehicleFromDriver
} from "@/app/lib/controllers/driver";
import { 
  DriverWithRelations, 
  DriverDashboardResponseType, 
  PaginatedResponse 
} from "@/app/lib/type/driver";
import { DriverStatus } from "@prisma/client";
import { toast } from "sonner";

export const driverKeys = {
  all: ["drivers"] as const,
  lists: () => [...driverKeys.all, "list"] as const,
  list: (params: { 
    page: number; 
    limit: number; 
    search?: string; 
    status?: DriverStatus[]; 
    hasVehicle?: boolean; 
    sortField?: string; 
    sortOrder?: "asc" | "desc" 
  }) => [...driverKeys.lists(), params] as const,
  details: () => [...driverKeys.all, "detail"] as const,
  detail: (id: string) => [...driverKeys.details(), id] as const,
  dashboard: () => [...driverKeys.all, "dashboard"] as const,
};

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
    queryKey: driverKeys.list({ page, limit, search, status, hasVehicle, sortField, sortOrder }),
    queryFn: () => getDrivers(page, limit, search, status, hasVehicle, sortField, sortOrder),
    staleTime: 1000 * 60 * 5,
  });
}

export function useDriverDashboardData() {
  return useQuery<DriverDashboardResponseType>({
    queryKey: driverKeys.dashboard(),
    queryFn: () => getDriverDashboardData(),
    staleTime: 1000 * 60 * 5,
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
    mutationFn: (data: Parameters<typeof createDriver>[0]) => createDriver(data),
    onSuccess: () => handleSuccess("Driver created successfully"),
    onError: (error: Error) => handleError("Failed to create driver", error),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateDriver>[1] }) => updateDriver(id, data),
    onSuccess: () => handleSuccess("Driver updated successfully"),
    onError: (error: Error) => handleError("Failed to update driver", error),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDriver(id),
    onSuccess: () => handleSuccess("Driver deleted successfully"),
    onError: (error: Error) => handleError("Failed to delete driver", error),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: DriverStatus }) => updateDriverStatus(id, status),
    onSuccess: () => handleSuccess("Driver status updated successfully"),
    onError: (error: Error) => handleError("Failed to update driver status", error),
  });

  const assignMutation = useMutation({
    mutationFn: ({ driverId, vehicleId }: { driverId: string; vehicleId: string }) => assignVehicleToDriver(driverId, vehicleId),
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
