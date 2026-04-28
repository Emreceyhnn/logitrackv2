import { useQuery } from "@tanstack/react-query";
import { reportsKeys } from "@/app/lib/query-keys/reports.keys";

async function fetchReportsDashboard() {
  const res = await fetch("/api/reports/dashboard", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`[useReportsData] fetch failed: ${res.status}`);
  }

  return res.json();
}

export function useReportsData() {
  return useQuery({
    queryKey: reportsKeys.dashboard(),
    queryFn: () => fetchReportsDashboard(),
    staleTime: 1000 * 60 * 15, // 15 minutes
    placeholderData: (previousData) => previousData,
  });
}
