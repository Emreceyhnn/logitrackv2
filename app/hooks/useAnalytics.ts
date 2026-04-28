import { useQuery } from "@tanstack/react-query";
import { analyticsKeys } from "@/app/lib/query-keys/analytics.keys";

async function fetchAnalyticsDashboard() {
  const res = await fetch("/api/analytics/dashboard", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`[useAnalyticsData] fetch failed: ${res.status}`);
  }

  return res.json();
}

export function useAnalyticsData() {
  return useQuery({
    queryKey: analyticsKeys.dashboard(),
    queryFn: () => fetchAnalyticsDashboard(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    placeholderData: (previousData) => previousData,
  });
}
