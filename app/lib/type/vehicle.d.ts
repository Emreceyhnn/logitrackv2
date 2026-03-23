import {
  Issue,
  VehicleStatus,
  VehicleType,
  Document,
  MaintenanceRecord,
  Route,
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
  photo: string | null;
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
  state: VehiclePageState;
  actions: VehiclePageActions & {
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
  };
}

export interface VehicleKpiCardProps {
  state: VehiclePageState;
  actions: VehiclePageActions;
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

import { Dayjs } from "dayjs";

export interface VehicleStep1Data {
  photo?: string | File;
  fleetNo: string;
  plate: string;
  type: VehicleType | "";
  brand: string;
  model: string;
  year: number | "";
  odometerKm: number | "";
  nextServiceKm: number | "";
}

export interface VehicleStep2Data {
  maxLoadKg: number | "";
  fuelType: string;
  fuelLevel: number | "";
  avgFuelConsumption: number | "";
  engineSize: string;
  transmission: string;
  techNotes: string;
}

export interface VehicleStep3Data {
  registrationExpiry: Dayjs | null;
  inspectionExpiry: Dayjs | null;
  nextServiceDueKm: number | "";
  enableExpiryAlerts: boolean;
  documents: {
    id: string;
    type: string;
    name: string;
    size: string;
    uploadedAt: string;
    file: File | null;
  }[];
}

export interface AddVehiclePageState {
  currentStep: number;
  data: {
    step1: VehicleStep1Data;
    step2: VehicleStep2Data;
    step3: VehicleStep3Data;
  };
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
}

export interface VehicleToolbarProps {
  state: VehiclePageState;
  actions: VehiclePageActions;
}

export interface AddVehiclePageActions {
  updateStep1: (data: Partial<VehicleStep1Data>) => void;
  updateStep2: (data: Partial<VehicleStep2Data>) => void;
  updateStep3: (data: Partial<VehicleStep3Data>) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  handleSubmit: () => Promise<void>;
  closeDialog: () => void;
  reset: () => void;
}

export interface AddVehiclePageProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface FirstStepProps {
  state: AddVehiclePageState;
  actions: AddVehiclePageActions;
  onFileSelect?: (file: File) => void;
}

export interface TechSpecsStepProps {
  state: AddVehiclePageState;
  actions: AddVehiclePageActions;
}

export interface DocumentsStepProps {
  state: AddVehiclePageState;
  actions: AddVehiclePageActions;
}
