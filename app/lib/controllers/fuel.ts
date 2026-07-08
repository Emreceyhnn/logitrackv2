"use server";

import { db } from "../db";
import { FuelType } from "@prisma/client";
import { checkPermission } from "./utils/checkPermission";
import { FuelLogWithRelations, FuelPageState } from "../type/fuel";
import { authenticatedAction } from "../auth-middleware";
import { getExchangeRates } from "@/app/lib/services/exchangeRate";
import { controllerGuard } from "./utils/controllerGuard";
import { createFuelLogSchema } from "../validation/serverSchemas";
import { logger } from "../logger";

export const getFuelLogs = authenticatedAction(
  async (user, filters: FuelPageState["filters"]) => {
    return controllerGuard("getFuelLogs", async () => {
      const companyId = user?.companyId || "";
      await checkPermission(user, companyId);
      
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

      const typedLogs: FuelLogWithRelations[] = logs.map((log) => ({
        ...log,
        cost: Number(log.cost),
      }));
      return typedLogs;
    });
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
      location?: string | undefined;
      fuelType: FuelType;
      date?: Date | undefined;
      receiptUrl?: string | undefined;
      currency?: string | undefined;
    }
  ) => {
    return controllerGuard("createFuelLog", async () => {
      const companyId = user?.companyId || "";
      await checkPermission(user, companyId);
      
      const parsed = createFuelLogSchema.parse(data);

      // Normalize cost to USD
      let normalizedCost = parsed.cost;
      const currency = parsed.currency;
      if (currency !== "USD") {
        try {
          const rates = await getExchangeRates();
          const rate = rates.rates[currency] || 1;
          normalizedCost = parsed.cost / rate;
        } catch (err) {
          logger.warn("[fuel] Currency conversion failed", err);
        }
      }

      const log = await db.fuelLog.create({
        data: {
          ...parsed,
          location: parsed.location ?? null,
          receiptUrl: parsed.receiptUrl ?? null,
          cost: normalizedCost,
          currency: "USD",
          companyId,
        },
      });
      return { ...log, cost: Number(log.cost) };
    });
  }
);

export const getFuelStats = authenticatedAction(async (user) => {
  return controllerGuard("getFuelStats", async () => {
    const companyId = user?.companyId || "";
    await checkPermission(user, companyId);

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

    const totalCost = logs.reduce((sum: number, log) => sum + Number(log.cost), 0);
    const totalVolume = logs.reduce(
      (sum: number, log) => sum + log.volumeLiter,
      0
    );

    // Basic efficiency calculation if we have at least 2 logs with odometer readings
    let efficiencyKml = 0;
    if (logs.length >= 2) {
      const sortedLogs = [...logs].sort((a, b) => b.odometerKm - a.odometerKm);
      const highest = sortedLogs[0];
      const lowest = sortedLogs[sortedLogs.length - 1];
      if (highest && lowest) {
        const totalDist = highest.odometerKm - lowest.odometerKm;
        efficiencyKml = totalDist / totalVolume;
      }
    }

    return {
      totalCost,
      totalVolume,
      avgFuelPrice: totalCost / totalVolume,
      efficiencyKml,
    };
  });
});
