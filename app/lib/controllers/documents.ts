"use server";

import { db } from "../db";
import { authenticatedAction } from "../auth-middleware";
import { checkPermission } from "./utils/checkPermission";
import { Prisma } from "@prisma/client";

export const createDocument = authenticatedAction(
  async (
    user,
    type: string,
    name: string,
    url: string,
    expiryDate?: Date,
    driverId?: string,
    vehicleId?: string
  ) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      if (!driverId && !vehicleId) {
        throw new Error(
          "Document must be associated with a driver or a vehicle"
        );
      }

      if (driverId) {
        const driver = await db.driver.findUnique({
          where: { id: driverId },
          select: { companyId: true },
        });
        if (!driver || driver.companyId !== companyId)
          throw new Error("Invalid driver");
      }

      if (vehicleId) {
        const vehicle = await db.vehicle.findUnique({
          where: { id: vehicleId },
          select: { companyId: true },
        });
        if (!vehicle || vehicle.companyId !== companyId)
          throw new Error("Invalid vehicle");
      }

      const now = new Date();
      let docStatus = "ACTIVE";

      if (!expiryDate) {
        docStatus = "MISSING";
      } else if (expiryDate < now) {
        docStatus = "EXPIRED";
      } else {
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(now.getMonth() + 1);
        if (expiryDate <= oneMonthLater) {
          docStatus = "EXPIRING_SOON";
        }
      }

      const newDocument = await db.document.create({
        data: {
          type,
          name,
          url,
          expiryDate,
          status: docStatus,
          companyId,
          driverId,
          vehicleId,
        },
      });

      return { document: newDocument };
    } catch (error) {
      console.error("Failed to create document:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to create document"
      );
    }
  }
);

export const getDocuments = authenticatedAction(
  async (user, entityType?: "driver" | "vehicle", entityId?: string) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const whereClause: Prisma.DocumentWhereInput = { companyId };

      if (entityType === "driver" && entityId) {
        whereClause.driverId = entityId;
      } else if (entityType === "vehicle" && entityId) {
        whereClause.vehicleId = entityId;
      }

      const documents = await db.document.findMany({
        where: whereClause,
        include: {
          driver: {
            select: { user: { select: { name: true, surname: true } } },
          },
          vehicle: { select: { plate: true, brand: true, model: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return documents;
    } catch (error) {
      console.error("Failed to get documents:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to get documents"
      );
    }
  }
);

export const getDocumentById = authenticatedAction(
  async (user, documentId: string) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);
      const document = await db.document.findUnique({
        where: { id: documentId },
        include: {
          driver: true,
          vehicle: true,
        },
      });

      if (!document) throw new Error("Document not found");

      if (document.companyId) {
        await checkPermission(user.id, document.companyId);
      }

      return document;
    } catch (error) {
      console.error("Failed to get document:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to get document"
      );
    }
  }
);

export const deleteDocument = authenticatedAction(
  async (user, documentId: string) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);
      const existingDocument = await db.document.findUnique({
        where: { id: documentId },
        select: { companyId: true },
      });

      if (!existingDocument?.companyId) throw new Error("Document not found");

      await checkPermission(userId, existingDocument.companyId, [
        "role_admin",
        "role_manager",
      ]);

      await db.document.delete({
        where: { id: documentId },
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to delete document:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to delete document"
      );
    }
  }
);

export const getExpiringDocuments = authenticatedAction(
  async (user, daysThreshold: number = 30) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const thresholdDate = new Date();
      thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

      const expiringDocuments = await db.document.findMany({
        where: {
          companyId,
          expiryDate: {
            lte: thresholdDate,
            gte: new Date(),
          },
        },
        include: {
          driver: {
            select: { user: { select: { name: true, surname: true } } },
          },
          vehicle: { select: { plate: true } },
        },
        orderBy: { expiryDate: "asc" },
      });

      return expiringDocuments;
    } catch (error) {
      console.error("Failed to get expiring documents:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to get expiring documents"
      );
    }
  }
);
