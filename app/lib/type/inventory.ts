import { Inventory } from "./enums";

// Domain Models
export interface InventoryWithRelations extends Omit<
  Inventory,
  "imageUrl" | "unitValue" | "unit"
> {
  warehouse: {
    code: string;
    name: string;
  };
  imageUrl: string | null;
  unitValue: number | null;
  unit: string;
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
  notes?: string | null;
  user?: {
    name: string;
    surname: string;
  } | null;
}

export interface InventoryStats {
  totalItems: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalValue: number;
}

export interface CreateInventoryInput {
  warehouseId: string;
  sku: string;
  name: string;
  quantity: number;
  minStock?: number;
  weightKg?: number | null;
  volumeM3?: number | null;
  palletCount?: number | null;
  cargoType?: string | null;
  unitValue?: number | null;
  imageUrl?: string | null;
}

export interface UpdateInventoryInput extends Partial<CreateInventoryInput> {}

// Page State
export interface InventoryPageState {
  inventory: InventoryWithRelations[];
  lowStockItems: LowStockItem[];
  totalCount: number;
  stats: InventoryStats | null;
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
import { PaginationMeta } from "./dataTable";

export interface InventoryTableProps {
  items: InventoryWithRelations[];
  loading: boolean;
  onSelect: (id: string) => void;
  onEdit?: (item: InventoryWithRelations) => void;
  onDelete: (id: string) => void;
  meta?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  onRequestSort?: (field: string) => void;
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
