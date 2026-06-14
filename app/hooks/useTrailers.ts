"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  getTrailerById,
  createTrailer,
  updateTrailer,
  deleteTrailer,
  assignTrailerToVehicle,
} from "@/app/lib/controllers/trailer";
import { TrailerFilters } from "@/app/lib/type/trailer";
import type { Trailer } from "@/app/lib/type/enums";
import { trailerKeys } from "@/app/lib/query-keys/trailer.keys";
import { vehicleKeys } from "@/app/lib/query-keys/vehicle.keys";
import { toast } from "sonner";

async function fetchTrailers(filters: TrailerFilters): Promise<{
  trailers: import("@/app/lib/type/trailer").TrailerWithRelations[];
  kpis: {
    total: number;
    available: number;
    inUse: number;
    maintenance: number;
    issues: number;
  };
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}> {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.search) params.set("search", filters.search);
  if (filters.status?.length) filters.status.forEach((s) => params.append("status", s));
  if (filters.type?.length) filters.type.forEach((t) => params.append("type", t));
  if (filters.isColdChain !== undefined) params.set("isColdChain", String(filters.isColdChain));

  const res = await fetch(`/api/trailers?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`[useTrailers] fetch failed: ${res.status}`);
  }

  return res.json();
}

export function useTrailers(filters: TrailerFilters = {}) {
  return useQuery({
    queryKey: trailerKeys.list(filters),
    queryFn: () => fetchTrailers(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}

export function useTrailer(id: string) {
  return useQuery({
    queryKey: trailerKeys.detail(id),
    queryFn: () => getTrailerById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useTrailerMutations() {
  const queryClient = useQueryClient();

  const handleSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: trailerKeys.all });
    queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
    toast.success(message);
  };

  const handleError = (message: string, error: unknown) => {
    console.error(message, error);
    toast.error(error instanceof Error ? error.message : message);
  };

  const createMut = useMutation({
    mutationFn: (data: Partial<Trailer>) => createTrailer(data),
    onSuccess: () => handleSuccess("Trailer created successfully"),
    onError: (error: Error) => handleError("Failed to create trailer", error),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Trailer> }) => updateTrailer(id, data),
    onSuccess: () => handleSuccess("Trailer updated successfully"),
    onError: (error: Error) => handleError("Failed to update trailer", error),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteTrailer(id),
    onSuccess: () => handleSuccess("Trailer deleted successfully"),
    onError: (error: Error) => handleError("Failed to delete trailer", error),
  });

  const assignMut = useMutation({
    mutationFn: ({ trailerId, vehicleId }: { trailerId: string; vehicleId: string | null }) =>
      assignTrailerToVehicle(trailerId, vehicleId),
    onSuccess: () => handleSuccess("Trailer assignment updated successfully"),
    onError: (error: Error) => handleError("Failed to update trailer assignment", error),
  });

  return {
    createTrailer: createMut,
    updateTrailer: updateMut,
    deleteTrailer: deleteMut,
    assignTrailer: assignMut,
  };
}
