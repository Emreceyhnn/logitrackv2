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

export const createTrailer = authenticatedAction(
  async (user, trailerData: Record<string, unknown>) => {
    const userId = user?.id || "";
    const companyId = user?.companyId || "";
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      if (!companyId) throw new Error("User has no company");

      const {
        plate,
        fleetNo,
        type,
        capacityVolumeM3,
        maxLoadKg,
        isColdChain,
      } = trailerData as any;

      if (!plate) throw new Error("Plate is required");
      if (!type) throw new Error("Trailer type is required");

      const existingTrailer = await db.trailer.findFirst({
        where: {
          OR: [{ plate: plate.toString() }, { fleetNo: fleetNo?.toString() }],
        },
      });

      if (existingTrailer) {
        throw new Error("Plate or Fleet Number already exists.");
      }

      const newTrailer = await db.trailer.create({
        data: {
          plate: plate.toString(),
          fleetNo: fleetNo?.toString() || `T-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
          type: type as TrailerType,
          capacityVolumeM3: parseFloat(capacityVolumeM3?.toString() || "0"),
          maxLoadKg: parseInt(maxLoadKg?.toString() || "0"),
          isColdChain: !!isColdChain,
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
  async (user, filters: any = {}) => {
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

      const trailers = await db.trailer.findMany({
        where,
        include: {
          currentVehicle: {
            select: { id: true, plate: true, fleetNo: true }
          },
          shipments: {
            where: {
              status: {
                in: ["PENDING", "PROCESSING", "IN_TRANSIT", "ASSIGNED", "PLANNED", "DELAYED"]
              }
            },
            select: {
              weightKg: true,
              volumeM3: true
            }
          },
          _count: {
            select: { shipments: true, issues: true, documents: true }
          }
        },
        orderBy: { createdAt: "desc" },
      });

      // Calculate current load totals
      return trailers.map(trailer => {
        const currentWeightKg = trailer.shipments.reduce((sum, s) => sum + (s.weightKg || 0), 0);
        const currentVolumeM3 = trailer.shipments.reduce((sum, s) => sum + (s.volumeM3 || 0), 0);
        
        // Remove shipments array from return to keep it lightweight
        const { shipments, ...rest } = trailer;
        return {
          ...rest,
          currentWeightKg,
          currentVolumeM3
        };
      });
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
