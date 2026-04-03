import {
  Shipment,
  Route,
  ShipmentHistory,
  Company,
  ShipmentStatus,
  ShipmentPriority,
} from "@prisma/client";
import { CustomerWithRelations } from "./customer";

// Domain Models
export interface ShipmentWithRelations extends Omit<Shipment, "status" | "priority"> {
  status: ShipmentStatus;
  priority: ShipmentPriority | null;
  originLat?: number | null;
  originLng?: number | null;
  destinationLat?: number | null;
  destinationLng?: number | null;
  customer: CustomerWithRelations | null;
  customerLocationId?: string | null;
  driver?: {
    id: string;
    user: {
      name: string;
      surname: string;
      avatarUrl: string | null;
    };
  } | null;
  route?: Route | null;

  // New fields
  type?: string | null;
  slaDeadline?: Date | null;
  contactEmail?: string | null;
  billingAccount?: string | null;

  // For detail view
  company?: Company | null;
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
  status: ShipmentStatus;
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
    status?: ShipmentStatus;
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
