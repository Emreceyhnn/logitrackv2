export interface RouteSchedule {
  plannedStart: string;
  actualStart: string | null;
  plannedEnd: string;
  estimatedEnd: string | null;
}

export interface RouteMetrics {
  totalDistanceKm: number;
  completedDistanceKm: number;
  progressPct: number;
}

export interface RouteStop {
  id: string;
  sequence: number;
  type: string; // PICKUP, DELIVERY, RETURN
  locationName: string;
  status: string;
  eta: string;
  ata?: string;
  shipmentIds?: string[];
}

export interface Route {
  id: string;
  code: string;
  name?: string;
  status: string;
  vehicleId: string;
  driverId: string | null;
  schedule: RouteSchedule;
  metrics: RouteMetrics;
  stops: RouteStop[];
  shipments?: { length: number } | string[];
}
