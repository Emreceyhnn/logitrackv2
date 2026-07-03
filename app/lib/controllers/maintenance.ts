"use server";

import { db } from "../db";
import { authenticatedAction } from "../auth-middleware";
import { checkPermission } from "./utils/checkPermission";
import type { MaintenanceStatus, MaintenanceType, Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { sendNotificationAction as createNotification } from "@/app/lib/actions/notifications";
import { getExchangeRates } from "@/app/lib/services/exchangeRate";

/** Decimal columns are not serializable across the server-action boundary. */
function serializeRecord<T extends { cost: Prisma.Decimal; originalCost: Prisma.Decimal | null }>(
  record: T
) {
  return {
    ...record,
    cost: Number(record.cost),
    originalCost: record.originalCost === null ? null : Number(record.originalCost),
  };
}

export const createMaintenanceRecord = authenticatedAction(
  async (
    user,
    vehicleId: string,
    type: MaintenanceType,
    date: Date,
    cost: number,
    description?: string,
    currency: string = "USD",
    documentUrl?: string
  ) => {
    const companyId = user?.companyId || "";
    try {
      await checkPermission(user, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const vehicle = await db.vehicle.findUnique({
        where: { id: vehicleId },
        select: { companyId: true },
      });

      if (!vehicle || vehicle.companyId !== companyId) {
        throw new Error(
          "Invalid vehicle or vehicle does not belong to this company"
        );
      }

      // Normalize cost to USD, keeping the original amount for auditability
      let normalizedCost = cost;
      if (currency && currency !== "USD") {
        try {
          const rates = await getExchangeRates();
          const rate = rates.rates[currency] || 1;
          normalizedCost = cost / rate;
        } catch (err) {
          console.warn("[maintenance] Currency conversion failed:", err);
        }
      }

      const newRecord = await db.maintenanceRecord.create({
        data: {
          vehicleId,
          companyId,
          type,
          date,
          cost: normalizedCost,
          originalCost: cost,
          originalCurrency: currency || "USD",
          description,
          currency: "USD",
          documentUrl,
        },
        include: { vehicle: { select: { plate: true } } },
      });

      // Dispatch Notification
      await createNotification(
        { companyId },
        {
          title: "Yeni Bakım Kaydı 👨‍🔧",
          message: `${newRecord.vehicle.plate} plakalı araç için ${type} bakımı planlandı.`,
          type: "INFO",
          category: "MAINTENANCE_ALERT",
          link: `/dashboard/vehicles/${vehicleId}`,
        }
      );

      return { maintenanceRecord: serializeRecord(newRecord) };
    } catch (error) {
      console.error("Failed to create maintenance record:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to create maintenance record"
      );
    }
  }
);

export const getMaintenanceRecords = authenticatedAction(
  async (user, vehicleId?: string) => {
    const companyId = user?.companyId || "";
    try {
      await checkPermission(user, companyId, ["role_admin", "role_manager"]);

      const whereClause: Prisma.MaintenanceRecordWhereInput = { companyId };

      if (vehicleId) {
        whereClause.vehicleId = vehicleId;
      }

      const records = await db.maintenanceRecord.findMany({
        where: whereClause,
        include: {
          vehicle: {
            select: {
              plate: true,
              brand: true,
              model: true,
            },
          },
        },
        orderBy: { date: "desc" },
      });
      return records.map(serializeRecord);
    } catch (error) {
      console.error("Failed to get maintenance records:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to get maintenance records"
      );
    }
  }
);

export const getMaintenanceRecordById = authenticatedAction(
  async (user, recordId: string) => {
    const companyId = user?.companyId || "";
    try {
      await checkPermission(user, companyId, ["role_admin", "role_manager"]);
      const record = await db.maintenanceRecord.findUnique({
        where: { id: recordId },
        include: {
          vehicle: true,
        },
      });

      if (!record) throw new Error("Maintenance record not found");

      if (record.companyId !== companyId) {
        throw new Error("Unauthorized");
      }

      return serializeRecord(record);
    } catch (error) {
      console.error("Failed to get maintenance record:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to get maintenance record"
      );
    }
  }
);

export interface MaintenanceRecordUpdateData {
  type?: MaintenanceType;
  date?: Date;
  cost?: number;
  currency?: string;
  status?: MaintenanceStatus;
  description?: string;
  documentUrl?: string;
}

export const updateMaintenanceRecord = authenticatedAction(
  async (user, recordId: string, data: MaintenanceRecordUpdateData) => {
    const companyId = user?.companyId || "";
    try {
      await checkPermission(user, companyId, ["role_admin", "role_manager"]);
      const existingRecord = await db.maintenanceRecord.findUnique({
        where: { id: recordId },
        select: {
          status: true,
          type: true,
          companyId: true,
          vehicle: {
            select: {
              plate: true,
            },
          },
        },
      });

      if (!existingRecord || existingRecord.companyId !== companyId)
        throw new Error("Maintenance record not found");

      // Normalize cost to USD if provided, keeping the original amount
      const finalData: Prisma.MaintenanceRecordUpdateInput = { ...data };

      if (data.cost !== undefined && data.currency && data.currency !== "USD") {
        try {
          const rates = await getExchangeRates();
          const rate = rates.rates[data.currency] || 1;
          finalData.cost = data.cost / rate;
          finalData.originalCost = data.cost;
          finalData.originalCurrency = data.currency;
          finalData.currency = "USD";
        } catch (err) {
          console.warn("[maintenance] Currency conversion failed in update:", err);
        }
      } else if (data.cost !== undefined) {
        finalData.originalCost = data.cost;
        finalData.originalCurrency = data.currency || "USD";
        finalData.currency = "USD";
      } else if (data.currency) {
        finalData.currency = "USD";
      }

      const updatedRecord = await db.maintenanceRecord.update({
        where: { id: recordId },
        data: finalData,
        include: { vehicle: { select: { plate: true, id: true } } },
      });

      // Dispatch Notification if status changed
      const oldStatus = existingRecord.status;
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
          { companyId },
          {
            title,
            message,
            type,
            category: "MAINTENANCE_ALERT",
            link: `/dashboard/vehicles/${updatedRecord.vehicle.id}`,
          }
        );
      }

      return serializeRecord(updatedRecord);
    } catch (error) {
      console.error("Failed to update maintenance record:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to update maintenance record"
      );
    }
  }
);

