"use server";

import { db } from "../../db";
import { Prisma, IssueStatus } from "@prisma/client";
import { checkPermission } from "../utils/checkPermission";
import { authenticatedAction } from "../../auth-middleware";
import {
  VehicleCapacityConverter,
  VehicleDocumentConverter,
  VehicleKpiConverter,
  VehicleServiceConverter,
} from "../utils/vehicleUtils";
import {
  VehicleFilters,
  VehicleWithRelations,
  VehicleDashboardProps,
} from "../../type/vehicle";
import {
  withCache,
  hashFilters,
  vehicleCacheKeys,
  VEHICLE_CACHE_TTL,
} from "../../redis";
import { calcTrend, daysAgo } from "../utils/trendUtils";

export const getVehicles = authenticatedAction(
  async (user, filters?: VehicleFilters): Promise<VehicleWithRelations[]> => {
    const companyId = user?.companyId || "";
    try {
      await checkPermission(user, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      if (!companyId) throw new Error("User has no company");

      const whereClause: Prisma.VehicleWhereInput = { companyId };

      if (filters) {
        if (filters.search) {
          whereClause.OR = [
            { plate: { contains: filters.search, mode: "insensitive" } },
            { brand: { contains: filters.search, mode: "insensitive" } },
            { model: { contains: filters.search, mode: "insensitive" } },
          ];
        }

        if (filters.status && filters.status.length > 0) {
          whereClause.status = { in: filters.status };
        }

        if (filters.type && filters.type.length > 0) {
          whereClause.type = { in: filters.type };
        }

        if (filters.hasIssues) {
          whereClause.issues = {
            some: {
              status: { in: [IssueStatus.OPEN, IssueStatus.IN_PROGRESS] },
            },
          };
        }

        if (filters.hasDriver === true) {
          whereClause.driver = { isNot: null };
        } else if (filters.hasDriver === false) {
          whereClause.driver = { is: null };
        }
      }

      const vehicles = await db.vehicle.findMany({
        where: whereClause,
        include: {
          driver: {
            select: {
              id: true,
              rating: true,
              user: {
                select: { name: true, surname: true, avatarUrl: true },
              },
            },
          },
          issues: true,
          documents: true,
          maintenanceRecords: true,
          routes: { include: { stops: { orderBy: { sequence: "asc" } } } },
        },
        orderBy: { createdAt: "desc" },
      });
      const result: VehicleWithRelations[] = vehicles.map((vehicle) => ({
        ...vehicle,
        maintenanceRecords: vehicle.maintenanceRecords.map((record) => ({
          ...record,
          cost: Number(record.cost),
          originalCost:
            record.originalCost === null ? null : Number(record.originalCost),
        })),
        routes: vehicle.routes.map((route) => ({
          ...route,
          stops: route.stops.map((stop) => ({
            address: stop.address,
            lat: stop.lat ?? undefined,
            lng: stop.lng ?? undefined,
          })),
        })),
      }));
      return result;
    } catch (error) {
      console.error("Failed to get vehicles:", error);
      throw error;
    }
  }
);

export const getVehiclesDashboardData = authenticatedAction(async (user) => {
  const companyId = user?.companyId || "";
  try {
    await checkPermission(user, companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
    ]);

    if (!companyId) throw new Error("User has no company");

    const cacheKey = vehicleCacheKeys.kpis(companyId);

    return await withCache(cacheKey, VEHICLE_CACHE_TTL, async () => {
      const vehicles = await db.vehicle.findMany({
        where: { companyId },
        select: {
          id: true,
          plate: true,
          status: true,
          maxLoadKg: true,

          issues: {
            where: {
              status: {
                in: ["OPEN", "IN_PROGRESS"],
              },
            },
            select: { id: true },
          },

          documents: {
            select: {
              type: true,
              expiryDate: true,
            },
          },
          maintenanceRecords: {
            where: {
              status: { in: ["SCHEDULED"] },
            },
            select: {
              type: true,
              date: true,
              status: true,
            },
          },
        },
      });

      // Previous period snapshot for trend calculation
      const prevPeriodEnd = daysAgo(30);
      const prevVehicleCount = await db.vehicle.count({
        where: { companyId, createdAt: { lt: prevPeriodEnd } },
      });

      const dashboardInput: VehicleDashboardProps[] = vehicles;
      const vehiclesKpis = VehicleKpiConverter(dashboardInput);
      const vehiclesCapacity = VehicleCapacityConverter(dashboardInput);
      const expiringDocs = VehicleDocumentConverter(dashboardInput);
      const plannedServices = VehicleServiceConverter(dashboardInput);

      const kpiTrends = {
        totalVehicles: calcTrend(vehiclesKpis.totalVehicles, prevVehicleCount),
      };

      return {
        vehiclesKpis,
        vehiclesCapacity,
        expiringDocs,
        plannedServices,
        kpiTrends,
      };
    });
  } catch (error) {
    console.error("Failed to get vehicle kpi cards:", error);
    throw error;
  }
});

