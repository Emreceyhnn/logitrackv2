import { Customer, Shipment } from "@prisma/client";

// Domain Models
export interface CustomerWithRelations extends Customer {
  _count?: {
    shipments: number;
  };
  shipments?: Shipment[];
}

// Page State
export interface CustomerPageState {
  customers: CustomerWithRelations[];
  selectedCustomerId: string | null;
  filters: {
    search?: string;
  };
  loading: boolean;
  error: string | null;
}

// Page Actions
export interface CustomerPageActions {
  fetchCustomers: () => Promise<void>;
  selectCustomer: (id: string | null) => void;
  updateFilters: (filters: Partial<CustomerPageState["filters"]>) => void;
}

// Component Props
export interface CustomerListProps {
  customers: CustomerWithRelations[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onEdit?: (customer: CustomerWithRelations) => void;
}
