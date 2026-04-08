import { Customer, Shipment } from "@prisma/client";

// Domain Models
export interface CustomerWithRelations extends Omit<Customer, 'address' | 'lat' | 'lng'> {
  _count?: {
    shipments: number;
  };
  shipments?: Shipment[];
  locations?: import("@prisma/client").CustomerLocation[];
}

// Form State
export interface CustomerFormLocation {
  id?: string;
  name: string;
  address: string;
  lat?: number;
  lng?: number;
  isDefault: boolean;
}

export interface CustomerFormValues {
  name: string;
  code: string;
  industry: string;
  taxId: string;
  email: string;
  phone: string;
  locations: CustomerFormLocation[];
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
  loading?: boolean;
  onSelect: (id: string) => void;
  onEdit?: (customer: CustomerWithRelations) => void;
  onDelete?: (customer: CustomerWithRelations) => void;
}
