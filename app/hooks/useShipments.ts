"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { exclude } from "@/app/lib/utils/exclude";
import {
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
import { ShipmentStatus, ShipmentPriority, ShipmentServiceType } from "@/app/lib/type/enums";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { shipmentKeys } from "@/app/lib/query-keys/shipment.keys";
import type { InventoryShipmentItem } from "@/app/lib/type/add-shipment";
import { logger } from "@/app/lib/logger";


async function fetchShipments(filters?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: ShipmentStatus;
  unassigned?: boolean;
}): Promise<ShipmentWithRelations[] | { shipments: ShipmentWithRelations[]; totalCount: number }> {
  const params = new URLSearchParams();
  if (filters?.page) params.set("page", String(filters.page));
  if (filters?.limit) params.set("limit", String(filters.limit));
  if (filters?.search) params.set("search", filters.search);
  if (filters?.status) params.set("status", filters.status);
  if (filters?.unassigned !== undefined) params.set("unassigned", String(filters.unassigned));
  params.set("_t", Date.now().toString());

  const res = await fetch(`/api/shipments?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`[useShipments] fetch failed: ${res.status}`);
  }

  return res.json();
}

export function useShipments(filters?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: ShipmentStatus;
  unassigned?: boolean;
}) {
  return useQuery({
    queryKey: shipmentKeys.lists(),
    queryFn: () => fetchShipments(filters),
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
      const result: ShipmentVolumeData[] = await getShipmentVolumeHistory();
      return result;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useShipmentStatusDistribution() {
  return useQuery({
    queryKey: shipmentKeys.distribution(),
    queryFn: async () => {
      const result: ShipmentStatusData[] = await getShipmentStatusDistribution();
      return result;
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
  statsTrends?: {
    total?: { value: number; isUp: boolean };
    active?: { value: number; isUp: boolean };
    delayed?: { value: number; isUp: boolean };
    inTransit?: { value: number; isUp: boolean };
  };
  volumeHistory: ShipmentVolumeData[];
  statusDistribution: ShipmentStatusData[];
}> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));
  if (status && (status as string) !== "ALL") params.set("status", status);
  if (search) params.set("search", search);
  params.set("_t", Date.now().toString());

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
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: shipmentKeys.dashboardWithFilters(page, pageSize, status, search),
    queryFn: () => fetchShipmentDashboard(page, pageSize, status, search),
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
        queryKey: shipmentKeys.dashboardWithFilters(nextPage, pageSize, status, search),
        queryFn: () => fetchShipmentDashboard(nextPage, pageSize, status, search),
        staleTime: 1000 * 60 * 5,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient, query.data, page, pageSize]);

  return query;
}


export function useShipmentMutations() {
  const queryClient = useQueryClient();
  const dict = useDictionary();

  const handleSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: shipmentKeys.all });
    toast.success(message);
  };

  const handleError = (message: string, error: unknown) => {
    logger.error(message, error);
    toast.error(error instanceof Error ? error.message : message);
  };

  const createMutation = useMutation({
    mutationFn: (data: Partial<ShipmentWithRelations> & { customerId: string; origin: string; destination: string; status: ShipmentStatus; inventoryItems?: InventoryShipmentItem[] }) =>
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
        priority: data.priority || ShipmentPriority.MEDIUM,
        type: data.type || ShipmentServiceType.STANDARD_FREIGHT,
        slaDeadline: data.slaDeadline ? new Date(data.slaDeadline) : null,
        contactEmail: data.contactEmail || "",
        billingAccount: data.billingAccount || "",
        inventoryItems: data.inventoryItems || [],
      }),
    onSuccess: () => handleSuccess(dict.toasts.successAdd),
    onError: (error: Error) => handleError(dict.toasts.errorGeneric, error),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ShipmentWithRelations> }) => {
      const updateData: Parameters<typeof updateShipment>[1] = exclude(data, [
        "company",
        "history",
        "customer",
        "driver",
        "route",
        "items",
        "stops",
        "companyId",
      ]) as Parameters<typeof updateShipment>[1];
      return updateShipment(id, updateData);
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
