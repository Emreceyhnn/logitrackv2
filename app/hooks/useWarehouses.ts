import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWarehouses,
  getWarehouseById,
  getWarehouseStats,
  getRecentStockMovements,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  getWarehousesWithDashboardData,
  assignManagerToWarehouse,
} from "@/app/lib/controllers/warehouse";
import { Warehouse } from "@/app/lib/type/enums";
import { toast } from "sonner";

export const warehouseKeys = {
  all: ["warehouses"] as const,
  lists: () => [...warehouseKeys.all, "list"] as const,
  details: (id: string) => [...warehouseKeys.all, "detail", id] as const,
  stats: () => [...warehouseKeys.all, "stats"] as const,
  movements: () => [...warehouseKeys.all, "movements"] as const,
  dashboard: () => [...warehouseKeys.all, "dashboard"] as const,
  dashboardWithFilters: (page: number, pageSize: number) =>
    [...warehouseKeys.dashboard(), { page, pageSize }] as const,
};

export function useWarehouses() {
  return useQuery({
    queryKey: warehouseKeys.lists(),
    queryFn: () => getWarehouses(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useWarehouse(id: string | null) {
  return useQuery({
    queryKey: warehouseKeys.details(id || ""),
    queryFn: () => (id ? getWarehouseById(id) : null),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useWarehouseStats() {
  return useQuery({
    queryKey: warehouseKeys.stats(),
    queryFn: () => getWarehouseStats(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useRecentStockMovements() {
  return useQuery({
    queryKey: warehouseKeys.movements(),
    queryFn: () => getRecentStockMovements(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useWarehousesWithDashboard(
  page: number = 1,
  pageSize: number = 10
) {
  return useQuery({
    queryKey: warehouseKeys.dashboardWithFilters(page, pageSize),
    queryFn: () => getWarehousesWithDashboardData(page, pageSize),
    staleTime: 1000 * 60 * 5,
  });
}


export function useWarehouseMutations() {
  const queryClient = useQueryClient();

  const handleSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: warehouseKeys.all });
    toast.success(message);
  };

  const handleError = (message: string, error: Error | unknown) => {
    console.error(message, error);
    toast.error((error as Error)?.message || message);
  };

  const createMutation = useMutation({
    mutationFn: (data: {
      name: string;
      code: string;
      type: import("@prisma/client").WarehouseType;
      address: string;
      city: string;
      country: string;
      lat?: number;
      lng?: number;
      managerId: string;
      capacityPallets: number;
      capacityVolumeM3: number;
      operatingHours?: string;
      specifications?: string[];
    }) =>
      createWarehouse(
        data.name,
        data.code,
        data.type,
        data.address,
        data.city,
        data.country,
        data.lat,
        data.lng,
        data.managerId,
        data.capacityPallets,
        data.capacityVolumeM3,
        data.operatingHours,
        data.specifications
      ),
    onSuccess: () => handleSuccess("Warehouse created successfully"),
    onError: (error: Error) => handleError("Failed to create warehouse", error),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Warehouse> }) =>
      updateWarehouse(id, data),
    onSuccess: () => handleSuccess("Warehouse updated successfully"),
    onError: (error: Error) => handleError("Failed to update warehouse", error),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteWarehouse(id),
    onSuccess: () => handleSuccess("Warehouse deleted successfully"),
    onError: (error: Error) => handleError("Failed to delete warehouse", error),
  });

  const assignManagerMutation = useMutation({
    mutationFn: ({ id, managerId }: { id: string; managerId: string }) =>
      assignManagerToWarehouse(id, managerId),
    onSuccess: () => handleSuccess("Manager assigned successfully"),
    onError: (error: Error) => handleError("Failed to assign manager", error),
  });

  return {
    createWarehouse: createMutation,
    updateWarehouse: updateMutation,
    deleteWarehouse: deleteMutation,
    assignManager: assignManagerMutation,
  };
}
