export interface Meta {
    generatedAt: string;
    timezone: string;
    units: {
        distance: string;
        weight: string;
        volume: string;
        fuel: string;
    };
    currency: string;
}

export interface Overview {
    kpis: {
        activeShipments: number;
        delayedShipments: number;
        vehiclesOnTrip: number;
        vehiclesInService: number;
        availableVehicles: number;
        activeDrivers: number;
        warehouses: number;
        inventorySkus: number;
    };
    today: {
        date: string;
        plannedRoutes: number;
        completedDeliveries: number;
        failedDeliveries: number;
        avgDeliveryTimeMin: number;
        fuelConsumedLiters: number;
    };
    recentActivity: ActivityEvent[];
}

export interface ActivityEvent {
    id: string;
    type: string;
    message: string;
    timestamp: string;
    ref?: {
        shipmentId?: string;
        vehicleId?: string;
        driverId?: string;
    };
}

export interface Address {
    country: string;
    city: string;
    district: string;
    line1: string;
    postalCode: string;
}

export interface GeoLocation {
    lat: number;
    lng: number;
}

export interface Contact {
    name: string;
    phone: string;
    email: string;
    role?: string;
}

export interface Warehouse {
    id: string;
    code: string;
    name: string;
    address: Address;
    geo: GeoLocation;
    capacity: {
        maxPallets: number;
        usedPallets: number;
        maxVolumeM3: number;
        usedVolumeM3: number;
    };
    operatingHours: {
        monFri: string;
        sat: string;
        sun: string;
    };
    contacts: Contact[];
}

export interface DeliverySite {
    id: string;
    name: string;
    address: Address;
    geo: GeoLocation;
}

export interface SLA {
    onTimeTargetPct: number;
    maxDelayMin: number;
}

export interface Customer {
    id: string;
    code: string;
    name: string;
    industry: string;
    taxNo: string;
    contacts: Contact[];
    billingAddress: Address;
    deliverySites: DeliverySite[];
    sla: SLA;
}

export interface FuelInfo {
    type: string;
    levelPct: number;
    consumptionLPer100Km: number;
}

export interface VehicleCapacity {
    maxWeightKg: number;
    maxVolumeM3: number;
    pallets: number;
}

export interface Telemetry {
    lastPingAt: string;
    location: GeoLocation;
    speedKph: number;
    ignitionOn: boolean;
}

export interface MaintenanceIssue {
    id: string;
    type: string;
    severity: string;
    createdAt: string;
}

export interface MaintenanceRecord {
    id: string;
    serviceType: string;
    serviceLabel: string;
    date: string;
    technician: string;
    cost: number;
    currency: string;
    status: string;
    odometerKm: number;
}

export interface Maintenance {
    nextServiceKm: number;
    nextServiceDate: string;
    openIssues: MaintenanceIssue[];
    history?: MaintenanceRecord[];
}

export interface VehicleDocument {
    type: string;
    expiresOn: string;
    status: string;
}

export interface VehicleAssignment {
    driverId: string | null;
    routeId: string | null;
    shipmentIds: string[];
}

export interface Vehicle {
    id: string;
    fleetNo: string;
    plate: string;
    type: string;
    brand: string;
    model: string;
    year: number;
    vin: string;
    status: string;
    odometerKm: number;
    fuel: FuelInfo;
    capacity: VehicleCapacity;
    telemetry: Telemetry;
    maintenance: Maintenance;
    documents: VehicleDocument[];
    assigned: VehicleAssignment;
}

export interface DriverLicense {
    type: string;
    expiresOn: string;
}

export interface DriverCompliance {
    lastMedicalCheck: string;
    workingHours: {
        todayMinutes: number;
        weekMinutes: number;
    };
    restRequirement: {
        minRestMinutes: number;
        met: boolean;
    };
}

export interface DriverRating {
    avg: number;
    count: number;
}

export interface DriverAssignment {
    vehicleId: string | null;
    routeId: string | null;
    activeShipmentIds: string[];
}

export interface Driver {
    id: string;
    code: string;
    fullName: string;
    phone: string;
    email: string;
    status: string;
    homeBaseWarehouseId: string;
    licenses: DriverLicense[];
    compliance: DriverCompliance;
    rating: DriverRating;
    assigned: DriverAssignment;
}

export interface StopRef {
    warehouseId?: string;
    customerId?: string;
    siteId?: string;
}

