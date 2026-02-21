// Dashboard Data Types
export interface ActionRequiredItems {
  type: "vehicle" | "driver" | "SHIPMENT_DELAY" | "DOCUMENT_DUE" | "warehouse";
  title: string;
  message: string;
}

export interface OverviewStats {
  activeShipments: number;
  delayedShipments: number;
  vehiclesOnTrip: number;
  vehiclesInService: number;
  availableVehicles: number;
  activeDrivers: number;
  warehouses: number;
  inventorySkus: number;
}

export interface DailyOperationsData {
  plannedRoutes: number;
  completedDeliveries: number;
  failedDeliveries: number;
  avgDeliveryTimeMin: number;
  fuelConsumedLiters: number;
}

export interface FuelStat {
  id: string;
  plate: string;
  value: number;
}

export interface WarehouseCapacityStat {
  warehouseName: string;
  warehouseId: string;
  capacity: number; // utilization %
  volume: number;
}

export interface LowStockItemStat {
  item: string;
  warehouseId: string; // Controller returns name here currently
  onHand: number;
}

export interface PicksAndPacksData {
  picks: number;
  packs: number;
}

export interface TrendData {
  date: string;
  value: number;
}

export interface MapData {
  position: {
    lat: number;
    lng: number;
  };
  name: string;
  id: string;
  type: "W" | "V" | "C"; // Warehouse, Vehicle, Customer
}

export interface DashboardData {
  stats: OverviewStats | null;
  dailyOps: DailyOperationsData | null;
  fuelStats: FuelStat[];
  warehouseCapacity: WarehouseCapacityStat[];
  lowStockItems: LowStockItemStat[];
  shipmentStatus: string[];
  picksAndPacks: PicksAndPacksData | null;
  trends: TrendData[];
  mapData: MapData[];
}

// Page State
export interface OverviewPageState {
  data: DashboardData;
  alerts: ActionRequiredItems[];
  loading: boolean;
  error: string | null;
}

// Page Actions
export interface OverviewPageActions {
  fetchDashboardData: () => Promise<void>;
}

// Component Props
export interface OverviewKpiCardProps {
  values: OverviewStats | null;
  loading?: boolean;
}
