"use server";

import { db } from "../db";
import { getUserFromToken } from "./users";

export async function getOverviewStats(token: string) {
    try {
        const requester = await getUserFromToken(token);
        if (!requester || !requester.companyId) {
            return null; // Or throw error, but null allows safe fallback
        }

        const companyId = requester.companyId;

        const [
            activeShipments,
            delayedShipments,
            vehiclesOnTrip,
            vehiclesInService,
            availableVehicles,
            activeDrivers,
            warehouses,
            inventorySkus
        ] = await Promise.all([
            // Active Shipments: Not DELIVERED or CANCELLED
            db.shipment.count({
                where: {
                    companyId,
                    status: { notIn: ["DELIVERED", "CANCELLED", "COMPLETED"] }
                }
            }),
            // Delayed Shipments: Status is 'DELAYED' (assuming string convention)
            db.shipment.count({
                where: {
                    companyId,
                    status: "DELAYED"
                }
            }),
            // Vehicles On Trip
            db.vehicle.count({
                where: {
                    companyId,
                    status: "ON_TRIP"
                }
            }),
            // Vehicles In Service (Maintenance)
            db.vehicle.count({
                where: {
                    companyId,
                    status: "MAINTENANCE"
                }
            }),
            // Available Vehicles
            db.vehicle.count({
                where: {
                    companyId,
                    status: "AVAILABLE"
                }
            }),
            // Active Drivers (On Job)
            db.driver.count({
                where: {
                    companyId,
                    status: "ON_JOB"
                }
            }),
            // Warehouses
            db.warehouse.count({
                where: { companyId }
            }),
            // Inventory SKUs (Unique items)
            db.inventory.count({
                where: { companyId }
            })
        ]);

        return {
            activeShipments,
            delayedShipments,
            vehiclesOnTrip,
            vehiclesInService,
            availableVehicles,
            activeDrivers,
            warehouses,
            inventorySkus
        };

    } catch (error) {
        console.error("Failed to get overview stats:", error);
        throw new Error("Failed to get overview stats");
    }
}

export async function getActionRequired(token: string) {
    return [];
}

export async function getDailyOperations(token: string) {
    try {
        const requester = await getUserFromToken(token);
        if (!requester || !requester.companyId) return null;
        const companyId = requester.companyId;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [plannedRoutes, completedDeliveries] = await Promise.all([
            db.route.count({
                where: {
                    companyId,
                    status: "PLANNED",
                    // date: { gte: today } // Uncomment when date is properly handled
                }
            }),
            db.shipment.count({
                where: {
                    companyId,
                    status: "DELIVERED",
                    updatedAt: { gte: today }
                }
            })
        ]);

        return {
            plannedRoutes,
            completedDeliveries,
            failedDeliveries: 0, // Mock for now
            avgDeliveryTimeMin: 45, // Mock
            fuelConsumedLiters: 250 // Mock
        };
    } catch (error) {
        console.error("Failed to get daily operations:", error);
        return {
            plannedRoutes: 0,
            completedDeliveries: 0,
            failedDeliveries: 0,
            avgDeliveryTimeMin: 0,
            fuelConsumedLiters: 0
        };
    }
}

export async function getFuelStats(token: string) {
    try {
        const requester = await getUserFromToken(token);
        if (!requester || !requester.companyId) return [];
        const companyId = requester.companyId;

        const vehicles = await db.vehicle.findMany({
            where: { companyId },
            take: 5
        });

        return vehicles.map(v => ({
            id: v.id,
            plate: v.plate,
            value: 25 + Math.random() * 10 // Mock fuel consumption
        }));
    } catch (error) {
        console.error("Failed to get fuel stats:", error);
        return [];
    }
}

export async function getWarehouseCapacity(token: string) {
    try {
        const requester = await getUserFromToken(token);
        if (!requester || !requester.companyId) return [];
        const companyId = requester.companyId;

        const warehouses = await db.warehouse.findMany({
            where: { companyId },
            include: { inventory: true }
        });

        return warehouses.map(w => ({
            warehouseName: w.name,
            warehouseId: w.id,
            capacity: 75, // Mock utilization
            volume: 60 // Mock volume
        }));
    } catch (error) {
        console.error("Failed to get warehouse capacity:", error);
        return [];
    }
}

export async function getLowStockItems(token: string) {
    try {
        const requester = await getUserFromToken(token);
        if (!requester || !requester.companyId) return [];
        const companyId = requester.companyId;

        const lowStock = await db.inventory.findMany({
            where: {
                companyId,
                quantity: { lt: 50 } // Threshold
            },
            take: 5,
            include: { warehouse: true }
        });

        return lowStock.map(i => ({
            item: i.name,
            warehouseId: i.warehouse.name,
            onHand: i.quantity
        }));
    } catch (error) {
        console.error("Failed to get low stock items:", error);
        return [];
    }
}

