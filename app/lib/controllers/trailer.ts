"use server";

import { db } from "../db";
import {
  TrailerStatus,
  TrailerType,
  Prisma,
} from "@prisma/client";
import { authenticatedAction } from "../auth-middleware";
import { checkPermission } from "./utils/checkPermission";
import {
  redis,
  withCache,
  invalidatePattern,
  hashFilters,
  trailerCacheKeys,
  TRAILER_CACHE_TTL,
} from "../redis";
import { TrailerFilters } from "../type/trailer";
import { trailerSchema } from "../validationSchema";

// ── Cache invalidation helper ─────────────────────────────────────────────────
async function invalidateTrailerCache(
  companyId: string,
  trailerId?: string
): Promise<void> {
  await Promise.all([
    invalidatePattern(trailerCacheKeys.companyPattern(companyId)),
    trailerId ? redis.del(trailerCacheKeys.detail(trailerId)) : Promise.resolve(),
  ]);
}



interface TrailerInput {
  plate?: string;
  fleetNo?: string;
  type?: TrailerType;
  capacityVolumeM3?: number | string;
  maxLoadKg?: number | string;
  isColdChain?: boolean;
}

export const createTrailer = authenticatedAction(
  async (user, trailerData: TrailerInput) => {
    const companyId = user?.companyId || "";
    try {
      await checkPermission(user, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      if (!companyId) throw new Error("User has no company");

      const parsed = trailerSchema.parse(trailerData);

      const existingTrailer = await db.trailer.findFirst({
        where: {
          companyId,
          OR: [{ plate: parsed.plate }, { fleetNo: parsed.fleetNo }],
        },
      });

      if (existingTrailer) {
        throw new Error("Plate or Fleet Number already exists.");
      }

      const newTrailer = await db.trailer.create({
        data: {
          plate: parsed.plate,
          fleetNo: parsed.fleetNo,
          type: parsed.type,
          capacityVolumeM3: parsed.capacityVolumeM3,
          maxLoadKg: parsed.maxLoadKg,
          isColdChain: parsed.isColdChain,
          company: { connect: { id: companyId } },
        },
      });

      await invalidateTrailerCache(companyId);
      return newTrailer;
    } catch (error) {
      console.error("Failed to create trailer:", error);
      throw error;
    }
  }
);

export const getTrailers = authenticatedAction(
  async (user, filters: TrailerFilters = {}) => {
    const companyId = user?.companyId || "";
    if (!companyId) throw new Error("User has no company");

    const filtersHash = hashFilters(filters);
    const cacheKey = trailerCacheKeys.list(companyId, filtersHash);

    return withCache(cacheKey, TRAILER_CACHE_TTL, async () => {
      const where: Prisma.TrailerWhereInput = {
        companyId,
        ...(filters.search && {
          OR: [
            { plate: { contains: filters.search, mode: "insensitive" } },
            { fleetNo: { contains: filters.search, mode: "insensitive" } },
          ],
        }),
        ...(filters.status?.length && { status: { in: filters.status } }),
        ...(filters.type?.length && { type: { in: filters.type } }),
        ...(filters.isColdChain !== undefined && { isColdChain: filters.isColdChain }),
      };

      const [trailers, total, availableCount, inUseCount, maintenanceCount, issuesCount] = await Promise.all([
        db.trailer.findMany({
          where,
          include: {
            currentVehicle: {
              select: { id: true, plate: true, fleetNo: true }
            },
            _count: {
              select: { shipments: true, issues: true, documents: true }
            }
          },
          orderBy: { createdAt: "desc" },
          ...(filters.page && filters.limit && {
            skip: (filters.page - 1) * filters.limit,
            take: filters.limit,
          }),
        }),
        db.trailer.count({ where }),
        db.trailer.count({ where: { ...where, status: "AVAILABLE" } }),
        db.trailer.count({ where: { ...where, status: "IN_USE" } }),
        db.trailer.count({ where: { ...where, status: "MAINTENANCE" } }),
        db.trailer.count({ where: { ...where, issues: { some: { status: { in: ["OPEN", "IN_PROGRESS"] } } } } }),
      ]);

      const trailerIds = trailers.map(t => t.id);
      const shipmentsSum = await db.shipment.groupBy({
        by: ["trailerId"],
        where: {
          trailerId: { in: trailerIds },
          status: { in: ["PENDING", "PROCESSING", "IN_TRANSIT", "ASSIGNED", "DELAYED"] }
        },
        _sum: { weightKg: true, volumeM3: true }
      });
      const sumMap = new Map(shipmentsSum.map(s => [s.trailerId, s._sum]));

      const formattedTrailers = trailers.map(trailer => {
        const sums = sumMap.get(trailer.id) || { weightKg: 0, volumeM3: 0 };
        return {
          ...trailer,
          currentWeightKg: sums.weightKg || 0,
          currentVolumeM3: sums.volumeM3 || 0
        };
      });

      return {
        trailers: formattedTrailers,
        kpis: {
          total,
          available: availableCount,
          inUse: inUseCount,
          maintenance: maintenanceCount,
          issues: issuesCount
        },
        meta: {
          total,
          page: filters.page || 1,
          limit: filters.limit || total,
        },
      };
    });
  }
);

export const getTrailerById = authenticatedAction(
  async (user, trailerId: string) => {
    const companyId = user?.companyId || "";
    try {
      const foundTrailer = await db.trailer.findUnique({
        where: { id: trailerId },
        include: {
          currentVehicle: true,
          assignments: {
            take: 10,
            orderBy: { assignedAt: "desc" },
            include: {
              vehicle: { select: { plate: true, fleetNo: true } }
            }
          },
          shipments: {
            take: 5,
            where: { status: { notIn: ["DELIVERED", "CANCELLED"] } }
          }
        },
      });

      if (!foundTrailer || foundTrailer.companyId !== companyId) {
        throw new Error("Trailer not found or unauthorized");
      }

      return foundTrailer;
    } catch (error) {
      console.error("Failed to get trailer:", error);
      throw error;
    }
  }
);

export const updateTrailer = authenticatedAction(
  async (user, trailerId: string, data: Partial<Prisma.TrailerUpdateInput>) => {
    const companyId = user?.companyId || "";
    try {
      const foundTrailer = await db.trailer.findUnique({
        where: { id: trailerId },
        select: { companyId: true },
      });

      if (!foundTrailer || foundTrailer.companyId !== companyId) {
        throw new Error("Trailer not found or unauthorized");
      }

      const updatedTrailer = await db.trailer.update({
        where: { id: trailerId },
        data,
      });

      await invalidateTrailerCache(companyId, trailerId);
      return updatedTrailer;
    } catch (error) {
      console.error("Failed to update trailer:", error);
      throw error;
    }
  }
);

export const deleteTrailer = authenticatedAction(
  async (user, trailerId: string) => {
    const companyId = user?.companyId || "";
    try {
      const foundTrailer = await db.trailer.findUnique({
        where: { id: trailerId },
        select: { companyId: true },
      });

      if (!foundTrailer || foundTrailer.companyId !== companyId) {
        throw new Error("Trailer not found or unauthorized");
      }

      await db.trailer.delete({
        where: { id: trailerId },
      });

      await invalidateTrailerCache(companyId, trailerId);
      return { success: true };
    } catch (error) {
      console.error("Failed to delete trailer:", error);
      throw error;
    }
  }
);

export const assignTrailerToVehicle = authenticatedAction(
  async (user, trailerId: string, vehicleId: string | null) => {
    const companyId = user?.companyId || "";
    try {
      const foundTrailer = await db.trailer.findUnique({
        where: { id: trailerId },
        select: { companyId: true },
      });

      if (!foundTrailer || foundTrailer.companyId !== companyId) {
        throw new Error("Trailer not found or unauthorized");
      }

      await db.$transaction(async (tx) => {
        // End existing active assignment
        await tx.trailerAssignment.updateMany({
          where: { trailerId, detachedAt: null },
          data: { detachedAt: new Date() }
        });

        if (vehicleId) {
          // Check if vehicle exists
          const vehicle = await tx.vehicle.findUnique({ where: { id: vehicleId } });
          if (!vehicle || vehicle.companyId !== companyId) throw new Error("Vehicle not found");

          // Update trailer
          await tx.trailer.update({
            where: { id: trailerId },
            data: { 
              currentVehicleId: vehicleId,
              status: TrailerStatus.IN_USE
            }
          });

          // Create new assignment record
          await tx.trailerAssignment.create({
            data: {
              trailerId,
              vehicleId,
              assignedAt: new Date()
            }
          });
        } else {
          // Detach
          await tx.trailer.update({
            where: { id: trailerId },
            data: { 
              currentVehicleId: null,
              status: TrailerStatus.AVAILABLE
            }
          });
        }
      });

      await invalidateTrailerCache(companyId, trailerId);
      // Also invalidate vehicle cache because vehicle state changed
      await invalidatePattern(`vehicles:${companyId}:*`);
      
      return { success: true };
    } catch (error) {
      console.error("Failed to assign trailer:", error);
      throw error;
    }
  }
);
