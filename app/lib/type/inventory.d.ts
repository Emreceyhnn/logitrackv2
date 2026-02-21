import { Inventory, Warehouse } from "@prisma/client";

// Domain Models
export interface InventoryWithRelations extends Inventory {
  warehouse: {
    code: string;
    name: string;
  };
}

export interface LowStockItem extends Inventory {
  warehouse: {
    name: string;
  };
}

// Page State
export interface InventoryPageState {
  inventory: InventoryWithRelations[];
  lowStockItems: LowStockItem[];
  selectedItemId: string | null;
  filters: {
    warehouseId?: string;
    search?: string;
  };
  loading: boolean;
  error: string | null;
}

// Page Actions
export interface InventoryPageActions {
  fetchInventory: (warehouseId?: string) => Promise<void>;
  fetchLowStock: () => Promise<void>;
  refreshAll: () => Promise<void>;
  selectItem: (id: string | null) => void;
  updateFilters: (filters: Partial<InventoryPageState["filters"]>) => void;
}

// Component Props
export interface InventoryTableProps {
  items: InventoryWithRelations[];
  loading: boolean;
  onSelect: (id: string) => void;
}