export async function getShipmentStatusStats(token: string) {
    try {
        const requester = await getUserFromToken(token);
        if (!requester || !requester.companyId) return [];
        const companyId = requester.companyId;

        const shipments = await db.shipment.groupBy({
            by: ['status'],
            where: { companyId },
            _count: {
                status: true
            }
        });

        // Flatten to array of statuses for the chart (which expects an array of strings)
        // Or better, return the counts directly. But the component expects [status, status, ...] currently.
        // Let's adapt the component to accept counts, OR for now, reconstruct the array (inefficient but matches component)
        // actually existing component does: values.reduce... so it expects array of status strings.

        // Let's return the raw list of statuses for now to minimize component changes, 
        // but for performance rewrite component later.
        const allShipments = await db.shipment.findMany({
            where: { companyId },
            select: { status: true }
        });

        return allShipments.map(s => s.status);

    } catch (error) {
        console.error("Failed to get shipment status stats:", error);
        return [];
    }
}

export async function getPicksAndPacks(token: string) {
    return {
        picks: 145, // Mock
        packs: 120  // Mock
    };
}

export async function getOnTimeTrends(token: string) {
    return [
        { date: "2026-01-28", value: 92 },
        { date: "2026-01-29", value: 94 },
        { date: "2026-01-30", value: 91 },
        { date: "2026-01-31", value: 95 },
        { date: "2026-02-02", value: 94 },
    ];
}

export async function getMapData(token: string) {
    try {
        const requester = await getUserFromToken(token);
        if (!requester || !requester.companyId) return [];
        const companyId = requester.companyId;

        const [warehouses, vehicles, customers] = await Promise.all([
            db.warehouse.findMany({ where: { companyId } }),
            db.vehicle.findMany({ where: { companyId } }),
            db.customer.findMany({ where: { companyId } })
        ]);

        const mapItems = [
            ...warehouses.map(w => ({
                position: { lat: w.lat || 40.7128, lng: w.lng || -74.0060 }, // Default NYC if missing
                name: w.name,
                id: w.id,
                type: "W"
            })),
            ...vehicles.map(v => ({
                position: { lat: v.currentLat || 40.7128, lng: v.currentLng || -74.0060 },
                name: v.plate,
                id: v.id,
                type: "V"
            })),
            ...customers.map(c => ({
                // Customers don't have lat/lng in schema yet, using mock or skipping.
                // Schema shows Customer has address string. 
                // For now, let's skip or put mock.
                position: { lat: 40.75, lng: -74.05 },
                name: c.name,
                id: c.id,
                type: "C"
            })),
        ];

        return mapItems;

    } catch (error) {
        console.error("Failed to get map data:", error);
        return [];
    }
}

export async function getAnalyticsDashboardData(token: string) {
    try {
        const requester = await getUserFromToken(token);
        if (!requester || !requester.companyId) return null;
        const companyId = requester.companyId;

        const [
            totalVehicles,
            activeVehicles, // ON_TRIP
            totalShipments, // All time
            delayedShipments // Status DELAYED
        ] = await Promise.all([
            db.vehicle.count({ where: { companyId } }),
            db.vehicle.count({ where: { companyId, status: "ON_TRIP" } }),
            db.shipment.count({ where: { companyId } }),
            db.shipment.count({ where: { companyId, status: "DELAYED" } })
        ]);

        // Utilization: Active / Total
        const fleetUtilization = totalVehicles > 0 ? Math.round((activeVehicles / totalVehicles) * 100) : 0;

        // On-Time: (Total - Delayed) / Total (Rough estimate as 'DELAYED' is a status, capturing historical delay is harder without history table analysis)
        // For now, let's assume non-delayed are on-time.
        const onTimeRate = totalShipments > 0 ? Math.round(((totalShipments - delayedShipments) / totalShipments) * 100) : 100;

        return {
            performance: {
                onTimeRate,
                fleetUtilization,
                satisfaction: 4.8, // Mock
                satisfactionCount: 128 // Mock
            },
            costs: {
                months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                fuel: [4200, 4100, 4350, 4220, 4500, 4400],
                maintenance: [1200, 800, 1500, 950, 2100, 1100],
                overhead: [3000, 3000, 3100, 3100, 3200, 3200],
                distribution: [
                    { id: 0, value: 35, label: "Fuel" },
                    { id: 1, value: 25, label: "Maintenance" },
                    { id: 2, value: 30, label: "Driver Salaries" },
                    { id: 3, value: 10, label: "Insurance/Ops" }
                ]
            },
            forecast: {
                weeks: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"],
                actuals: [120, 132, 125, 145, 150, 160, 155, 175, 180, null, null, null],
                predicted: [null, null, null, null, null, null, null, null, 180, 195, 210, 225]
            }
        };

    } catch (error) {
        console.error("Failed to get analytics dashboard data:", error);
        return null;
    }
}
