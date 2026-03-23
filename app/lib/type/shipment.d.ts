import {
  Shipment,
  Customer,
  Route,
  ShipmentHistory,
  Company,
} from "@prisma/client";

// Domain Models
export interface ShipmentWithRelations extends Shipment {
  destinationLat?: number | null;
  destinationLng?: number | null;
  customer: Customer | null;
  driver?: {
    id: string;
    user: {
      name: string;
      surname: string;
      avatarUrl: string | null;
    };
  } | null;
  route?: Route | null;

  // For detail view
  company?: Company;
  history?: ShipmentHistory[];
}

// KPI / Stats
export interface ShipmentStats {
  total: number;
  active: number;
  delayed: number;
  inTransit: number;
}

export interface ShipmentVolumeData {
  day: string; // Sun, Mon, etc.
  volume: number;
}

export interface ShipmentStatusData {
  status: string;
  count: number;
}

// Page State
export interface ShipmentPageState {
  shipments: ShipmentWithRelations[];
  stats: ShipmentStats | null;
  volumeHistory: ShipmentVolumeData[];
  statusDistribution: ShipmentStatusData[];
  selectedShipmentId: string | null;
  filters: {
    status?: string;
    search?: string;
    date?: Date;
  };
  loading: boolean;
  error: string | null;
}

// Page Actions
export interface ShipmentPageActions {
  fetchShipments: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchCharts: () => Promise<void>;
  refreshAll: () => Promise<void>;
  selectShipment: (id: string | null) => void;
  updateFilters: (filters: Partial<ShipmentPageState["filters"]>) => void;
}

// Component Props
export interface ShipmentTableProps {
  state: ShipmentPageState;
  actions: ShipmentPageActions & {
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
  };
}

export interface ShipmentKpiCardProps {
  state: ShipmentPageState;
  actions: ShipmentPageActions;
}

export interface ShipmentAnalyticsProps {
  state: ShipmentPageState;
  actions: ShipmentPageActions;
}
