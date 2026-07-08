import type { RouteStatus } from "@prisma/client";

// Route lifecycle: PLANNED → ACTIVE → COMPLETED; cancel allowed until completion.
export const ROUTE_TRANSITIONS: Record<RouteStatus, RouteStatus[]> = {
  PLANNED: ["ACTIVE", "CANCELED"],
  ACTIVE: ["COMPLETED", "CANCELED"],
  COMPLETED: [],
  CANCELED: ["PLANNED"], // allow re-planning a canceled route
};

export interface RouteUpdateData {
  name?: string;
  status?: RouteStatus;
  date?: Date;
  startTime?: Date | null | undefined;
  endTime?: Date | null | undefined;
  distanceKm?: number | null;
  durationMin?: number | null;
  driverId?: string | null;
  vehicleId?: string | null;
  stops?: { address: string; lat?: number | undefined; lng?: number | undefined }[];
}