export const getVehiclesWithDashboard = authenticatedAction(
  async (
    user,
    filters?: VehicleFilters
  ): Promise<{
    vehicles: VehicleWithRelations[];
    vehiclesKpis: ReturnType<typeof VehicleKpiConverter>;
    vehiclesCapacity: ReturnType<typeof VehicleCapacityConverter>;
    expiringDocs: ReturnType<typeof VehicleDocumentConverter>;
    plannedServices: ReturnType<typeof VehicleServiceConverter>;
  }> => {
    const companyId = user?.companyId || "";

    try {
      if (!companyId) throw new Error("User has no company");

      const cacheKey = vehicleCacheKeys.dashboard(
        companyId,
        hashFilters(filters as Record<string, unknown>)
      );

      return await withCache(cacheKey, VEHICLE_CACHE_TTL, async () => {
        const whereClause: Prisma.VehicleWhereInput = { companyId };

        if (filters) {
          if (filters.search) {
            whereClause.OR = [
              { plate: { contains: filters.search, mode: "insensitive" } },
              { brand: { contains: filters.search, mode: "insensitive" } },
              { model: { contains: filters.search, mode: "insensitive" } },
            ];
          }
          if (filters.status && filters.status.length > 0) {
            whereClause.status = { in: filters.status };
          }
          if (filters.type && filters.type.length > 0) {
            whereClause.type = { in: filters.type };
          }
          if (filters.hasIssues) {
            whereClause.issues = {
              some: {
                status: { in: [IssueStatus.OPEN, IssueStatus.IN_PROGRESS] },
              },
            };
          }
          if (filters.hasDriver === true) {
            whereClause.driver = { isNot: null };
          } else if (filters.hasDriver === false) {
            whereClause.driver = { is: null };
          }
        }

        // ── Promise.all: checkPermission + findMany paralel ─────────────────────
        // Her iki DB çağrısı aynı anda başlar; checkPermission (~200ms) findMany
        // (~400-800ms) beklenirken eş zamanlı tamamlanır → toplam süre max() olur.
        // checkPermission başarısız olursa Promise.all hemen reject eder.
        const [, vehicles] = await Promise.all([
          checkPermission(user, companyId, [
            "role_admin",
            "role_manager",
            "role_dispatcher",
          ]),
          db.vehicle.findMany({
            where: whereClause,
            select: {
              // ── Scalars (VehicleWithRelations) ──────────────────────────────
              id: true,
              fleetNo: true,
              plate: true,
              brand: true,
              model: true,
              year: true,
              type: true,
              fuelType: true,
              maxLoadKg: true,
              nextServiceKm: true,
              avgFuelConsumption: true,
              status: true,
              odometerKm: true,
              fuelLevel: true,
              fuelCapacity: true,
              currentLat: true,
              currentLng: true,
              photo: true,
              createdAt: true,
              updatedAt: true,
              engineSize: true,
              transmission: true,
              techNotes: true,

              // ── Driver ──────────────────────────────────────────────────────
              driver: {
                select: {
                  id: true,
                  rating: true,
                  user: {
                    select: { name: true, surname: true, avatarUrl: true },
                  },
                },
              },

              // ── Issues ──────────────────────────────────────────────────────
              issues: {
                select: {
                  id: true,
                  title: true,
                  type: true,
                  priority: true,
                  status: true,
                  description: true,
                  vehicleId: true,
                  companyId: true,
                  createdAt: true,
                  updatedAt: true,
                },
              },

              // ── Documents ───────────────────────────────────────────────────
              documents: {
                select: {
                  id: true,
                  type: true,
                  name: true,
                  url: true,
                  expiryDate: true,
                  status: true,
                  vehicleId: true,
                  companyId: true,
                  createdAt: true,
                  updatedAt: true,
                },
              },

              // ── Maintenance records ──────────────────────────────────────────
              maintenanceRecords: {
                select: {
                  id: true,
                  type: true,
                  date: true,
                  cost: true,
                  currency: true,
                  status: true,
                  description: true,
                  vehicleId: true,
                  createdAt: true,
                  updatedAt: true,
                },
              },

              // ── Routes ──────────────────────────────────────────────────────
              routes: {
                select: {
                  id: true,
                  status: true,
                  date: true,
                  stops: true,
                  createdAt: true,
                  updatedAt: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
          }),
        ]);

        const vehiclesWithRelations: VehicleWithRelations[] = vehicles.map(
          (vehicle) => ({
            ...vehicle,
            maintenanceRecords: vehicle.maintenanceRecords.map((record) => ({
              ...record,
              cost: Number(record.cost),
            })),
            routes: vehicle.routes.map((route) => ({
              ...route,
              stops: route.stops.map((stop) => ({
                address: stop.address,
                lat: stop.lat ?? undefined,
                lng: stop.lng ?? undefined,
              })),
            })),
          })
        );
        const dashboardInput: VehicleDashboardProps[] = vehicles;

        return {
          vehicles: vehiclesWithRelations,
          vehiclesKpis: VehicleKpiConverter(dashboardInput),
          vehiclesCapacity: VehicleCapacityConverter(dashboardInput),
          expiringDocs: VehicleDocumentConverter(dashboardInput),
          plannedServices: VehicleServiceConverter(dashboardInput),
        };
      }); // end withCache
    } catch (error) {
      console.error("Failed to get vehicles with dashboard data:", error);
      throw error;
    }
  }
);
