import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRoutes,
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

export const routeKeys = {
  all: ["routes"] as const,
  lists: (page: number, pageSize: number, status?: string) => 
    [...routeKeys.all, "list", { page, pageSize, status }] as const,
  stats: () => [...routeKeys.all, "stats"] as const,
  efficiency: () => [...routeKeys.all, "efficiency"] as const,
  locations: () => [...routeKeys.all, "locations"] as const,
  details: (id: string) => [...routeKeys.all, "detail", id] as const,
};

export function useRoutes(page: number, pageSize: number, status?: string) {
  return useQuery<{ routes: RouteWithRelations[]; totalCount: number }>({
    queryKey: routeKeys.lists(page, pageSize, status),
    queryFn: () => getRoutes(page + 1, pageSize, status),
    staleTime: 1000 * 60 * 5,
  });
}

export function useRouteStats() {
  return useQuery<RouteStats | null>({
    queryKey: routeKeys.stats(),
    queryFn: () => getRouteStats(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useRouteEfficiency() {
  return useQuery<RouteEfficiencyStats | null>({
    queryKey: routeKeys.efficiency(),
    queryFn: () => getRouteEfficiencyStats(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useRouteLocations() {
  return useQuery<MapRouteData[]>({
    queryKey: routeKeys.locations(),
    queryFn: () => getActiveRoutesLocations(),
    staleTime: 1000 * 30, // Locations update faster
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
