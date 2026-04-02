import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRoutes,
  getRouteStats,
  getRouteEfficiencyStats,
  getActiveRoutesLocations,
  deleteRoute,
} from "@/app/lib/controllers/routes";
import { toast } from "sonner";

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
  return useQuery({
    queryKey: routeKeys.lists(page, pageSize, status),
    queryFn: () => getRoutes(page + 1, pageSize, status) as any,
    staleTime: 1000 * 60 * 5,
  });
}

export function useRouteStats() {
  return useQuery({
    queryKey: routeKeys.stats(),
    queryFn: () => getRouteStats() as any,
    staleTime: 1000 * 60 * 5,
  });
}

export function useRouteEfficiency() {
  return useQuery({
    queryKey: routeKeys.efficiency(),
    queryFn: () => getRouteEfficiencyStats() as any,
    staleTime: 1000 * 60 * 5,
  });
}

export function useRouteLocations() {
  return useQuery({
    queryKey: routeKeys.locations(),
    queryFn: () => getActiveRoutesLocations() as any,
    staleTime: 1000 * 30, // Locations update faster
  });
}

export function useRouteMutations() {
  const queryClient = useQueryClient();

  const handleSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: routeKeys.all });
    toast.success(message);
  };

  const handleError = (message: string, error: any) => {
    console.error(message, error);
    toast.error(error?.message || message);
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
