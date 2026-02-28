"use server";

import { db } from "../db";
import { FuelLogWithRelations } from "../type/fuel";

import { authenticatedAction } from "../auth-middleware";

export const getFuelLogs = authenticatedAction(
  async (user, filters: any): Promise<FuelLogWithRelations[]> => {
    if (!user.companyId) {
      throw new Error("User has no company assigned");
    }
    const { vehicleId, driverId, startDate, endDate } = filters;

    return db.fuelLog.findMany({
      where: {
        companyId: user.companyId,
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
    }) as unknown as FuelLogWithRelations[];
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
    }
  ) => {
    return db.fuelLog.create({
      data: {
        ...data,
        companyId: user.companyId!,
      },
    });
  }
);

export const getFuelStats = authenticatedAction(async (user) => {
  if (!user.companyId) {
    throw new Error("User has no company assigned");
  }

  const logs = await db.fuelLog.findMany({
    where: { companyId: user.companyId },
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

  const totalCost = logs.reduce((sum: number, log: any) => sum + log.cost, 0);
  const totalVolume = logs.reduce(
    (sum: number, log: any) => sum + log.volumeLiter,
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
});
