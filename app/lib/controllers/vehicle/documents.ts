"use server";

import { db } from "../../db";
import { DocumentType, DocumentStatus } from "@prisma/client";
import { sendNotificationAction as createNotification } from "@/app/lib/actions/notifications";
import { checkPermission } from "../utils/checkPermission";
import { authenticatedAction } from "../../auth-middleware";
import { invalidateVehicleCache } from "./cache";

export const uploadVehicleDocument = authenticatedAction(
  async (
    user,
    vehicleId: string,
    documentData: {
      type: DocumentType;
      name: string;
      url: string;
      expiryDate?: Date;
      status: DocumentStatus;
    }
  ) => {
    const companyId = user?.companyId || "";
    try {
      await checkPermission(user, companyId, ["role_admin", "role_manager"]);

      const foundVehicle = await db.vehicle.findUnique({
        where: { id: vehicleId },
        select: { companyId: true },
      });

      if (!foundVehicle || foundVehicle.companyId !== companyId) {
        throw new Error("Vehicle not found or unauthorized");
      }

      const doc = await db.document.create({
        data: {
          vehicleId,
          companyId,
          ...documentData,
        },
      });

      // Dispatch Notification if document is expired or expiring soon
      const now = new Date();
      const oneMonthLater = new Date();
      oneMonthLater.setMonth(now.getMonth() + 1);

      if (documentData.expiryDate) {
        const expiry = new Date(documentData.expiryDate);
        if (expiry < now) {
          await createNotification(
            { companyId: companyId! },
            {
              title: "Kritik Belge Uyarısı! 🚫",
              message: `${documentData.name} belgesinin süresi dolmuş! Hemen yenileyiniz.`,
              type: "ERROR",
              category: "MAINTENANCE_ALERT",
              link: `/dashboard/vehicles/${vehicleId}`,
            }
          );
        } else if (expiry <= oneMonthLater) {
          await createNotification(
            { companyId: companyId! },
            {
              title: "Belge Süresi Yaklaşıyor ⏳",
              message: `${documentData.name} belgesinin süresi 1 ay içinde dolacak.`,
              type: "WARNING",
              link: `/dashboard/vehicles/${vehicleId}`,
            }
          );
        }
      }

      await invalidateVehicleCache(companyId, vehicleId);
      return doc;
    } catch (error) {
      console.error("Failed to upload document:", error);
      throw error;
    }
  }
);
