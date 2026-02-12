// @ts-nocheck - Mock data utilities file, not used in production database flow
import { on } from "events";
import mockData from "./mockData.json";
import { VehicleWithRelations } from "./type/vehicle";

// Alias for compatibility with mock data
type Vehicle = any; // Mock data doesn't match VehicleWithRelations exactly
type VehicleDocument = { type: string; expiresOn: string; status: string };

// Types for better type safety
interface KpiValues {
  activeShipments: number;
  delayedShipments: number;
  vehiclesOnTrip: number;
  vehiclesInService: number;
  availableVehicles: number;
  activeDrivers: number;
  warehouses: number;
  inventorySkus: number;
}

interface DailyOpsValues {
  plannedRoutes: number;
  completedDeliveries: number;
  failedDeliveries: number;
  avgDeliveryTimeMin: number;
  fuelConsumedLiters: number;
}

export const getOverviewKpis = (): KpiValues => {
  return {
    activeShipments: mockData.shipments.filter(
      (s) => s.status === "IN_TRANSIT" || s.status === "PROCESSING"
    ).length,
    delayedShipments:
      mockData.monitoring?.alerts.filter(
        (a) => a.type === "SHIPMENT_DELAY" && a.status === "OPEN"
      ).length || 0,
    vehiclesOnTrip: mockData.fleet.filter((v) => v.status === "ON_TRIP").length,
    vehiclesInService: mockData.fleet.filter((v) => v.status === "MAINTENANCE")
      .length,
    availableVehicles: mockData.fleet.filter(
      (v) => v.status === "IDLE" || v.status === "AVAILABLE"
    ).length,
    activeDrivers:
      mockData.auth?.users.filter(
        (u) => u.roleId === "role_driver" && u.status === "ACTIVE"
      ).length || 0,
    warehouses: mockData.warehouses.length,
    inventorySkus: mockData.inventory.catalog.length,
  };
};

export const getDailyOperations = (): DailyOpsValues => {
  // In a real app, this would use today's date
  const today = "2026-02-03";

  return {
    plannedRoutes: mockData.routes.filter((r) =>
      r.schedule.plannedStart.includes(today)
    ).length,
    completedDeliveries: mockData.shipments.filter(
      (s) => s.status === "DELIVERED"
    ).length,
    failedDeliveries: 0,
    avgDeliveryTimeMin: 45,
    fuelConsumedLiters: 250,
  };
};

export const getShipmentStatusData = () => {
  const statuses = mockData.shipments.map((s) => s.status);
  return statuses;
};

export const getFuelByVehicleData = () => {
  // Assuming mock data has some fuel info or we derive it
  return mockData.fleet.map((v) => ({
    id: v.id,
    plate: v.plate,
    value: v.specs.mpg ? (100 / v.specs.mpg) * 3.785 : 25, // Convert MPG to L/100km approx or use mock fallback
  }));
};

export const getWarehouseCapacityData = () => {
  return mockData.warehouses.map((w) => ({
    warehouseName: w.name,
    warehouseId: w.id,
    capacity: w.capacity.utilizationRate,
    volume: (w.capacity.usedVolumeM3 / w.capacity.totalVolumeM3) * 100,
  }));
};

export const getLowStockItems = () => {
  return mockData.inventory.stock
    .filter((item) => item.quantity < 50) // Threshold
    .map((item) => ({
      item: item.skuId,
      warehouseId: item.warehouseId,
      onHand: item.quantity,
    }));
};

export const getPicksAndPacks = () => {
  // Mocking since we don't have granular movement types in main mockData yet
  return {
    picks: 145,
    packs: 120,
  };
};

export const getMapData = () => {
  const warehouses = mockData.warehouses.map((w) => ({
    position: w.address.coordinates,
    name: w.name,
    id: w.id,
    type: "W",
  }));

  const vehicles = mockData.fleet.map((v) => ({
    position: v.currentStatus.location,
    name: v.plate,
    id: v.id,
    type: "V",
  }));

  const customers = mockData.customers.flatMap((c) =>
    c.deliverySites.map((site) => ({
      position: site.address.coordinates,
      name: site.name,
      id: site.id,
      type: "C",
    }))
  );

  return [...warehouses, ...vehicles, ...customers];
};

/* -------------------- VEHICLE / FLEET DATA -------------------- */

