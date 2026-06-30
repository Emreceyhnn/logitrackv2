import { useQuery } from "@tanstack/react-query";
import { warehouseWorkerKeys } from "@/app/lib/query-keys/warehouseWorker.keys";
import type { WarehouseWorkerDashboard } from "@/app/lib/type/warehouseWorker";

async function fetchWarehouseWorkerDashboard(
  warehouseId?: string
): Promise<WarehouseWorkerDashboard> {
  const qs = warehouseId ? `?warehouseId=${encodeURIComponent(warehouseId)}` : "";
  const res = await fetch(`/api/warehouse-worker/dashboard${qs}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`[useWarehouseWorker] fetch failed: ${res.status}`);
  }

  return res.json();
}

export function useWarehouseWorker(warehouseId?: string) {
  return useQuery<WarehouseWorkerDashboard>({
    queryKey: warehouseWorkerKeys.dashboard(warehouseId),
    queryFn: () => fetchWarehouseWorkerDashboard(warehouseId),
    staleTime: 1000 * 30,
    placeholderData: (previousData) => previousData,
  });
}
