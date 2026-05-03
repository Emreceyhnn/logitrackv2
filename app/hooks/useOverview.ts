import { overviewKeys } from "@/app/lib/query-keys/overview.keys";

import { useQuery } from "@tanstack/react-query";

/**
 * Unified hook for fetching all Overview Dashboard data in a single request.
 * This optimizes performance by consolidating 10 separate queries into one.
 */
async function fetchOverviewDashboard() {
  const res = await fetch("/api/overview/dashboard", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`[useOverviewData] fetch failed: ${res.status}`);
  }

  return res.json();
}

/**
 * Unified hook for fetching all Overview Dashboard data in a single request.
 * This optimizes performance by consolidating 10 separate queries into one.
 */
export function useOverviewData() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: overviewKeys.dashboard(),
    queryFn: () => fetchOverviewDashboard(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (previousData) => previousData,
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
