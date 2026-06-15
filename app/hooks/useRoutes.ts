import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  getRouteStats,
  getRouteEfficiencyStats,
  getActiveRoutesLocations,
  deleteRoute,
} from "@/app/lib/controllers/routes";
import { toast } from "sonner";

import {
  RouteWithRelations,
  RouteStats,
  RouteEfficiencyStats,
  MapRouteData,
} from "@/app/lib/type/routes";

import { routeKeys } from "@/app/lib/query-keys/route.keys";

async function fetchRoutes(
  page: number,
  pageSize: number,
  status?: string
): Promise<{
  routes: RouteWithRelations[];
  totalCount: number;
}> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));
  if (status) params.set("status", status);

  const res = await fetch(`/api/routes?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`[useRoutes] fetch failed: ${res.status}`);
  }

  return res.json();
}

export function useRoutes(page: number, pageSize: number, status?: string) {
  return useQuery({
    queryKey: routeKeys.lists(page, pageSize, status),
    queryFn: () => fetchRoutes(page, pageSize, status),
    staleTime: 1000 * 60 * 5,
  });
}

export function useRouteStats() {
  return useQuery({
    queryKey: routeKeys.stats(),
    queryFn: async (): Promise<RouteStats | null> => {
      const res = await getRouteStats();
      return res as RouteStats | null;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useRouteEfficiency() {
  return useQuery({
    queryKey: routeKeys.efficiency(),
    queryFn: async (): Promise<RouteEfficiencyStats | null> => {
      const res = await getRouteEfficiencyStats();
      return res as RouteEfficiencyStats | null;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useRouteLocations() {
  return useQuery({
    queryKey: routeKeys.locations(),
    queryFn: async (): Promise<MapRouteData[]> => {
      const res = await getActiveRoutesLocations();
      return res as MapRouteData[];
    },
    staleTime: 1000 * 30,
  });
}

async function fetchRouteDashboard(
  page: number,
  pageSize: number,
  status?: string | string[]
) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));
  if (Array.isArray(status)) {
    status.forEach((s) => params.append("status", s));
  } else if (status) {
    params.set("status", status);
  }
  params.set("_t", Date.now().toString());

  const res = await fetch(`/api/routes/dashboard?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`[useRoutes] fetch dashboard failed: ${res.status}`);
  }

  return res.json();
}

export function useRoutesWithDashboard(
  page: number,
  pageSize: number,
  status?: string | string[]
) {
  return useQuery({
    queryKey: routeKeys.dashboardWithFilters(page, pageSize, status),
    queryFn: () => fetchRouteDashboard(page, pageSize, status),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}

export function useRouteMutations() {
  const queryClient = useQueryClient();

  const handleSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: routeKeys.all });
    toast.success(message);
  };

  const handleError = (message: string, error: unknown) => {
    console.error(message, error);
    toast.error(error instanceof Error ? error.message : message);
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRoute(id),
    onSuccess: () => handleSuccess("Route deleted successfully"),
    onError: (error) => handleError("Failed to delete route", error),
  });

  return {
    deleteRoute: deleteMutation,
  };
}
