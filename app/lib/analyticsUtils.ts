import mockData from './mockData.json';
import { Vehicle, VehicleDocument } from './type/VehicleType';

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
        activeShipments: mockData.shipments.filter(s => s.status === 'IN_TRANSIT' || s.status === 'PROCESSING').length,
        delayedShipments: mockData.monitoring?.alerts.filter(a => a.type === 'SHIPMENT_DELAY' && a.status === 'OPEN').length || 0,
        vehiclesOnTrip: mockData.fleet.filter(v => v.status === 'ON_TRIP').length,
        vehiclesInService: mockData.fleet.filter(v => v.status === 'MAINTENANCE').length,
        availableVehicles: mockData.fleet.filter(v => v.status === 'IDLE' || v.status === 'AVAILABLE').length,
        activeDrivers: mockData.auth?.users.filter(u => u.roleId === 'role_driver' && u.status === 'ACTIVE').length || 0,
        warehouses: mockData.warehouses.length,
        inventorySkus: mockData.inventory.catalog.length
    };
};

export const getDailyOperations = (): DailyOpsValues => {
    // In a real app, this would use today's date
    const today = "2026-02-03";

    return {
        plannedRoutes: mockData.routes.filter(r => r.schedule.plannedStart.includes(today)).length,
        completedDeliveries: mockData.shipments.filter(s => s.status === 'DELIVERED').length, // Simplified for mock
        failedDeliveries: 0, // Mock value
        avgDeliveryTimeMin: 45, // Mock value
        fuelConsumedLiters: 250 // Mock value
    };
};

export const getShipmentStatusData = () => {
    const statuses = mockData.shipments.map(s => s.status);
    return statuses;
};

export const getFuelByVehicleData = () => {
    // Assuming mock data has some fuel info or we derive it
    return mockData.fleet.map(v => ({
        id: v.id,
        plate: v.plate,
        value: v.specs.mpg ? (100 / v.specs.mpg) * 3.785 : 25 // Convert MPG to L/100km approx or use mock fallback
    }));
};

export const getWarehouseCapacityData = () => {
    return mockData.warehouses.map(w => ({
        warehouseName: w.name,
        warehouseId: w.id,
        capacity: w.capacity.utilizationRate,
        volume: (w.capacity.usedVolumeM3 / w.capacity.totalVolumeM3) * 100
    }));
};

export const getLowStockItems = () => {
    return mockData.inventory.stock
        .filter(item => item.quantity < 50) // Threshold
        .map(item => ({
            item: item.skuId,
            warehouseId: item.warehouseId,
            onHand: item.quantity
        }));
};

export const getPicksAndPacks = () => {
    // Mocking since we don't have granular movement types in main mockData yet
    return {
        picks: 145,
        packs: 120
    };
};

export const getMapData = () => {
    const warehouses = mockData.warehouses.map(w => ({
        position: w.address.coordinates,
        name: w.name,
        id: w.id,
        type: "W"
    }));

    const vehicles = mockData.fleet.map(v => ({
        position: v.currentStatus.location,
        name: v.plate,
        id: v.id,
        type: "V"
    }));

    const customers = mockData.customers.flatMap(c =>
        c.deliverySites.map(site => ({
            position: site.address.coordinates,
            name: site.name,
            id: site.id,
            type: "C"
        }))
    );

    return [...warehouses, ...vehicles, ...customers];
};

/* -------------------- VEHICLE / FLEET DATA -------------------- */

// We need to map the new mockData "fleet" structure to the old "Vehicle" type 
// expected by components, or at least provide the necessary fields.
export const getVehicleList = (): Vehicle[] => {
    return mockData.fleet.map(v => {
        // Mocking some missing fields for compatibility
        return {
            id: v.id,
            fleetNo: v.fleetNo,
            plate: v.plate,
            type: v.type,
            brand: v.brand,
            model: v.model,
            year: v.year,
            vin: "MOCK-VIN-" + v.id, // Mock
            status: v.status,
            odometerKm: v.currentStatus.odometerKm,
            fuel: {
                type: v.specs.fuelType,
                levelPct: v.currentStatus.fuelLevelPct,
                consumptionLPer100Km: v.specs.mpg ? (235.215 / v.specs.mpg) : 10 // Approx conversion or default
            },
            capacity: {
                maxWeightKg: v.specs.maxLoadKg,
                maxVolumeM3: 0, // Mock or derive
                pallets: 0 // Mock or derive
            },
            telemetry: {
                lastPingAt: v.currentStatus.lastPing,
                location: v.currentStatus.location,
                speedKph: v.currentStatus.speedKph,
                ignitionOn: v.currentStatus.engineStatus === "RUNNING"
            },
            maintenance: {
                nextServiceKm: v.maintenance.nextServiceKm,
                nextServiceDate: v.maintenance.nextServiceDate,
                openIssues: v.maintenance.status === "URGENT" || v.maintenance.status === "DUE_SOON"
                    ? [{ id: "issue_" + v.id, type: "Routine", severity: v.maintenance.status === "URGENT" ? "HIGH" : "MEDIUM", createdAt: "2026-02-01" }]
                    : [],
                history: []
            },
            documents: [
                // Mocking documents based on maintenance or random
                { type: "Start-up Check", expiresOn: v.maintenance.nextServiceDate, status: v.maintenance.status === "DUE_SOON" ? "DUE_SOON" : "VALID" }
            ],
            assigned: {
                driverId: v.assignedTo?.driverId || null,
                routeId: v.assignedTo?.routeId || null,
                shipmentIds: []
            }
        } as Vehicle;
    });
};

export const getVehicleKpis = () => {
    const vehicles = getVehicleList();
    return {
        totalVehicles: vehicles.length,
        available: vehicles.filter(v => v.status === "IDLE" || v.status === "AVAILABLE").length,
        inService: vehicles.filter(v => v.status === "MAINTENANCE").length,
        onTrip: vehicles.filter(v => v.status === "ON_TRIP").length,
        openIssues: vehicles.reduce((acc, v) => acc + v.maintenance.openIssues.length, 0),
        docsDueSoon: vehicles.reduce((acc, v) => acc + v.documents.filter(d => d.status === "DUE_SOON").length, 0)
    };
};

export const getVehicleCapacityStats = () => {
    // Mocking detailed capacity data since fleet specs are basic
    return mockData.fleet.map(v => ({
        plate: v.plate,
        capacity: {
            pallets: v.type === "TRUCK" ? 33 : 4,
            maxVolumeM3: v.type === "TRUCK" ? 90 : 12,
            maxWeightKg: v.specs.maxLoadKg
        }
    }));
};

export const getExpiringDocuments = () => {
    const vehicles = getVehicleList();
    const documents = vehicles.flatMap(v =>
        v.documents
            .filter((d: { status: string }) => d.status === "DUE_SOON")
            .map((d: { type: string, expiresOn: string, status: string }) => ({
                vehicleId: v.id,
                plate: v.plate,
                type: d.type,
                expiresOn: d.expiresOn,
                status: d.status
            }))
    );

    // Also add maintenance as a "document" / event
    const maintenance = vehicles
        .filter(v => v.maintenance.openIssues.length > 0 || v.maintenance.status === 'DUE_SOON')
        .map(v => ({
            vehicleId: v.id,
            plate: v.plate,
            type: "Service Due",
            expiresOn: v.maintenance.nextServiceDate,
            status: "DUE_SOON"
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
        { date: "2026-02-02", value: 94 }
    ];
};

export const getOpenAlerts = () => {
    return (mockData.monitoring?.alerts || []).map(alert => {
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
            message: alert.message
        };
    });
};