export const deleteMaintenanceRecord = authenticatedAction(
  async (user, recordId: string) => {
    const companyId = user?.companyId || "";
    try {
      await checkPermission(user, companyId, ["role_admin", "role_manager"]);
      const existingRecord = await db.maintenanceRecord.findUnique({
        where: { id: recordId },
        select: {
          type: true,
          vehicleId: true,
          companyId: true,
          vehicle: {
            select: {
              plate: true,
            },
          },
        },
      });

      if (!existingRecord || existingRecord.companyId !== companyId)
        throw new Error("Maintenance record not found");

      await db.maintenanceRecord.delete({
        where: { id: recordId },
      });

      // Dispatch Notification
      await createNotification(
        { companyId },
        {
          title: "Bakım Kaydı Silindi 🗑️",
          message: `${existingRecord.vehicle.plate} plakalı araca ait ${existingRecord.type} bakımı kaydı sistemden silindi.`,
          type: "WARNING",
          category: "MAINTENANCE_ALERT",
          link: `/dashboard/vehicles/${existingRecord.vehicleId}`,
        }
      );

      return { success: true };
    } catch (error) {
      console.error("Failed to delete maintenance record:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to delete maintenance record"
      );
    }
  }
);

export const getMaintenanceStats = authenticatedAction(async (user) => {
  const companyId = user?.companyId || "";
  try {
    await checkPermission(user, companyId, [
      "role_admin",
      "role_manager",
      "role_driver",
      "role_warehouse",
    ]);

    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31);

    const records = await db.maintenanceRecord.findMany({
      where: {
        companyId,
        date: {
          gte: startOfYear,
          lte: endOfYear,
        },
      },
      select: {
        cost: true,
        type: true,
        date: true,
      },
    });

    const totalCost = records.reduce((sum, record) => sum + Number(record.cost), 0);

    const costByType: Record<string, number> = {};
    records.forEach((record) => {
      costByType[record.type] = (costByType[record.type] || 0) + Number(record.cost);
    });

    return {
      totalCost,
      costByType,
      recordCount: records.length,
    };
  } catch (error) {
    console.error("Failed to get maintenance stats:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get maintenance stats"
    );
  }
});

/**
 * Scans for scheduled maintenance records in the next 3 days and sends notifications.
 * This can be triggered by a cron job or a dashboard load.
 */
export const checkUpcomingMaintenance = authenticatedAction(async (user) => {
  const companyId = user?.companyId;
  if (!companyId) return;

  try {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const upcomingRecords = await db.maintenanceRecord.findMany({
      where: {
        companyId,
        status: "SCHEDULED",
        date: {
          gte: new Date(),
          lte: threeDaysFromNow,
        },
      },
      include: {
        vehicle: {
          select: { plate: true, id: true },
        },
      },
    });

    for (const record of upcomingRecords) {
      await createNotification(
        { companyId },
        {
          title: "Yaklaşan Bakım Uyarısı! ⏳",
          message: `${record.vehicle.plate} plakalı aracın ${record.type} bakımı yaklaşıyor (Tarih: ${dayjs(record.date).format("DD.MM.YYYY")}).`,
          type: "WARNING",
          category: "MAINTENANCE_ALERT",
          link: `/dashboard/vehicles/${record.vehicle.id}`,
        }
      );
    }

    return { count: upcomingRecords.length };
  } catch (error) {
    console.error("Failed to check upcoming maintenance:", error);
    return { error: "Failed to check upcoming maintenance" };
  }
});
