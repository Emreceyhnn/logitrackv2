"use client";

import { useEffect } from "react";
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
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { logger } from "@/app/lib/logger";


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
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: trailerKeys.list(filters),
    queryFn: () => fetchTrailers(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    const total = query.data?.meta?.total;
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    if (!total) return;
    const totalPages = Math.ceil(total / limit);
    const pagesToPrefetch = Math.max(1, Math.ceil(30 / limit));
    for (let i = 1; i <= pagesToPrefetch; i++) {
      const nextPage = page + i;
      if (nextPage > totalPages) break;
      const nextFilters = { ...filters, page: nextPage };
      queryClient.prefetchQuery({
        queryKey: trailerKeys.list(nextFilters),
        queryFn: () => fetchTrailers(nextFilters),
        staleTime: 1000 * 60 * 5,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient, query.data, filters.page, filters.limit]);

  return query;
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
  const dict = useDictionary();
  const queryClient = useQueryClient();

  const handleSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: trailerKeys.all });
    queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
    toast.success(message);
  };

  const handleError = (message: string, error: unknown) => {
    logger.error(message, error);
    toast.error(error instanceof Error ? error.message : message);
  };

  const createMut = useMutation({
    mutationFn: (data: Partial<Trailer>) => createTrailer(data),
    onSuccess: () => handleSuccess(dict.toasts.successAdd),
    onError: (error: Error) => handleError(dict.toasts.errorGeneric, error),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Trailer> }) => updateTrailer(id, data),
    onSuccess: () => handleSuccess(dict.toasts.successUpdate),
    onError: (error: Error) => handleError(dict.toasts.errorGeneric, error),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteTrailer(id),
    onSuccess: () => handleSuccess(dict.toasts.successDelete),
    onError: (error: Error) => handleError(dict.toasts.errorGeneric, error),
  });

  const assignMut = useMutation({
    mutationFn: ({ trailerId, vehicleId }: { trailerId: string; vehicleId: string | null }) =>
      assignTrailerToVehicle(trailerId, vehicleId),
    onSuccess: () => handleSuccess(dict.toasts.successUpdate),
    onError: (error: Error) => handleError(dict.toasts.errorGeneric, error),
  });

  return {
    createTrailer: createMut,
    updateTrailer: updateMut,
    deleteTrailer: deleteMut,
    assignTrailer: assignMut,
  };
}
