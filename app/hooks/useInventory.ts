import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getInventory,
  getInventoryItemById,
  getLowStockItems,
  getInventoryMovements,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  logWarehouseFulfillment,
} from "@/app/lib/controllers/inventory";
import { toast } from "sonner";

export const inventoryKeys = {
  all: ["inventory"] as const,
  lists: (warehouseId?: string) => [...inventoryKeys.all, "list", { warehouseId }] as const,
  details: (id: string) => [...inventoryKeys.all, "detail", id] as const,
  lowStock: () => [...inventoryKeys.all, "lowStock"] as const,
  movements: (sku: string, warehouseId: string) => [...inventoryKeys.all, "movements", { sku, warehouseId }] as const,
};

export function useInventory(warehouseId?: string) {
  return useQuery({
    queryKey: inventoryKeys.lists(warehouseId),
    queryFn: () => getInventory(warehouseId) as any,
    staleTime: 1000 * 60 * 5,
  });
}

export function useInventoryItem(id: string | null) {
  return useQuery({
    queryKey: inventoryKeys.details(id || ""),
    queryFn: () => getInventoryItemById(id!) as any,
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useLowStockItems() {
  return useQuery({
    queryKey: inventoryKeys.lowStock(),
    queryFn: () => getLowStockItems() as any,
    staleTime: 1000 * 60 * 5,
  });
}

export function useInventoryMovements(sku: string | null, warehouseId: string | null) {
  return useQuery({
    queryKey: inventoryKeys.movements(sku || "", warehouseId || ""),
    queryFn: () => getInventoryMovements(sku!, warehouseId!) as any,
    enabled: !!sku && !!warehouseId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useInventoryMutations() {
  const queryClient = useQueryClient();

  const handleSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    toast.success(message);
  };

  const handleError = (message: string, error: any) => {
    console.error(message, error);
    toast.error(error?.message || message);
  };

  const createMutation = useMutation({
    mutationFn: (data: any) =>
      createInventoryItem(
        data.warehouseId,
        data.sku,
        data.name,
        data.quantity,
        data.minStock,
        data.weightKg,
        data.volumeM3,
        data.palletCount,
        data.cargoType
      ),
    onSuccess: () => handleSuccess("Item added to inventory successfully"),
    onError: (error) => handleError("Failed to add inventory item", error),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateInventoryItem(id, data),
    onSuccess: () => handleSuccess("Inventory item updated successfully"),
    onError: (error) => handleError("Failed to update inventory item", error),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteInventoryItem(id),
    onSuccess: () => handleSuccess("Inventory item deleted successfully"),
    onError: (error) => handleError("Failed to delete inventory item", error),
  });

  const logFulfillmentMutation = useMutation({
    mutationFn: (data: { warehouseId: string; sku: string; quantity: number; type: "PICK" | "PACK" }) =>
      logWarehouseFulfillment(data.warehouseId, data.sku, data.quantity, data.type),
    onSuccess: () => handleSuccess("Fulfillment logged successfully"),
    onError: (error) => handleError("Failed to log fulfillment", error),
  });

  return {
    createItem: createMutation,
    updateItem: updateMutation,
    deleteItem: deleteMutation,
    logFulfillment: logFulfillmentMutation,
  };
}
