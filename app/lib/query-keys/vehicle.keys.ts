/**
 * Vehicle Query Keys
 *
 * Extracted into a standalone, directive-free module so it can be safely
 * imported by BOTH Server Components (page.tsx prefetchQuery) and Client
 * Components / hooks (useVehicles.ts). Adding "use client" to this file
 * would prevent Server Components from importing it.
 */

import type { VehicleFilters } from "@/app/lib/type/vehicle";

export const vehicleKeys = {
  all: ["vehicles"] as const,
  lists: () => [...vehicleKeys.all, "list"] as const,
  list: (filters: VehicleFilters) =>
    [...vehicleKeys.lists(), { filters }] as const,
  details: () => [...vehicleKeys.all, "detail"] as const,
  detail: (id: string) => [...vehicleKeys.details(), id] as const,
  dashboard: () => [...vehicleKeys.all, "dashboard"] as const,
  dashboardWithFilters: (filters: VehicleFilters) =>
    [...vehicleKeys.dashboard(), { filters }] as const,
};
