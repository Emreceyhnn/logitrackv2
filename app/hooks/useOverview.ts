import { useQuery } from "@tanstack/react-query";
import { getOverviewDashboardData } from "@/app/lib/controllers/overview";

export const overviewKeys = {
  all: ["overview"] as const,
  dashboard: () => [...overviewKeys.all, "dashboard"] as const,
};

/**
 * Unified hook for fetching all Overview Dashboard data in a single request.
 * This optimizes performance by consolidating 10 separate queries into one.
 */
export function useOverviewData() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: overviewKeys.dashboard(),
    queryFn: () => getOverviewDashboardData(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    data: {
      stats: data?.stats ?? null,
      alerts: data?.alerts ?? [],
      dailyOps: data?.dailyOps ?? null,
      fuelStats: data?.fuelStats ?? [],
      warehouseCapacity: data?.warehouseCapacity ?? [],
      lowStockItems: data?.lowStockItems ?? [],
      shipmentStatus: data?.shipmentStatus ?? [],
      picksAndPacks: data?.picksAndPacks ?? null,
      shipmentVolume: data?.shipmentVolume ?? [],
      mapData: data?.mapData ?? [],
    },
    isLoading,
    isFetching,
    isError,
    refetch,
  };
}
