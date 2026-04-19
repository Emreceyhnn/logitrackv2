import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRoutes,
  getRouteStats,
  getRouteEfficiencyStats,
  getActiveRoutesLocations,
  getRoutesWithDashboardData,
  deleteRoute,
} from "@/app/lib/controllers/routes";
import { toast } from "sonner";

import {
  RouteWithRelations,
  RouteStats,
  RouteEfficiencyStats,
  MapRouteData,
} from "@/app/lib/type/routes";

export const routeKeys = {
  all: ["routes"] as const,
  lists: (page: number, pageSize: number, status?: string) => 
    [...routeKeys.all, "list", { page, pageSize, status }] as const,
  stats: () => [...routeKeys.all, "stats"] as const,
  efficiency: () => [...routeKeys.all, "efficiency"] as const,
  locations: () => [...routeKeys.all, "locations"] as const,
  details: (id: string) => [...routeKeys.all, "detail", id] as const,
  dashboard: () => [...routeKeys.all, "dashboard"] as const,
  dashboardWithFilters: (page: number, pageSize: number, status?: string) =>
    [...routeKeys.dashboard(), { page, pageSize, status }] as const,
};

export function useRoutes(page: number, pageSize: number, status?: string) {
  return useQuery({
    queryKey: routeKeys.lists(page, pageSize, status),
    queryFn: async (): Promise<{ routes: RouteWithRelations[]; totalCount: number }> => {
      const res = await getRoutes(page + 1, pageSize, status);
      return res as { routes: RouteWithRelations[]; totalCount: number };
    },
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
    staleTime: 1000 * 30, // Locations update faster
  });
}

export function useRoutesWithDashboard(
  page: number,
  pageSize: number,
  status?: string
) {
  return useQuery({
    queryKey: routeKeys.dashboardWithFilters(page, pageSize, status),
    queryFn: () => getRoutesWithDashboardData(page + 1, pageSize, status),
    staleTime: 1000 * 60 * 5,
  });
}


export function useRouteMutations() {
  const queryClient = useQueryClient();

  const handleSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: routeKeys.all });
    toast.success(message);
  };

  const handleError = (message: string, error: Error | unknown) => {
    console.error(message, error);
    toast.error((error as Error)?.message || message);
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
