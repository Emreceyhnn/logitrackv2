import { useQuery } from "@tanstack/react-query";
import { getAnalyticsDashboardData } from "@/app/lib/controllers/analytics";
import { AnalyticsPageState } from "@/app/lib/type/analytics";

export const analyticsKeys = {
  all: ["analytics"] as const,
  dashboard: () => [...analyticsKeys.all, "dashboard"] as const,
};

export function useAnalyticsData() {
  return useQuery<AnalyticsPageState | null>({
    queryKey: analyticsKeys.dashboard(),
    queryFn: async () => {
      const result = await getAnalyticsDashboardData();
      return result as AnalyticsPageState | null;
    },
    staleTime: 1000 * 60 * 10, // Analytics can be more stale
  });
}
