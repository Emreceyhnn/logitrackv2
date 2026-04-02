import { useQuery } from "@tanstack/react-query";
import { getAnalyticsDashboardData } from "@/app/lib/controllers/analytics";

export const analyticsKeys = {
  all: ["analytics"] as const,
  dashboard: () => [...analyticsKeys.all, "dashboard"] as const,
};

export function useAnalyticsData() {
  return useQuery({
    queryKey: analyticsKeys.dashboard(),
    queryFn: () => getAnalyticsDashboardData() as any,
    staleTime: 1000 * 60 * 10, // Analytics can be more stale
  });
}
