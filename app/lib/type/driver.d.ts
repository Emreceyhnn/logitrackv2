import { DriverStatus } from "@prisma/client";

export interface DriverWithRelations {
  id: string;
  status: DriverStatus;
  phone: string;
  employeeId: string | null;
  licenseNumber: string | null;
  licenseType: string | null;
  licenseExpiry: Date | null;
  rating: number | null;
  efficiencyScore: number | null;
  safetyScore: number | null;

  user: {
    id: string;
    name: string;
    surname: string;
    email: string;
    avatarUrl: string | null;
    roleId: string | null;
  };

  currentVehicle: {
    id: string;
    plate: string;
    brand: string;
    model: string;
  } | null;

  _count?: {
    shipments: number;
    issues: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface DriverDashboardResponseType {
  driversKpis: {
    totalDrivers: number;
    onDuty: number;
    offDuty: number;
    onLeave: number;
    complianceIssues: number;
    avgSafetyScore: number;
    avgEfficiencyScore: number;
  };
  topPerformers: {
    id: string;
    name: string;
    surname: string;
    rating: number;
    tripsCompleted: number;
  }[];
  performanceCharts: {
    name: string;
    rating: number;
    workingHours: number;
    days: number[]; // Added for chart compatibility
    values: number[]; // Added for chart compatibility
  }[];
}

export interface DriverFilters {
  search?: string;
  status?: DriverStatus[];
  hasVehicle?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DriverPageState {
  drivers: DriverWithRelations[];
  dashboardData: DriverDashboardResponseType | null;
  filters: DriverFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  selectedDriverId: string | null;
  selectedDriver: DriverWithRelations | null;
  loading: boolean;
  error: string | null;
}

export interface DriverPageActions {
  fetchDrivers: (
    page?: number,
    limit?: number,
    filters?: DriverFilters,
    sort?: { field: string; order: "asc" | "desc" }
  ) => Promise<void>;
  fetchDashboardData: () => Promise<void>;
  selectDriver: (id: string | null) => void;
  updateFilters: (filters: Partial<DriverFilters>) => void;
  changePage: (page: number) => void;
  refreshAll: () => Promise<void>;
}

export interface DriverTableProps {
  drivers: DriverWithRelations[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onDriverSelect: (id: string) => void;
  onEdit: (driver: DriverWithRelations) => void;
  onDelete: (id: string) => void;
  loading: boolean;
  onRefresh: () => void;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  onRequestSort?: (property: string) => void;
}

export interface DriverKpiCardProps {
  data: DriverDashboardResponseType["driversKpis"] | null;
}

export interface CreateDriverFormData {
  userId: string;
  phone: string;
  licenseNumber: string;
  licenseType: string;
  licenseExpiry: Date | null;
  employeeId: string;
  status: DriverStatus;
  currentVehicleId?: string | null;
  homeBaseWarehouseId?: string | null;
  languages?: string[];
  hazmatCertified?: boolean;
  licensePhotoUrl?: string;
  documents?: { name: string; type: string; url: string; expiryDate?: Date }[];
}

export interface AddDriverStep1 {
  userId: string;
  phone: string;
  employeeId: string;
  licenseNo: string;
  licenseExpiry: Date | null;
  licenseType: string;
  licenseIssueDate: Date | null;
  licenseRegion: string;
  licencePhoto: File | null;
}

export interface AddDriverDocument {
  id: string;
  name: string;
  type: string;
  expiryDate: Date | null;
  file: File | null;
  url?: string;
  size?: string;
  uploadedAt?: string;
}

export interface AddDriverStep2 {
  homeWareHouseId: string;
  currentVehicleId: string;
  status: string;
  languages: string[];
  hazmatCertified: boolean;
  documents: AddDriverDocument[];
}

export interface AddDriverPageState {
  currentStep: number;
  data: {
    step1: AddDriverStep1;
    step2: AddDriverStep2;
  };
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
}

export interface AddDriverPageActions {
  updateStep1: (data: Partial<AddDriverStep1>) => void;
  updateStep2: (data: Partial<AddDriverStep2>) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  handleSubmit: () => void;
  closeDialog: () => void;
  reset: () => void;
}

export interface AddDriverDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface EditDriverStep1 {
  phone: string;
  licenseNo: string;
  licenseExpiry: Date | null;
  licenseType: string;
  licenseIssueDate: Date | null;
  licenseRegion: string;
  licencePhoto: File | null;
  employeeId: string;
}

export interface EditDriverStep2 {
  homeWareHouseId: string;
  currentVehicleId: string;
  status: string;
  languages: string[];
  hazmatCertified: boolean;
  documents: AddDriverDocument[];
}

export interface EditDriverPageState {
  currentStep: number;
  data: {
    step1: EditDriverStep1;
    step2: EditDriverStep2;
  };
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
}

export interface EditDriverPageActions {
  updateStep1: (data: Partial<EditDriverStep1>) => void;
  updateStep2: (data: Partial<EditDriverStep2>) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  handleSubmit: () => void;
  closeDialog: () => void;
  reset: () => void;
}

export interface EditDriverDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  driver: DriverWithRelations | null;
}

export interface EligibleUser {
  id: string;
  name: string;
  surname: string;
  email: string;
  avatarUrl?: string | null;
  roleId?: string | null;
}
