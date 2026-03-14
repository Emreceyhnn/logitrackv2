import { Inventory, Warehouse } from "@prisma/client";

// Domain Models
export interface InventoryWithRelations extends Inventory {
  warehouse: {
    code: string;
    name: string;
  };
  weightKg: number | null;
  volumeM3: number | null;
  palletCount: number | null;
  cargoType: string | null;
}

export interface LowStockItem extends Inventory {
  warehouse: {
    name: string;
  };
}

export interface InventoryMovement {
  id: string;
  sku: string;
  quantity: number;
  type: string;
  date: Date;
  user?: {
    name: string;
    surname: string;
  };
}

// Page State
export interface InventoryPageState {
  inventory: InventoryWithRelations[];
  lowStockItems: LowStockItem[];
  selectedItemId: string | null;
  selectedItem: InventoryWithRelations | null;
  recentMovements: InventoryMovement[]; // New field
  isDetailsOpen: boolean;
  isEditOpen: boolean;
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
  openDetails: (id: string) => void;
  closeDetails: () => void;
  openEdit: (id: string) => void;
  closeEdit: () => void;
  updateItem: (id: string, data: Partial<Inventory>) => Promise<void>;
  updateFilters: (filters: Partial<InventoryPageState["filters"]>) => void;
}

// Component Props
export interface InventoryTableProps {
  items: InventoryWithRelations[];
  loading: boolean;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}

export interface InventoryDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryWithRelations | null;
  onEdit: (id: string) => void;
}

export interface InventoryEditProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryWithRelations | null;
  onUpdate: (id: string, data: Partial<Inventory>) => Promise<void>;
}
