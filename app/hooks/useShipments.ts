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
import { Prisma, ShipmentStatus, ShipmentPriority } from "@prisma/client";

export const shipmentKeys = {
  all: ["shipments"] as const,
  lists: () => [...shipmentKeys.all, "list"] as const,
  details: (id: string) => [...shipmentKeys.all, "detail", id] as const,
  stats: () => [...shipmentKeys.all, "stats"] as const,
  history: () => [...shipmentKeys.all, "history"] as const,
  distribution: () => [...shipmentKeys.all, "distribution"] as const,
};

export function useShipments() {
  return useQuery<ShipmentWithRelations[]>({
    queryKey: shipmentKeys.lists(),
    queryFn: async () => {
      const result = await getShipments();
      return result as ShipmentWithRelations[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useShipmentDetails(id: string | null) {
  return useQuery<ShipmentWithRelations | null>({
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
  return useQuery<ShipmentStats>({
    queryKey: shipmentKeys.stats(),
    queryFn: async () => {
      const result = await getShipmentStats();
      return result as ShipmentStats;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useShipmentVolumeHistory() {
  return useQuery<ShipmentVolumeData[]>({
    queryKey: shipmentKeys.history(),
    queryFn: async () => {
      const result = await getShipmentVolumeHistory();
      return result as unknown as ShipmentVolumeData[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useShipmentStatusDistribution() {
  return useQuery<ShipmentStatusData[]>({
    queryKey: shipmentKeys.distribution(),
    queryFn: async () => {
      const result = await getShipmentStatusDistribution();
      return result as unknown as ShipmentStatusData[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useShipmentMutations() {
  const queryClient = useQueryClient();

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
      createShipment(
        data.customerId!,
        data.origin!,
        data.destination!,
        data.status!,
        data.itemsCount || 0,
        data.weightKg || 0,
        data.volumeM3 || 0,
        data.palletCount || 0,
        data.cargoType || "",
        data.destinationLat || 0,
        data.destinationLng || 0,
        data.originLat || 0,
        data.originLng || 0,
        data.trackingId || "",
        data.customerLocationId || "",
        (data.priority as unknown as ShipmentPriority) || ShipmentPriority.MEDIUM,
        data.type || "STANDARD",
        data.slaDeadline ? new Date(data.slaDeadline) : null,
        data.contactEmail || "",
        data.billingAccount || ""
      ),
    onSuccess: () => handleSuccess("Shipment created successfully"),
    onError: (error: Error) => handleError("Failed to create shipment", error),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ShipmentWithRelations> }) => {
      // Exclude relation fields from update data to satisfy Prisma types
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { company, history, customer, driver, route, ...updateData } = data;
      return updateShipment(id, updateData as Prisma.ShipmentUpdateInput);
    },
    onSuccess: () => handleSuccess("Shipment updated successfully"),
    onError: (error: Error) => handleError("Failed to update shipment", error),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteShipment(id),
    onSuccess: () => handleSuccess("Shipment deleted successfully"),
    onError: (error) => handleError("Failed to delete shipment", error),
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
    onSuccess: () => handleSuccess("Shipment status updated successfully"),
    onError: (error) => handleError("Failed to update shipment status", error),
  });

  return {
    createShipment: createMutation,
    updateShipment: updateMutation,
    deleteShipment: deleteMutation,
    updateShipmentStatus: updateStatusMutation,
  };
}
