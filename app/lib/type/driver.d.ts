import { DriverStatus } from "@prisma/client";

// Domain Models
export interface DriverWithRelations {
  id: string;
  status: DriverStatus;
  phone: string;
  employeeId: string | null; // Added
  licenseNumber: string | null;
  licenseType: string | null; // Changed from LicenseType enum if it's string in DB, usually string based on schema
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
  }[];
}

// Filter Types
export interface DriverFilters {
  search?: string;
  status?: DriverStatus[];
  hasVehicle?: boolean; // Assigned or Unassigned
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

// Page State
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

// Page Actions
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

// Component Props
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
  loading?: boolean;
}

// Form Data for Creating Driver
// Form Data for Creating Driver
export interface CreateDriverFormData {
  // User Info
  userId: string;

  // Driver Info
  phone: string;
  licenseNumber: string;
  licenseType: string;
  licenseExpiry: Date | null;
  employeeId: string;
  status: DriverStatus;
}
