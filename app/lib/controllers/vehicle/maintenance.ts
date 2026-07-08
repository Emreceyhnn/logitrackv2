"use server";

import { db } from "../../db";
import { MaintenanceStatus, MaintenanceType } from "@prisma/client";
import { sendNotificationAction as createNotification } from "@/app/lib/actions/notifications";
import { checkPermission } from "../utils/checkPermission";
import { authenticatedAction } from "../../auth-middleware";
import { getExchangeRates } from "@/app/lib/services/exchangeRate";
import { invalidateVehicleCache } from "./cache";
import { controllerGuard } from "../utils/controllerGuard";
import { logger } from "../../logger";

export const addMaintenanceRecord = authenticatedAction(
  async (
    user,
    vehicleId: string,
    recordData: {
      type: MaintenanceType;
      date: Date;
      cost: number;
      currency?: string;
      status?: MaintenanceStatus;
      description?: string;
      documentUrl?: string;
    }
  ) => {
    const companyId = user?.companyId || "";
    return controllerGuard("addMaintenanceRecord", async () => {
      await checkPermission(user, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
        "role_driver",
      ]);

      const foundVehicle = await db.vehicle.findUnique({
        where: { id: vehicleId },
        select: { companyId: true, plate: true },
      });

      if (!foundVehicle || foundVehicle.companyId !== companyId) {
        throw new Error("Vehicle not found or unauthorized");
      }

      // Normalize cost to USD
      let normalizedCost = recordData.cost;
      if (recordData.currency && recordData.currency !== "USD") {
        try {
          const rates = await getExchangeRates();
          const rate = rates.rates[recordData.currency] || 1;
          normalizedCost = recordData.cost / rate;
        } catch (err) {
          logger.warn("[vehicle] Currency conversion failed", err);
        }
      }

      const record = await db.maintenanceRecord.create({
        data: {
          vehicleId,
          companyId,
          ...recordData,
          cost: normalizedCost,
          originalCost: recordData.cost,
          originalCurrency: recordData.currency || "USD",
          currency: "USD",
        },
      });

      await invalidateVehicleCache(companyId, vehicleId);

      // Dispatch Notification
      await createNotification(
        { companyId: companyId! },
        {
          title: "Bakım Kaydı Oluşturuldu 👨‍🔧",
          message: `${foundVehicle.plate} plakalı araç bakıma alındı. Tür: ${recordData.type}`,
          type: "INFO",
          category: "MAINTENANCE_ALERT",
          link: `/dashboard/vehicles/${vehicleId}`,
        }
      );

      return record;
    });
  }
);

export const updateMaintenanceRecord = authenticatedAction(
  async (
    user,
    recordId: string,
    data: {
      type?: MaintenanceType;
      date?: Date;
      cost?: number;
      currency?: string;
      status?: MaintenanceStatus;
      description?: string;
      documentUrl?: string;
    }
  ) => {
    const companyId = user?.companyId || "";
    return controllerGuard("updateMaintenanceRecord", async () => {
      await checkPermission(user, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const foundRecord = await db.maintenanceRecord.findUnique({
        where: { id: recordId },
        include: {
          vehicle: {
            select: {
              companyId: true,
              id: true,
              plate: true,
            },
          },
        },
      });

      if (!foundRecord || foundRecord.vehicle.companyId !== companyId) {
        throw new Error("Record not found or unauthorized");
      }

      // Normalize cost to USD if provided
      const finalData = { ...data };
      if (data.cost !== undefined && data.currency && data.currency !== "USD") {
        try {
          const rates = await getExchangeRates();
          const rate = rates.rates[data.currency] || 1;
          finalData.cost = data.cost / rate;
          finalData.currency = "USD";
        } catch (err) {
          logger.warn("[vehicle] Currency conversion failed in update", err);
        }
      } else if (data.currency) {
        // If currency is provided but cost is not, we might need more complex logic,
        // but usually they come together from the dialog.
        // For now, if currency is USD, just set it.
        finalData.currency = "USD";
      }

      const updatedRecord = await db.maintenanceRecord.update({
        where: { id: recordId },
        data: finalData,
        include: { vehicle: { select: { plate: true, id: true } } },
      });

      // Dispatch Notification if status changed
      const oldStatus = foundRecord.status;
      const newStatus = data.status || updatedRecord.status;

      if (newStatus !== oldStatus) {
        let title = "Bakım Güncellendi 👨‍🔧";
        let message = `${updatedRecord.vehicle.plate} plakalı aracın ${updatedRecord.type} bakımı durumu ${newStatus} olarak güncellendi.`;
        let type: "INFO" | "SUCCESS" | "WARNING" | "ERROR" = "INFO";

        switch (newStatus) {
          case "COMPLETED":
            title = "Bakım Tamamlandı! ✅";
            message = `${updatedRecord.vehicle.plate} plakalı aracın ${updatedRecord.type} bakımı başarıyla tamamlandı.`;
            type = "SUCCESS";
            break;
          case "CANCELLED":
            title = "Bakım İptal Edildi 🛑";
            message = `${updatedRecord.vehicle.plate} plakalı aracın ${updatedRecord.type} bakımı iptal edildi.`;
            type = "WARNING";
            break;
          case "IN_PROGRESS":
            title = "Bakım Devam Ediyor 🔧";
            message = `${updatedRecord.vehicle.plate} plakalı aracın ${updatedRecord.type} bakımı başladı.`;
            type = "INFO";
            break;
          case "SCHEDULED":
            title = "Bakım Planlandı 📅";
            message = `${updatedRecord.vehicle.plate} plakalı aracın ${updatedRecord.type} bakımı için tarih belirlendi.`;
            type = "INFO";
            break;
        }

        await createNotification(
          { companyId: foundRecord.vehicle.companyId! },
          {
            title,
            message,
            type,
            link: `/dashboard/vehicles/${updatedRecord.vehicle.id}`,
          }
        );
      }

      await invalidateVehicleCache(companyId, foundRecord.vehicle.id);
      return updatedRecord;
    });
  }
);
