import { DriverStatus } from "@/app/lib/type/enums";

export const driverKeys = {
  all: ["drivers"] as const,
  lists: () => [...driverKeys.all, "list"] as const,
  list: (params: {
    page: number;
    limit: number;
    search?: string;
    status?: DriverStatus[];
    hasVehicle?: boolean;
    sortField?: string;
    sortOrder?: "asc" | "desc";
  }) => [...driverKeys.lists(), params] as const,
  details: () => [...driverKeys.all, "detail"] as const,
  detail: (id: string) => [...driverKeys.details(), id] as const,
  dashboard: () => [...driverKeys.all, "dashboard"] as const,
  dashboardWithFilters: (filters: {
    page: number;
    limit: number;
    search?: string;
    status?: DriverStatus[];
    hasVehicle?: boolean;
    sortField?: string;
    sortOrder?: "asc" | "desc";
  }) => [...driverKeys.dashboard(), { filters }] as const,
};
