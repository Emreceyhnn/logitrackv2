"use server";

import { db } from "../db";
import { checkPermission } from "./utils/checkPermission";
import { FuelLog, FuelLogWithRelations, FuelPageState } from "../type/fuel";
import { authenticatedAction } from "../auth-middleware";

export const getFuelLogs = authenticatedAction(
  async (user, filters: FuelPageState["filters"]) => {
    const userId = user?.id || "";
    const companyId = user?.companyId || "";
    try {
      await checkPermission(userId, companyId);
      if (!companyId) {
        throw new Error("User has no company assigned");
      }
      const { vehicleId, driverId, startDate, endDate } = filters;

      const logs = await db.fuelLog.findMany({
        where: {
          companyId,
          ...(vehicleId && { vehicleId }),
          ...(driverId && { driverId }),
          ...(startDate &&
            endDate && {
              date: {
                gte: startDate,
                lte: endDate,
              },
            }),
        },
        include: {
          vehicle: {
            select: {
              id: true,
              plate: true,
              fleetNo: true,
            },
          },
          driver: {
            include: {
              user: {
                select: {
                  name: true,
                  surname: true,
                },
              },
            },
          },
        },
        orderBy: {
          date: "desc",
        },
      });

      return logs as unknown as FuelLogWithRelations[];
    } catch (error) {
      console.error("Failed to get fuel logs:", error);
      throw error;
    }
  }
);

export const createFuelLog = authenticatedAction(
  async (
    user,
    data: {
      vehicleId: string;
      driverId: string;
      volumeLiter: number;
      cost: number;
      odometerKm: number;
      location?: string;
      fuelType: string;
      date?: Date;
      receiptUrl?: string;
      currency?: string;
    }
  ) => {
    const userId = user?.id || "";
    const companyId = user?.companyId || "";
    try {
      await checkPermission(userId, companyId);
      if (!companyId) throw new Error("User has no company assigned");

      return db.fuelLog.create({
        data: {
          ...data,
          currency: data.currency || "USD",
          companyId,
        },
      });
    } catch (error) {
      console.error("Failed to create fuel log:", error);
      throw error;
    }
  }
);

export const getFuelStats = authenticatedAction(async (user) => {
  const userId = user?.id || "";
  const companyId = user?.companyId || "";
  try {
    await checkPermission(userId, companyId);
    if (!companyId) {
      throw new Error("User has no company assigned");
    }

    const logs = await db.fuelLog.findMany({
      where: { companyId },
      orderBy: { date: "desc" },
    });

    if (logs.length === 0) {
      return {
        totalCost: 0,
        totalVolume: 0,
        avgFuelPrice: 0,
        efficiencyKml: 0,
      };
    }

    const totalCost = logs.reduce(
      (sum: number, log: FuelLog) => sum + log.cost,
      0
    );
    const totalVolume = logs.reduce(
      (sum: number, log: FuelLog) => sum + log.volumeLiter,
      0
    );

    // Basic efficiency calculation if we have at least 2 logs with odometer readings
    let efficiencyKml = 0;
    if (logs.length >= 2) {
      const sortedLogs = [...logs].sort((a, b) => b.odometerKm - a.odometerKm);
      const totalDist =
        sortedLogs[0].odometerKm - sortedLogs[sortedLogs.length - 1].odometerKm;
      efficiencyKml = totalDist / totalVolume;
    }

    return {
      totalCost,
      totalVolume,
      avgFuelPrice: totalCost / totalVolume,
      efficiencyKml,
    };
  } catch (error) {
    console.error("Failed to get fuel stats:", error);
    throw error;
  }
});
