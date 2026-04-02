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

export const shipmentKeys = {
  all: ["shipments"] as const,
  lists: () => [...shipmentKeys.all, "list"] as const,
  details: (id: string) => [...shipmentKeys.all, "detail", id] as const,
  stats: () => [...shipmentKeys.all, "stats"] as const,
  history: () => [...shipmentKeys.all, "history"] as const,
  distribution: () => [...shipmentKeys.all, "distribution"] as const,
};

export function useShipments() {
  return useQuery({
    queryKey: shipmentKeys.lists(),
    queryFn: () => getShipments() as any,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useShipmentDetails(id: string | null) {
  return useQuery({
    queryKey: shipmentKeys.details(id || ""),
    queryFn: () => getShipmentById(id!) as any,
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useShipmentStats() {
  return useQuery({
    queryKey: shipmentKeys.stats(),
    queryFn: () => getShipmentStats() as any,
    staleTime: 1000 * 60 * 5,
  });
}

export function useShipmentVolumeHistory() {
  return useQuery({
    queryKey: shipmentKeys.history(),
    queryFn: () => getShipmentVolumeHistory() as any,
    staleTime: 1000 * 60 * 5,
  });
}

export function useShipmentStatusDistribution() {
  return useQuery({
    queryKey: shipmentKeys.distribution(),
    queryFn: () => getShipmentStatusDistribution() as any,
    staleTime: 1000 * 60 * 5,
  });
}

export function useShipmentMutations() {
  const queryClient = useQueryClient();

  const handleSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: shipmentKeys.all });
    toast.success(message);
  };

  const handleError = (message: string, error: any) => {
    console.error(message, error);
    toast.error(error?.message || message);
  };

  const createMutation = useMutation({
    mutationFn: (data: any) =>
      createShipment(
        data.customerId,
        data.origin,
        data.destination,
        data.status,
        data.itemsCount,
        data.weightKg,
        data.volumeM3,
        data.palletCount,
        data.cargoType,
        data.destinationLat,
        data.destinationLng,
        data.originLat,
        data.originLng,
        data.trackingId,
        data.customerLocationId,
        data.priority,
        data.type,
        data.slaDeadline,
        data.contactEmail,
        data.billingAccount
      ),
    onSuccess: () => handleSuccess("Shipment created successfully"),
    onError: (error) => handleError("Failed to create shipment", error),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateShipment(id, data),
    onSuccess: () => handleSuccess("Shipment updated successfully"),
    onError: (error) => handleError("Failed to update shipment", error),
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
      status: string;
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
