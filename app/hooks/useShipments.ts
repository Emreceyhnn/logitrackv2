import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getShipments,
  getShipmentById,
  getShipmentStats,
  getShipmentVolumeHistory,
  getShipmentStatusDistribution,
  createShipment,
  updateShipment,
  deleteShipment,
  updateShipmentStatus,
} from "@/app/lib/controllers/shipments";
import { toast } from "sonner";
import {
  ShipmentWithRelations,
  ShipmentStats,
  ShipmentVolumeData,
  ShipmentStatusData,
} from "@/app/lib/type/shipment";
import { ShipmentStatus, ShipmentPriority } from "@/app/lib/type/enums";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

import { shipmentKeys } from "@/app/lib/query-keys/shipment.keys";

export function useShipments() {
  return useQuery({
    queryKey: shipmentKeys.lists(),
    queryFn: async () => {
      const result = await getShipments();
      return result as ShipmentWithRelations[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useShipmentDetails(id: string | null) {
  return useQuery({
    queryKey: shipmentKeys.details(id || ""),
    queryFn: async () => {
      if (!id) return null;
      const result = await getShipmentById(id);
      return result as ShipmentWithRelations | null;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useShipmentStats() {
  return useQuery({
    queryKey: shipmentKeys.stats(),
    queryFn: async () => {
      const result = await getShipmentStats();
      return result as ShipmentStats;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useShipmentVolumeHistory() {
  return useQuery({
    queryKey: shipmentKeys.history(),
    queryFn: async () => {
      const result = await getShipmentVolumeHistory();
      return result as unknown as ShipmentVolumeData[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useShipmentStatusDistribution() {
  return useQuery({
    queryKey: shipmentKeys.distribution(),
    queryFn: async () => {
      const result = await getShipmentStatusDistribution();
      return result as unknown as ShipmentStatusData[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

async function fetchShipmentDashboard(
  page: number,
  pageSize: number,
  status?: ShipmentStatus,
  search?: string
): Promise<{
  shipments: ShipmentWithRelations[];
  totalCount: number;
  stats: ShipmentStats;
  volumeData: ShipmentVolumeData[];
  statusData: ShipmentStatusData[];
}> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));
  if (status && (status as string) !== "ALL") params.set("status", status);
  if (search) params.set("search", search);

  const res = await fetch(`/api/shipments/dashboard?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`[useShipmentsWithDashboard] fetch failed: ${res.status}`);
  }

  return res.json();
}

export function useShipmentsWithDashboard(
  page: number = 1,
  pageSize: number = 10,
  status?: ShipmentStatus,
  search?: string
) {
  return useQuery({
    queryKey: shipmentKeys.dashboardWithFilters(page, pageSize, status, search),
    queryFn: () => fetchShipmentDashboard(page + 1, pageSize, status, search),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
}


export function useShipmentMutations() {
  const queryClient = useQueryClient();
  const dict = useDictionary();

  const handleSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: shipmentKeys.all });
    toast.success(message);
  };

  const handleError = (message: string, error: Error | unknown) => {
    console.error(message, error);
    toast.error((error as Error)?.message || message);
  };

  const createMutation = useMutation({
    mutationFn: (data: Partial<ShipmentWithRelations> & { customerId: string; origin: string; destination: string; status: ShipmentStatus }) =>
      createShipment({
        customerId: data.customerId!,
        origin: data.origin!,
        destination: data.destination!,
        status: data.status!,
        itemsCount: data.itemsCount || 0,
        weightKg: data.weightKg || 0,
        volumeM3: data.volumeM3 || 0,
        palletCount: data.palletCount || 0,
        cargoType: data.cargoType || "",
        destinationLat: data.destinationLat || undefined,
        destinationLng: data.destinationLng || undefined,
        originLat: data.originLat || undefined,
        originLng: data.originLng || undefined,
        trackingId: data.trackingId || "",
        customerLocationId: data.customerLocationId || "",
        priority: (data.priority as unknown as ShipmentPriority) || ShipmentPriority.MEDIUM,
        type: data.type || "STANDARD",
        slaDeadline: data.slaDeadline ? new Date(data.slaDeadline) : null,
        contactEmail: data.contactEmail || "",
        billingAccount: data.billingAccount || "",
        inventoryItems: (data as any).inventoryItems || [],
      }),
    onSuccess: () => handleSuccess(dict.toasts.successAdd),
    onError: (error: Error) => handleError(dict.toasts.errorGeneric, error),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ShipmentWithRelations> }) => {
      // Exclude relation fields from update data to satisfy Prisma types
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { company, history, customer, driver, route, ...updateData } = data;
      // Using 'any' cast to avoid importing @prisma/client into the UI layer.
      // updateShipment server action validates the data type on the backend.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return updateShipment(id, updateData as any);
    },
    onSuccess: () => handleSuccess(dict.toasts.successUpdate),
    onError: (error: Error) => handleError(dict.toasts.errorGeneric, error),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteShipment(id),
    onSuccess: () => handleSuccess(dict.toasts.successDelete),
    onError: (error) => handleError(dict.toasts.errorGeneric, error),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
      location,
      description,
    }: {
      id: string;
      status: ShipmentStatus;
      location?: string;
      description?: string;
    }) => updateShipmentStatus(id, status, location, description),
    onSuccess: () => handleSuccess(dict.toasts.successUpdate),
    onError: (error) => handleError(dict.toasts.errorGeneric, error),
  });

  return {
    createShipment: createMutation,
    updateShipment: updateMutation,
    deleteShipment: deleteMutation,
    updateShipmentStatus: updateStatusMutation,
  };
}
