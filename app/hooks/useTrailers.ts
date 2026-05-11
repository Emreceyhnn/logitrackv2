"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  getTrailers,
  getTrailerById,
  createTrailer,
  updateTrailer,
  deleteTrailer,
  assignTrailerToVehicle,
} from "@/app/lib/controllers/trailer";
import { TrailerFilters } from "@/app/lib/type/trailer";
import { trailerKeys } from "@/app/lib/query-keys/trailer.keys";
import { vehicleKeys } from "@/app/lib/query-keys/vehicle.keys";
import { toast } from "sonner";

export function useTrailers(filters: TrailerFilters = {}) {
  return useQuery({
    queryKey: trailerKeys.list(filters),
    queryFn: () => getTrailers(filters),
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

  const handleError = (message: string, error: Error | unknown) => {
    console.error(message, error);
    toast.error((error as Error)?.message || message);
  };

  const createMut = useMutation({
    mutationFn: (data: any) => createTrailer(data),
    onSuccess: () => handleSuccess("Trailer created successfully"),
    onError: (error: Error) => handleError("Failed to create trailer", error),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateTrailer(id, data),
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
