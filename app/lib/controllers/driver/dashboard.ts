"use server";

import { db } from "../../db";
import { checkPermission } from "../utils/checkPermission";
import { Prisma } from "@prisma/client";
import { authenticatedAction } from "../../auth-middleware";
import {
  DriverWithRelations,
  DriverFilters,
  DriverDashboardResponseType,
} from "../../type/driver";
import { calcTrend, daysAgo } from "../utils/trendUtils";
import { controllerGuard } from "../utils/controllerGuard";
import { driverCache } from "./shared";

export const getDriverDashboardData = authenticatedAction(async (user) => {
  return controllerGuard("getDriverDashboardData", async () => {
    const companyId = user?.companyId || "";
    await checkPermission(user, companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
    ]);

    return await driverCache.cachedDashboard(
      companyId,
      "kpis",
      async () => {
        const [totalDrivers, onDuty, offDuty, onLeave, safetyScoreAgg, topDrivers] =
          await Promise.all([
          db.driver.count({ where: { companyId } }),
          db.driver.count({
            where: { companyId, status: "ON_JOB" },
          }),
          db.driver.count({
            where: { companyId, status: "OFF_DUTY" },
          }),
          db.driver.count({
            where: { companyId, status: "ON_LEAVE" },
          }),
          db.driver.aggregate({
            where: { companyId },
            _avg: { safetyScore: true, efficiencyScore: true },
          }),
          db.driver.findMany({
            where: { companyId },
            select: {
              id: true,
              user: { select: { name: true, surname: true } },
              rating: true,
              _count: { select: { shipments: true } },
            },
            orderBy: { rating: "desc" },
            take: 5,
          }),
        ]);

      const complianceIssuesCount = await db.driver.count({
        where: {
          companyId,
          OR: [
            { licenseExpiry: { lt: new Date() } },
            { safetyScore: { lt: 75 } },
          ],
        },
      });

      return {
        driversKpis: {
          totalDrivers,
          onDuty,
          offDuty,
          onLeave,
          complianceIssues: complianceIssuesCount,
          avgSafetyScore: safetyScoreAgg._avg.safetyScore || 0,
          avgEfficiencyScore: safetyScoreAgg._avg.efficiencyScore || 0,
        },
        topPerformers: topDrivers.map((d) => ({
          id: d.id,
          name: d.user.name,
          surname: d.user.surname,
          rating: d.rating || 0,
          tripsCompleted: d._count.shipments,
        })),
        performanceCharts: topDrivers.map((d) => ({
          name: d.user.name,
          rating: d.rating || 0,
          workingHours: d._count.shipments * 5 + 30,
          days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
          values: [
            d._count.shipments,
            d._count.shipments + 1,
            Math.max(0, d._count.shipments - 1),
            d._count.shipments + 2,
            d._count.shipments,
          ],
        })),
        recentIncidents: [],
      };
      }
    );
  });
});

