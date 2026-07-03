"use client";

import { useEffect } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  getInventory,
  getInventoryItemById,
  getLowStockItems,
  getInventoryMovements,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  logWarehouseFulfillment,
  adjustInventoryStock,
} from "@/app/lib/controllers/inventory";
import type { Inventory } from "@/app/lib/type/enums";
import { toast } from "sonner";

import { inventoryKeys } from "@/app/lib/query-keys/inventory.keys";
import { InventoryWithRelations, LowStockItem } from "@/app/lib/type/inventory";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

export function useInventory(warehouseId?: string) {
  return useQuery({
    queryKey: inventoryKeys.lists(warehouseId),
    queryFn: () => getInventory(warehouseId),
    staleTime: 1000 * 60 * 5,
  });
}

async function fetchInventoryDashboard(
  page: number,
  pageSize: number,
  warehouseId?: string,
  search?: string,
  sortBy?: string,
  sortOrder?: "asc" | "desc",
  status?: string[]
): Promise<{
  items: InventoryWithRelations[];
  totalCount: number;
  stats: {
    totalItems: number;
    lowStockCount: number;
    outOfStockCount: number;
    totalValue: number;
  };
  statsTrends?: {
    totalItems?: { value: number; isUp: boolean };
    lowStock?: { value: number; isUp: boolean };
    outOfStock?: { value: number; isUp: boolean };
  };
  lowStockItems: LowStockItem[];
}> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));
  if (warehouseId) params.set("warehouseId", warehouseId);
  if (search) params.set("search", search);
  if (sortBy) params.set("sortBy", sortBy);
  if (sortOrder) params.set("sortOrder", sortOrder);
  if (status && status.length > 0) params.set("status", status.join(","));

  const response = await fetch(`/api/inventory/dashboard?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch inventory dashboard data");
  }
  return response.json();
}

export function useInventoryWithDashboard(
  page: number = 1,
  pageSize: number = 10,
  warehouseId?: string,
  search?: string,
  sortBy?: string,
  sortOrder?: "asc" | "desc",
  status?: string[]
) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: inventoryKeys.dashboardWithFilters(
      page,
      pageSize,
      warehouseId,
      search,
      sortBy,
      sortOrder,
      status
    ),
    queryFn: () =>
      fetchInventoryDashboard(
        page,
        pageSize,
        warehouseId,
        search,
        sortBy,
        sortOrder,
        status
      ),
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
        queryKey: inventoryKeys.dashboardWithFilters(
          nextPage,
          pageSize,
          warehouseId,
          search,
          sortBy,
          sortOrder,
          status
        ),
        queryFn: () =>
          fetchInventoryDashboard(
            nextPage,
            pageSize,
            warehouseId,
            search,
            sortBy,
            sortOrder,
            status
          ),
        staleTime: 1000 * 60 * 5,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient, query.data, page, pageSize]);

  return query;
}

export function useInventoryItem(id: string | null) {
  return useQuery({
    queryKey: inventoryKeys.details(id || ""),
    queryFn: () => (id ? getInventoryItemById(id) : null),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useLowStockItems() {
  return useQuery({
    queryKey: inventoryKeys.lowStock(),
    queryFn: () => getLowStockItems(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useInventoryMovements(
  sku: string | null,
  warehouseId: string | null
) {
  return useQuery({
    queryKey: inventoryKeys.movements(sku || "", warehouseId || ""),
    queryFn: () => getInventoryMovements(sku!, warehouseId!),
    enabled: !!sku && !!warehouseId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useInventoryMutations() {
  const dict = useDictionary();
  const queryClient = useQueryClient();

  const handleSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    toast.success(message);
  };

  const handleError = (message: string, error: unknown) => {
    console.error(message, error);
    toast.error(error instanceof Error ? error.message : message);
  };

  const createMutation = useMutation({
    mutationFn: (data: {
      warehouseId: string;
      sku: string;
      name: string;
      quantity: number;
      minStock: number;
      weightKg?: number;
      volumeM3?: number;
      palletCount?: number;
      cargoType?: string;
      unitValue?: number;
    }) => createInventoryItem(data),
    onSuccess: () => handleSuccess("Item added to inventory successfully"),
    onError: (error: Error) =>
      handleError(dict.toasts.errorGeneric, error),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Inventory> }) =>
      updateInventoryItem(id, data),
    onSuccess: () => handleSuccess(dict.toasts.successUpdate),
    onError: (error: Error) =>
      handleError(dict.toasts.errorGeneric, error),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteInventoryItem(id),
    onSuccess: () => handleSuccess(dict.toasts.successDelete),
    onError: (error: Error) =>
      handleError(dict.toasts.errorGeneric, error),
  });

  const logFulfillmentMutation = useMutation({
    mutationFn: (data: {
      warehouseId: string;
      sku: string;
      quantity: number;
      type: "PICK" | "PACK";
    }) =>
      logWarehouseFulfillment(
        data.warehouseId,
        data.sku,
        data.quantity,
        data.type
      ),
    onSuccess: () => handleSuccess("Fulfillment logged successfully"),
    onError: (error: Error) => handleError("Failed to log fulfillment", error),
  });

  const adjustStockMutation = useMutation({
    mutationFn: (data: {
      id: string;
      delta: number;
      type?: import("@/app/lib/type/enums").MovementType;
      notes?: string;
    }) => adjustInventoryStock(data.id, data.delta, data.type, data.notes),
    onSuccess: () => handleSuccess("Stock adjusted successfully"),
    onError: (error: Error) => handleError("Failed to adjust stock", error),
  });

  return {
    createItem: createMutation,
    updateItem: updateMutation,
    deleteItem: deleteMutation,
    logFulfillment: logFulfillmentMutation,
    adjustStock: adjustStockMutation,
  };
}