export interface RouteStop {
    seq: number;
    type: string; // PICKUP, DELIVERY, RETURN
    ref: StopRef;
    eta: string;
    window: {
        from: string;
        to: string;
    };
}

export interface Route {
    id: string;
    code: string;
    name: string;
    status: string;
    plannedStartAt: string;
    plannedEndAt: string;
    actualStartAt: string | null;
    vehicleId: string;
    driverId: string | null;
    distanceKm: number;
    stops: RouteStop[];
    completedDate: string;
    shipmentIds: string[];
}

export interface Item {
    id: string;
    sku: string;
    name: string;
    category: string;
    uom: string;
    reorderPoint: number;
    reorderQty: number;
    hazmat: boolean;
    temperatureControlled: boolean;
}

export interface StockLine {
    skuId: string;
    onHand: number;
    reserved: number;
    available: number;
    lastCountAt: string;
}

export interface WarehouseStock {
    warehouseId: string;
    lines: StockLine[];
}

export interface StockMovement {
    id: string;
    warehouseId: string;
    skuId: string;
    type: string; // PICK, RESERVE
    qty: number;
    ref: {
        shipmentId: string;
    };
    timestamp: string;
    performedByUserId: string;
}

export interface Inventory {
    items: Item[];
    stockByWarehouse: WarehouseStock[];
    movements: StockMovement[];
}

export interface CargoItem {
    skuId: string;
    name: string;
    qty: number;
    uom: string;
}

export interface Cargo {
    totalWeightKg: number;
    totalVolumeM3: number;
    pallets: number;
    items: CargoItem[];
}

export interface ShipmentTracking {
    lastUpdateAt: string;
    milestones: {
        type: string;
        at: string;
        reason?: string;
    }[];
}

export interface Shipment {
    id: string;
    code: string;
    status: string;
    priority: string;
    customerId: string;
    pickup: {
        warehouseId: string;
        plannedAt: string;
    };
    dropoff: {
        customerSiteId: string;
        plannedAt: string;
    };
    routeId: string;
    vehicleId: string;
    driverId: string | null;
    cargo: Cargo;
    sla: SLA;
    tracking: ShipmentTracking;
    notes: string[];
}

export interface Alert {
    id: string;
    type: string;
    severity: string;
    title: string;
    message: string;
    createdAt: string;
    ref: {
        shipmentId?: string;
        routeId?: string;
        vehicleId?: string;
    };
    status: string;
}

export interface Report {
    id: string;
    name: string;
    type: string;
    createdAt: string;
    range: {
        from: string;
        to: string;
    };
    format: string[];
    status: string;
}

export interface AnalyticsKpis {
    onTimeDeliveryPct: number;
    avgDelayMin: number;
    avgRouteCompletionPct: number;
    fuelCostTry: number;
    costPerKmTry: number;
}

export interface ChartDataPoint {
    date?: string;
    value?: number;
    vehicleId?: string;
    liters?: number;
    costTry?: number;
    status?: string;
    count?: number;
}

export interface Analytics {
    kpis: AnalyticsKpis;
    charts: {
        onTimeTrend: ChartDataPoint[];
        fuelByVehicle: ChartDataPoint[];
        shipmentsByStatus: ChartDataPoint[];
    };
}

export interface User {
    id: string;
    fullName: string;
    email: string;
    roleId: string;
    status: string;
    lastLoginAt: string;
    createdAt: string;
}

export interface Role {
    id: string;
    name: string;
    permissions: string[];
}

export interface Settings {
    company: {
        name: string;
        taxNo: string;
        supportEmail: string;
        supportPhone: string;
    };
    notifications: {
        emailEnabled: boolean;
        smsEnabled: boolean;
        delayAlertThresholdMin: number;
        documentDueDays: number;
    };
    tracking: {
        gpsPingIntervalSec: number;
        mapProvider: string;
        geofenceEnabled: boolean;
    };
    security: {
        sessionTtlDays: number;
        mfaEnabled: boolean;
        passwordPolicy: {
            minLength: number;
            requireUpper: boolean;
            requireNumber: boolean;
            requireSymbol: boolean;
        };
    };
}

export interface Data {
    meta: Meta;
    overview: Overview;
    warehouses: Warehouse[];
    customers: Customer[];
    vehicles: Vehicle[];
    drivers: Driver[];
    routes: Route[];
    inventory: Inventory;
    shipments: Shipment[];
    alerts: Alert[];
    reports: Report[];
    analytics: Analytics;
    users: User[];
    roles: Role[];
    settings: Settings;
}