export const getDriverWithDashboardData = authenticatedAction(
  async (
    user,
    filters?: DriverFilters
  ): Promise<{
    drivers: DriverWithRelations[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    driversKpis: DriverDashboardResponseType["driversKpis"];
    topPerformers: DriverDashboardResponseType["topPerformers"];
    performanceCharts: DriverDashboardResponseType["performanceCharts"];
  }> => {
    return controllerGuard("getDriverWithDashboardData", async () => {
      const companyId = user?.companyId || "";
      if (!companyId) throw new Error("User has no company");

      const whereClause: Prisma.DriverWhereInput = { companyId };
      const limit = filters?.limit || 10;
      const page = filters?.page || 1;
      const skip = (page - 1) * limit;

      if (filters) {
        if (filters.search) {
          whereClause.OR = [
            { user: { name: { contains: filters.search, mode: "insensitive" } } },
            { user: { surname: { contains: filters.search, mode: "insensitive" } } },
            { licenseNumber: { contains: filters.search, mode: "insensitive" } },
            { phone: { contains: filters.search, mode: "insensitive" } },
          ];
        }

        if (filters.status && filters.status.length > 0) {
          whereClause.status = { in: filters.status };
        }

        if (filters.hasVehicle !== undefined) {
          if (filters.hasVehicle) {
            whereClause.currentVehicleId = { not: null };
          } else {
            whereClause.currentVehicleId = null;
          }
        }
      }

      let orderBy: Prisma.DriverOrderByWithRelationInput = { createdAt: "desc" };
      if (filters?.sortField && filters?.sortOrder) {
        if (filters.sortField === "name") {
          orderBy = { user: { name: filters.sortOrder } };
        } else if (filters.sortField === "vehicle") {
          orderBy = { currentVehicle: { plate: filters.sortOrder } };
        } else {
          orderBy = { [filters.sortField]: filters.sortOrder } as Prisma.DriverOrderByWithRelationInput;
        }
      }

      return await driverCache.cachedDashboard(
        companyId,
        driverCache.hashFilters(filters || {}),
        async () => {
          const [
            ,
            drivers,
            totalDriversList,
            totalDrivers,
            onDuty,
            offDuty,
            onLeave,
            safetyScoreAgg,
            topDrivers,
            complianceIssuesCount,
            prevTotalDrivers,
          ] = await Promise.all([
            checkPermission(user, companyId, ["role_admin", "role_manager", "role_dispatcher"]),
            db.driver.findMany({
              where: whereClause,
              include: {
                user: {
                  select: { id: true, name: true, surname: true, email: true, avatarUrl: true, roleId: true },
                },
                currentVehicle: { select: { id: true, plate: true, brand: true, model: true } },
                homeBaseWarehouse: { select: { id: true, name: true, code: true } },
                _count: { select: { shipments: true, issues: true } },
                documents: true,
              },
              orderBy,
              skip,
              take: limit,
            }),
            db.driver.count({ where: whereClause }), // count for paginated list
            db.driver.count({ where: { companyId } }),
            db.driver.count({ where: { companyId, status: "ON_JOB" } }),
            db.driver.count({ where: { companyId, status: "OFF_DUTY" } }),
            db.driver.count({ where: { companyId, status: "ON_LEAVE" } }),
            db.driver.aggregate({ where: { companyId }, _avg: { safetyScore: true, efficiencyScore: true } }),
            db.driver.findMany({
              where: { companyId },
              select: { id: true, user: { select: { name: true, surname: true } }, rating: true, _count: { select: { shipments: true } } },
              orderBy: { rating: "desc" },
              take: 5,
            }),
            db.driver.count({
              where: { companyId, OR: [{ licenseExpiry: { lt: new Date() } }, { safetyScore: { lt: 75 } }] },
            }),
            db.driver.count({ where: { companyId, createdAt: { lt: daysAgo(30) } } }),
          ]);

          const kpiTrends = {
            totalDrivers: calcTrend(totalDrivers, prevTotalDrivers),
          };

          return {
            drivers: drivers as DriverWithRelations[],
            meta: {
              total: totalDriversList,
              page,
              limit,
              totalPages: Math.ceil(totalDriversList / limit),
            },
            driversKpis: {
              totalDrivers,
              onDuty,
              offDuty,
              onLeave,
              complianceIssues: complianceIssuesCount,
              avgSafetyScore: safetyScoreAgg._avg.safetyScore || 0,
              avgEfficiencyScore: safetyScoreAgg._avg.efficiencyScore || 0,
            },
            kpiTrends,
            topPerformers: topDrivers.map((d) => ({
              id: d.id,
              name: d.user.name,
              surname: d.user.surname,
              rating: d.rating || 0,
              tripsCompleted: d._count.shipments,
            })),
            performanceCharts: topDrivers.map((d) => ({
              name: d.user.name,
              rating: d.rating || 0,
              workingHours: d._count.shipments * 5 + 30,
              days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
              values: [
                d._count.shipments,
                d._count.shipments + 1,
                Math.max(0, d._count.shipments - 1),
                d._count.shipments + 2,
                d._count.shipments,
              ],
            })),
          };
        }
      );
    });
  }
);
