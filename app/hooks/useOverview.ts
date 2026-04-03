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
import {
  ActionRequiredItems,
  OverviewStats,
  DailyOperationsData,
  FuelStat,
  WarehouseCapacityStat,
  LowStockItemStat,
  PicksAndPacksData,
  ShipmentDayStat,
  MapData,
} from "@/app/lib/type/overview";

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
  return useQuery<OverviewStats | null>({
    queryKey: overviewKeys.stats(),
    queryFn: () => getOverviewStats(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useActionRequired() {
  return useQuery<ActionRequiredItems[] | null>({
    queryKey: overviewKeys.actionRequired(),
    queryFn: () => getActionRequired(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useDailyOperations() {
  return useQuery<DailyOperationsData | null>({
    queryKey: overviewKeys.dailyOperations(),
    queryFn: () => getDailyOperations(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useFuelStats() {
  return useQuery<FuelStat[]>({
    queryKey: overviewKeys.fuelStats(),
    queryFn: () => getFuelStats(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useWarehouseCapacity() {
  return useQuery<WarehouseCapacityStat[]>({
    queryKey: overviewKeys.warehouseCapacity(),
    queryFn: () => getWarehouseCapacity(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useLowStockItems() {
  return useQuery<LowStockItemStat[]>({
    queryKey: overviewKeys.lowStockItems(),
    queryFn: () => getLowStockItems(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useShipmentStatusStats() {
  return useQuery<string[]>({
    queryKey: overviewKeys.shipmentStatus(),
    queryFn: () => getShipmentStatusStats(),
    staleTime: 1000 * 60 * 5,
  });
}

export function usePicksAndPacks() {
  return useQuery<PicksAndPacksData>({
    queryKey: overviewKeys.picksAndPacks(),
    queryFn: () => getPicksAndPacks(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useShipmentVolumeHistory() {
  return useQuery<ShipmentDayStat[]>({
    queryKey: overviewKeys.shipmentVolume(),
    queryFn: () => getShipmentVolumeHistory(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useMapData() {
  return useQuery<MapData[]>({
    queryKey: overviewKeys.mapData(),
    queryFn: () => getMapData(),
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
      stats: stats.data || null,
      alerts: actionRequired.data || [],
      dailyOps: dailyOps.data || null,
      fuelStats: fuelStats.data || [],
      warehouseCapacity: warehouseCapacity.data || [],
      lowStockItems: lowStockItems.data || [],
      shipmentStatus: shipmentStatus.data || [],
      picksAndPacks: picksAndPacks.data || null,
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
