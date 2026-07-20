import { useQuery } from "@tanstack/react-query";
import type { WarehouseWorkerDashboard } from "@/app/lib/type/warehouseWorker";

// Demo-local mirror of useWarehouseWorker — reads the public mock endpoint.
// The warehouseId arg is accepted for signature parity with the real hook but
// is not sent anywhere (the mock is a single fixed warehouse dataset).
async function fetchDemoWarehouseWorkerDashboard(): Promise<WarehouseWorkerDashboard> {
  const res = await fetch("/api/demo/warehouse-worker/dashboard", {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`[useDemoWarehouseWorker] fetch failed: ${res.status}`);
  }

  return res.json();
}

export function useDemoWarehouseWorker(warehouseId?: string) {
  return useQuery<WarehouseWorkerDashboard>({
    queryKey: ["demo", "warehouse-worker", "dashboard", warehouseId ?? "default"],
    queryFn: () => fetchDemoWarehouseWorkerDashboard(),
    staleTime: 1000 * 30,
    placeholderData: (previousData) => previousData,
  });
}