// We need to map the new mockData "fleet" structure to the old "Vehicle" type
// expected by components, or at least provide the necessary fields.
export const getVehicleList = (): Vehicle[] => {
  return mockData.fleet.map((v) => {
    return {
      ...v,
      // Ensure compatible types if strict mapping is needed, otherwise spread v is likely sufficient
      // given VehicleType was adjusted to match mockData.
      // However, we need to explicitly handle optional fields if they are missing in mockData elements
      documents: (v as any).documents || [],
    } as unknown as Vehicle;
  });
};

export const getVehicleKpis = () => {
  const vehicles = getVehicleList();
  return {
    totalVehicles: vehicles.length,
    available: vehicles.filter(
      (v) => v.status === "AVAILABLE" // IDLE doesn't exist in VehicleStatus enum
    ).length,
    inService: vehicles.filter((v) => v.status === "MAINTENANCE").length,
    onTrip: vehicles.filter((v) => v.status === "ON_TRIP").length,
    openIssues: vehicles.reduce(
      (acc, v) => acc + ((v as any).maintenance?.openIssues?.length || 0),
      0
    ),
    docsDueSoon: vehicles.reduce(
      (acc, v) =>
        acc + (v.documents || []).filter((d) => d.status === "DUE_SOON").length,
      0
    ),
  };
};

export const getVehicleCapacityStats = () => {
  return mockData.fleet.map((v) => ({
    plate: v.plate,
    capacity: {
      pallets: v.type === "TRUCK" ? 33 : 4,
      maxVolumeM3: v.type === "TRUCK" ? 90 : 12,
      maxWeightKg: v.specs.maxLoadKg,
    },
  }));
};

export const getExpiringDocuments = () => {
  const vehicles = getVehicleList();
  const documents = vehicles.flatMap((v) =>
    (v.documents || [])
      .filter((d: { status: string }) => d.status === "DUE_SOON")
      .map((d: { type: string; expiresOn: string; status: string }) => ({
        vehicleId: v.id,
        plate: v.plate,
        type: d.type,
        expiresOn: d.expiresOn,
        status: d.status,
      }))
  );

  // Also add maintenance as a "document" / event
  const maintenance = vehicles
    .filter(
      (v) =>
        ((v as any).maintenance?.openIssues?.length || 0) > 0 ||
        (v as any).maintenance?.status === "DUE_SOON"
    )
    .map((v) => ({
      vehicleId: v.id,
      plate: v.plate,
      type: "Service Due",
      expiresOn: (v as any).maintenance?.nextServiceDate || "N/A",
      status: "DUE_SOON",
    }));

  return [...documents, ...maintenance];
};

export const getOnTimeTrendsData = () => {
  // Returning mock trend data
  return [
    { date: "2026-01-28", value: 92 },
    { date: "2026-01-29", value: 94 },
    { date: "2026-01-30", value: 91 },
    { date: "2026-01-31", value: 95 },
    { date: "2026-02-02", value: 94 },
  ];
};

export const getOpenAlerts = () => {
  return (mockData.monitoring?.alerts || []).map((alert) => {
    let title = "Alert";
    let type = "warehouse"; // Default fallback

    if (alert.type === "SHIPMENT_DELAY") {
      title = "Shipment Delayed";
      type = "SHIPMENT_DELAY";
    } else if (alert.type === "MAINTENANCE_DUE") {
      title = "Maintenance Due";
      type = "vehicle";
    } else if (alert.type === "DOCUMENT_DUE") {
      title = "Document Expiry";
      type = "DOCUMENT_DUE";
    }

    return {
      type,
      title,
      message: alert.message,
    };
  });
};

export const getDriverKpiValues = () => {
  const drivers = mockData.staff.drivers;
  return {
    totalLength: drivers.length,
    onDuty: drivers.filter((d) => d.status === "ON_DUTY").length,
    offDuty: drivers.filter((d) => d.status === "OFF_DUTY").length,
    complianceIssues: drivers.filter((d) => !d.compliance.restRequirement.met)
      .length,
    safetyScoreRating: (
      drivers.reduce((acc, curr) => acc + curr.rating.avg, 0) / drivers.length
    ).toFixed(1),
    efficiencyRating: (
      drivers.reduce(
        (acc, curr) => acc + curr.metrics.efficiencyScore / 20,
        0
      ) / drivers.length
    ).toFixed(1),

    onTimeDeliveryRating: (
      drivers.reduce((acc, curr) => acc + curr.metrics.onTimeRate / 20, 0) /
      drivers.length
    ).toFixed(1),
  };
};

export const getDriverDetailsForTable = () => {
  return mockData.staff.drivers.map((d) => d);
};
