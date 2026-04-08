export interface ShipmentStatusCount {
  status: string;
  count: number;
}

export interface RouteCount {
  route: string;
  count: number;
}

export interface FleetVehicleStats {
  plate: string;
  consumption: string;
  odometer: number;
  maintenanceCost: number;
}

export interface InventoryCategoryStats {
  [category: string]: {
    value: number;
    count: number;
  };
}

export interface ReportsMetrics {
  totalShipments: number;
  onTimeRate: number;
  activeVehicles: number;
  totalInventoryValue: number;
}

export interface ReportsData {
  shipments: {
    statusCounts: ShipmentStatusCount[];
    routeCounts: RouteCount[];
  };
  fleet: FleetVehicleStats[];
  inventory: {
    categoryStats: InventoryCategoryStats;
  };
  metrics: ReportsMetrics;
}

export interface ReportsPageState {
  data: ReportsData | null;
  loading: boolean;
  error: string | null;
  tabIndex: number;
}
