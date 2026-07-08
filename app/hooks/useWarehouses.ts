"use client";

import { useEffect } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  getWarehouseById,
  getWarehouseStats,
  getRecentStockMovements,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  assignManagerToWarehouse,
} from "@/app/lib/controllers/warehouse";
import type { Warehouse } from "@/app/lib/type/enums";
import { toast } from "sonner";

import { warehouseKeys } from "@/app/lib/query-keys/warehouse.keys";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { logger } from "@/app/lib/logger";

import {
  WarehouseWithRelations,
  WarehouseStats,
  InventoryMovementWithRelations,
} from "@/app/lib/type/warehouse";

async function fetchWarehouses(): Promise<WarehouseWithRelations[]> {
  const params = new URLSearchParams();
  params.set("_t", Date.now().toString());

  const res = await fetch(`/api/warehouses?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`[useWarehouses] fetch failed: ${res.status}`);
  }

  return res.json();
}

export function useWarehouses() {
  return useQuery({
    queryKey: warehouseKeys.lists(),
    queryFn: () => fetchWarehouses(),
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

async function fetchWarehouseDashboard(
  page: number,
  pageSize: number
): Promise<{
  warehouses: WarehouseWithRelations[];
  totalCount: number;
  stats: WarehouseStats;
  statsTrends?: {
    totalWarehouses?: { value: number; isUp: boolean };
  };
  recentMovements: InventoryMovementWithRelations[];
}> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));
  params.set("_t", Date.now().toString());

  const res = await fetch(`/api/warehouses/dashboard?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`[useWarehousesWithDashboard] fetch failed: ${res.status}`);
  }

  return res.json();
}

export function useWarehousesWithDashboard(
  page: number = 1,
  pageSize: number = 10
) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: warehouseKeys.dashboardWithFilters(page, pageSize),
    queryFn: () => fetchWarehouseDashboard(page, pageSize),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    const totalCount = query.data?.totalCount;
    if (!totalCount) return;
    const totalPages = Math.ceil(totalCount / pageSize);
    const pagesToPrefetch = Math.max(1, Math.ceil(30 / pageSize));
    for (let i = 1; i <= pagesToPrefetch; i++) {
      const nextPage = page + i;
      if (nextPage > totalPages) break;
      queryClient.prefetchQuery({
        queryKey: warehouseKeys.dashboardWithFilters(nextPage, pageSize),
        queryFn: () => fetchWarehouseDashboard(nextPage, pageSize),
        staleTime: 1000 * 60 * 5,
      });
    }

  }, [queryClient, query.data, page, pageSize]);

  return query;
}

export function useWarehouseMutations() {
  const queryClient = useQueryClient();
  const dict = useDictionary();

  const handleSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: warehouseKeys.all });
    toast.success(message);
  };

  const handleError = (message: string, error: unknown) => {
    logger.error(message, error);
    toast.error(error instanceof Error ? error.message : message);
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
      timezone?: string;
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
        data.timezone,
        data.specifications
      ),
    onSuccess: () => handleSuccess(dict.toasts.successAdd),
    onError: (error: Error) => handleError(dict.toasts.errorGeneric, error),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Warehouse> }) =>
      updateWarehouse(id, data),
    onSuccess: () => handleSuccess(dict.toasts.successUpdate),
    onError: (error: Error) => handleError(dict.toasts.errorGeneric, error),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteWarehouse(id),
    onSuccess: () => handleSuccess(dict.toasts.successDelete),
    onError: (error: Error) => handleError(dict.toasts.errorGeneric, error),
  });

  const assignManagerMutation = useMutation({
    mutationFn: ({ warehouseId, userId }: { warehouseId: string; userId: string }) => assignManagerToWarehouse(warehouseId, userId),
    onSuccess: () => handleSuccess(dict.toasts.successUpdate),
    onError: (error: Error) =>
      handleError(dict.toasts.errorGeneric, error),
  });

  return {
    createWarehouse: createMutation,
    updateWarehouse: updateMutation,
    deleteWarehouse: deleteMutation,
    assignManager: assignManagerMutation,
  };
}
