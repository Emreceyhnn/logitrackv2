"use server";

import { db } from "../db";
import { authenticatedAction } from "../auth-middleware";
import { checkPermission } from "./utils/checkPermission";
import { DocumentStatus, DocumentType, Prisma } from "@prisma/client";
import { sendNotificationAction as createNotification } from "@/app/lib/actions/notifications";
import { driverCacheKeys, invalidatePattern, vehicleCacheKeys } from "../redis";
import { controllerGuard } from "./utils/controllerGuard";
import { NotFoundError, ForbiddenError, ValidationError } from "../errors";

export const createDocument = authenticatedAction(
  async (
    user,
    type: DocumentType,
    name: string,
    url: string,
    expiryDate?: Date,
    driverId?: string,
    vehicleId?: string
  ) => {
    const companyId = user?.companyId || "";
    return controllerGuard("createDocument", async () => {
      await checkPermission(user, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      if (!driverId && !vehicleId) {
        throw new ValidationError(
          "Document must be associated with a driver or a vehicle"
        );
      }

      if (driverId) {
        const driver = await db.driver.findUnique({
          where: { id: driverId },
          select: { companyId: true },
        });
        if (!driver || driver.companyId !== companyId)
          throw new NotFoundError("Driver");
      }

      if (vehicleId) {
        const vehicle = await db.vehicle.findUnique({
          where: { id: vehicleId },
          select: { companyId: true },
        });
        if (!vehicle || vehicle.companyId !== companyId)
          throw new NotFoundError("Vehicle");
      }

      const now = new Date();
      let docStatus: DocumentStatus = DocumentStatus.ACTIVE;

      if (!expiryDate) {
        docStatus = DocumentStatus.MISSING;
      } else if (expiryDate < now) {
        docStatus = DocumentStatus.EXPIRED;
      } else {
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(now.getMonth() + 1);
        if (expiryDate <= oneMonthLater) {
          docStatus = DocumentStatus.EXPIRING_SOON;
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
      if (vehicleId) {
        await invalidatePattern(vehicleCacheKeys.companyPattern(companyId));
      }
      if (driverId) {
        await invalidatePattern(driverCacheKeys.companyPattern(companyId));
      }

      // Dispatch Notification for expiration alerts
      if (docStatus === "EXPIRED" || docStatus === "EXPIRING_SOON") {
        await createNotification(
          { companyId },
          {
            title:
              docStatus === "EXPIRED"
                ? "Belge Süresi Dolmuş! 🚫"
                : "Belge Süresi Yaklaşıyor! ⏳",
            message: `${name} isimli belgenin durumu: ${docStatus}. Lütfen yenileyiniz.`,
            type: docStatus === "EXPIRED" ? "ERROR" : "WARNING",
            link: "/dashboard/documents",
          }
        );
      }

      return { document: newDocument };
    });
  }
);

export const getDocuments = authenticatedAction(
  async (user, entityType?: "driver" | "vehicle", entityId?: string) => {
    const companyId = user?.companyId || "";
    return controllerGuard("getDocuments", async () => {
      await checkPermission(user, companyId, [
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
    });
  }
);

export const getDocumentById = authenticatedAction(
  async (user, documentId: string) => {
    const companyId = user?.companyId || "";
    return controllerGuard("getDocumentById", async () => {
      await checkPermission(user, companyId, [
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

      if (!document) throw new NotFoundError("Document");

      if (document.companyId !== companyId) {
        throw new ForbiddenError();
      }

      return document;
    });
  }
);

export const deleteDocument = authenticatedAction(
  async (user, documentId: string) => {
    const companyId = user?.companyId || "";
    return controllerGuard("deleteDocument", async () => {
      await checkPermission(user, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);
      const existingDocument = await db.document.findUnique({
        where: { id: documentId },
        select: { companyId: true, vehicleId: true, driverId: true },
      });

      if (!existingDocument?.companyId) throw new NotFoundError("Document");

      await checkPermission(user, existingDocument.companyId, [
        "role_admin",
        "role_manager",
      ]);

      await db.document.delete({
        where: { id: documentId },
      });

      if (existingDocument.vehicleId) {
        await invalidatePattern(
          vehicleCacheKeys.companyPattern(existingDocument.companyId)
        );
      }
      if (existingDocument.driverId) {
        await invalidatePattern(
          driverCacheKeys.companyPattern(existingDocument.companyId)
        );
      }

      return { success: true };
    });
  }
);

export const getExpiringDocuments = authenticatedAction(
  async (user, daysThreshold: number = 30) => {
    const companyId = user?.companyId || "";
    return controllerGuard("getExpiringDocuments", async () => {
      await checkPermission(user, companyId, [
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
    });
  }
);
