import {
  Issue,
  VehicleStatus,
  VehicleType,
  Document,
  MaintenanceRecord,
  Route,
  User,
  Driver,
} from "@prisma/client";

export interface VehicleDashboardProps {
  id: string;
  plate: string;
  status: VehicleStatus;
  maxLoadKg: number;
  documents: {
    type: string;
    expiryDate: Date | null;
  }[];
  issues: {
    id: string;
  }[];
}

export interface VehicleDashboardResponseType {
  vehiclesKpis: {
    totalVehicles: number;
    available: number;
    inService: number;
    onTrip: number;
    openIssues: number;
    docsDueSoon: number;
  };
  vehiclesCapacity: {
    id: string;
    plate: string;
    maxLoadKg: number;
  }[];
  expiringDocs: {
    id: string;
    plate: string;
    documentType: string;
    expiryDate: Date | null;
  }[];
}

export interface DriverWithUser {
  id: string;
  rating: number | null;
  user: {
    name: string;
    surname: string;
    avatarUrl: string | null;
  };
}

export interface VehicleWithRelations {
  id: string;
  fleetNo: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  type: VehicleType;
  maxLoadKg: number;
  fuelType: string;
  nextServiceKm: number | null;
  avgFuelConsumption: number | null;
  status: VehicleStatus;
  odometerKm: number | null;
  fuelLevel: number | null;
  currentLat: number | null;
  currentLng: number | null;
  driver: DriverWithUser | null;
  issues: Issue[];
  documents: Document[];
  maintenanceRecords: MaintenanceRecord[];
  routes: Route[];
  createdAt: Date;
  updatedAt: Date;
}

// Filter types
export interface VehicleFilters {
  search?: string;
  status?: VehicleStatus[];
  type?: VehicleType[];
  hasIssues?: boolean;
  hasDriver?: boolean;
}

// Page state (centralized)
export interface VehiclePageState {
  vehicles: VehicleWithRelations[];
  dashboardData: VehicleDashboardResponseType | null;
  filters: VehicleFilters;
  selectedVehicleId: string | null;
  loading: boolean;
  error: string | null;
}

// Page actions
export interface VehiclePageActions {
  fetchVehicles: () => Promise<void>;
  fetchDashboardData: () => Promise<void>;
  selectVehicle: (id: string | null) => void;
  updateFilters: (filters: Partial<VehicleFilters>) => void;
  refreshAll: () => Promise<void>;
}

// Component props
export interface VehicleTableProps {
  vehicles: VehicleWithRelations[];
  onVehicleSelect: (id: string) => void;
  loading: boolean;
  onRefresh: () => void;
}

export interface VehicleKpiCardProps {
  totalVehicles?: number;
  available?: number;
  inService?: number;
  onTrip?: number;
  openIssues?: number;
  docsDueSoon?: number;
  onClick?: (filterType: string) => void;
}

export interface EditVehicleDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  vehicle: {
    id: string;
    fleetNo: string;
    plate: string;
    type: VehicleType;
    brand: string;
    model: string;
    year: number;
    maxLoadKg: number;
    fuelType: string;
    status: VehicleStatus;
    odometerKm?: number | null;
    nextServiceKm?: number | null;
    avgFuelConsumption?: number | null;
  };
}

export interface VehicleFormData {
  type: VehicleType;
  brand: string;
  model: string;
  year: number | "";
  maxLoadKg: number | "";
  fuelType: string;
  status: VehicleStatus;
  odometerKm?: number | "";
  nextServiceKm?: number | "";
  avgFuelConsumption?: number | "";
}
