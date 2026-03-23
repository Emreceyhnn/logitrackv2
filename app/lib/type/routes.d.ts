import { Route } from "@prisma/client";

// Domain Models
export interface RouteWithRelations extends Route {
  vehicle?: {
    id: string;
    plate: string;
    type: string;
    brand: string;
    model: string;
    currentLat: number | null;
    currentLng: number | null;
    fuelLevel: number | null;
  } | null;

  driver?: {
    id: string;
    status: string;
    phone: string;
    employeeId: string;
    licenseNumber: string | null;
    licenseType: string | null;
    licenseExpiry: Date | null;
    rating: number | null;
    efficiencyScore: number | null;
    safetyScore: number | null;
    createdAt: Date;
    updatedAt: Date;
    user: {
      id: string;
      name: string;
      surname: string;
      avatarUrl: string | null;
    };
  } | null;

  shipments?: {
    id: string;
    status: string;
    origin: string;
    destination: string;
  }[];
  metrics?: {
    totalDistanceKm?: number;
    totalDurationMin?: number;
    totalStops?: number;
    efficiencyShare?: number;
  };
  stops?: {
    id: string;
    type: string;
    name: string;
    status: string;
    arrival?: Date;
    departure?: Date;
  }[];
}

// KPI / Stats
export interface RouteStats {
  active: number;
  inProgress: number;
  completedToday: number;
  delayed: number;
}

export interface RouteNotification {
  id: string;
  title: string;
  message: string;
  date: Date;
  type: "info" | "warning" | "error";
}

export interface RouteNotification {
  id: string;
  title: string;
  message: string;
  date: Date;
  type: "info" | "warning" | "error";
}

export interface RouteEfficiencyStats {
  fuelConsumption: number;
  onTimePerformance: number;
  vehicleUtilization: number;
  recentNotifications: RouteNotification[];
}

export interface MapRouteData {
  position: {
    lat: number;
    lng: number;
  };
  name: string;
  id: string;
  type: string;
  routeId: string;
  routeName: string | null;
}

// Page State
export interface RoutesPageState {
  routes: RouteWithRelations[];
  stats: RouteStats | null;
  efficiency: RouteEfficiencyStats | null;
  mapData: MapRouteData[];
  // Filter Types:
  filters: {
    status?: string;
    search?: string;
    date?: Date;
  };
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  selectedRouteId: string | null;
  viewMode: "list" | "map";
  loading: boolean;
  error: string | null;
}

// Page Actions
export interface RoutesPageActions {
  fetchRoutes: (page?: number, status?: string) => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchEfficiency: () => Promise<void>;
  fetchMapData: () => Promise<void>;
  refreshAll: () => Promise<void>;
  updateFilters: (filters: Partial<RoutesPageState["filters"]>) => void;
  selectRoute: (id: string | null) => void;
  setViewMode: (mode: "list" | "map") => void;
  changePage: (page: number) => void;
}

// Component Props
export interface RouteTableProps {
  routes: RouteWithRelations[];
  loading: boolean;
  onSelect: (id: string) => void;
  pagination: RoutesPageState["pagination"];
  onPageChange: (page: number) => void;
}

export interface RoutesKpiCardProps {
  stats: RouteStats | null;
}
