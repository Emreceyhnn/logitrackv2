import { Warehouse, Inventory, Driver, User } from "@prisma/client";

// Domain Models
export interface WarehouseWithRelations extends Warehouse {
  manager?: {
    id: string;
    name: string;
    surname: string;
    email: string;
    avatarUrl: string | null;
  } | null;

  inventory?: Inventory[];

  drivers?: (Driver & {
    user: {
      name: string;
      surname: string;
      avatarUrl: string | null;
    };
  })[];

  _count?: {
    inventory: number;
    drivers: number;
  };
}

export interface InventoryMovementWithRelations {
  id: string;
  warehouseId: string;
  sku: string;
  quantity: number;
  type: string;
  date: Date;
  warehouse: {
    code: string;
    name: string;
  };
  itemName: string;
}

// KPI / Stats
export interface WarehouseStats {
  totalWarehouses: number;
  totalSkus: number;
  totalItems: number;
  totalCapacityPallets: number;
  totalCapacityVolume: number;
}

// Page State
export interface WarehousePageState {
  warehouses: WarehouseWithRelations[];
  stats: WarehouseStats | null;
  recentMovements: InventoryMovementWithRelations[];
  selectedWarehouseId: string | null;
  loading: boolean;
  error: string | null;
}

// Page Actions
export interface WarehousePageActions {
  fetchWarehouses: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchRecentMovements: () => Promise<void>;
  refreshAll: () => Promise<void>;
  selectWarehouse: (id: string | null) => void;
}

// Component Props
export interface WarehouseKpiCardProps {
  stats: WarehouseStats | null;
  loading?: boolean;
}

export interface WarehouseTableProps {
  warehouses: WarehouseWithRelations[];
  loading: boolean;
  onSelect: (id: string) => void;
}
