import { useQuery } from "@tanstack/react-query";
import {
  getOverviewStats,
  getActionRequired,
  getDailyOperations,
  getFuelStats,
  getWarehouseCapacity,
  getLowStockItems,
  getShipmentStatusStats,
  getPicksAndPacks,
  getShipmentVolumeHistory,
  getMapData,
} from "@/app/lib/controllers/analytics";

export const overviewKeys = {
  all: ["overview"] as const,
  stats: () => [...overviewKeys.all, "stats"] as const,
  actionRequired: () => [...overviewKeys.all, "actionRequired"] as const,
  dailyOperations: () => [...overviewKeys.all, "dailyOperations"] as const,
  fuelStats: () => [...overviewKeys.all, "fuelStats"] as const,
  warehouseCapacity: () => [...overviewKeys.all, "warehouseCapacity"] as const,
  lowStockItems: () => [...overviewKeys.all, "lowStockItems"] as const,
  shipmentStatus: () => [...overviewKeys.all, "shipmentStatus"] as const,
  picksAndPacks: () => [...overviewKeys.all, "picksAndPacks"] as const,
  shipmentVolume: () => [...overviewKeys.all, "shipmentVolume"] as const,
  mapData: () => [...overviewKeys.all, "mapData"] as const,
};

export function useOverviewStats() {
  return useQuery({
    queryKey: overviewKeys.stats(),
    queryFn: () => getOverviewStats() as any,
    staleTime: 1000 * 60 * 5,
  });
}

export function useActionRequired() {
  return useQuery({
    queryKey: overviewKeys.actionRequired(),
    queryFn: () => getActionRequired() as any,
    staleTime: 1000 * 60 * 5,
  });
}

export function useDailyOperations() {
  return useQuery({
    queryKey: overviewKeys.dailyOperations(),
    queryFn: () => getDailyOperations() as any,
    staleTime: 1000 * 60 * 5,
  });
}

export function useFuelStats() {
  return useQuery({
    queryKey: overviewKeys.fuelStats(),
    queryFn: () => getFuelStats() as any,
    staleTime: 1000 * 60 * 5,
  });
}

export function useWarehouseCapacity() {
  return useQuery({
    queryKey: overviewKeys.warehouseCapacity(),
    queryFn: () => getWarehouseCapacity() as any,
    staleTime: 1000 * 60 * 5,
  });
}

export function useLowStockItems() {
  return useQuery({
    queryKey: overviewKeys.lowStockItems(),
    queryFn: () => getLowStockItems() as any,
    staleTime: 1000 * 60 * 5,
  });
}

export function useShipmentStatusStats() {
  return useQuery({
    queryKey: overviewKeys.shipmentStatus(),
    queryFn: () => getShipmentStatusStats() as any,
    staleTime: 1000 * 60 * 5,
  });
}

export function usePicksAndPacks() {
  return useQuery({
    queryKey: overviewKeys.picksAndPacks(),
    queryFn: () => getPicksAndPacks() as any,
    staleTime: 1000 * 60 * 5,
  });
}

export function useShipmentVolumeHistory() {
  return useQuery({
    queryKey: overviewKeys.shipmentVolume(),
    queryFn: () => getShipmentVolumeHistory() as any,
    staleTime: 1000 * 60 * 5,
  });
}

export function useMapData() {
  return useQuery({
    queryKey: overviewKeys.mapData(),
    queryFn: () => getMapData() as any,
    staleTime: 1000 * 60 * 5,
  });
}

export function useOverviewData() {
  const stats = useOverviewStats();
  const actionRequired = useActionRequired();
  const dailyOps = useDailyOperations();
  const fuelStats = useFuelStats();
  const warehouseCapacity = useWarehouseCapacity();
  const lowStockItems = useLowStockItems();
  const shipmentStatus = useShipmentStatusStats();
  const picksAndPacks = usePicksAndPacks();
  const shipmentVolume = useShipmentVolumeHistory();
  const mapData = useMapData();

  const isLoading = 
    stats.isLoading || 
    actionRequired.isLoading || 
    dailyOps.isLoading || 
    fuelStats.isLoading || 
    warehouseCapacity.isLoading || 
    lowStockItems.isLoading || 
    shipmentStatus.isLoading || 
    picksAndPacks.isLoading || 
    shipmentVolume.isLoading || 
    mapData.isLoading;

  const isError = 
    stats.isError || 
    actionRequired.isError || 
    dailyOps.isError || 
    fuelStats.isError || 
    warehouseCapacity.isError || 
    lowStockItems.isError || 
    shipmentStatus.isError || 
    picksAndPacks.isError || 
    shipmentVolume.isError || 
    mapData.isError;

  return {
    data: {
      stats: stats.data,
      alerts: actionRequired.data || [],
      dailyOps: dailyOps.data,
      fuelStats: fuelStats.data || [],
      warehouseCapacity: warehouseCapacity.data || [],
      lowStockItems: lowStockItems.data || [],
      shipmentStatus: shipmentStatus.data || [],
      picksAndPacks: picksAndPacks.data,
      shipmentVolume: shipmentVolume.data || [],
      mapData: mapData.data || [],
    },
    isLoading,
    isError,
    refetch: async () => {
      await Promise.all([
        stats.refetch(),
        actionRequired.refetch(),
        dailyOps.refetch(),
        fuelStats.refetch(),
        warehouseCapacity.refetch(),
        lowStockItems.refetch(),
        shipmentStatus.refetch(),
        picksAndPacks.refetch(),
        shipmentVolume.refetch(),
        mapData.refetch(),
      ]);
    }
  };
}
