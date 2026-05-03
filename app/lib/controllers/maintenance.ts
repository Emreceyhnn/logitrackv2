"use server";

import { db } from "../db";
import { authenticatedAction } from "../auth-middleware";
import { checkPermission } from "./utils/checkPermission";
import { Prisma } from "@prisma/client";
import { createNotification } from "@/app/lib/notifications";
import { getExchangeRates } from "@/app/lib/services/exchangeRate";

export const createMaintenanceRecord = authenticatedAction(
  async (
    user,
    vehicleId: string,
    type: string,
    date: Date,
    cost: number,
    description?: string,
    currency: string = "USD"
  ) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    try {
      await checkPermission(userId, companyId, [
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

      // Normalize cost to USD
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
          type,
          date,
          cost: normalizedCost,
          description,
          currency: "USD",
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
          link: `/dashboard/vehicles/${vehicleId}`,
        }
      );

      return { maintenanceRecord: newRecord };
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
    const userId = user?.id;
    const companyId = user?.companyId || "";
    try {
      await checkPermission(userId, companyId, ["role_admin", "role_manager"]);

      const whereClause: Prisma.MaintenanceRecordWhereInput = {
        vehicle: {
          companyId: companyId!,
        },
      };

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
      return records;
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
    const userId = user?.id;
    const companyId = user?.companyId || "";
    try {
      await checkPermission(userId, companyId, ["role_admin", "role_manager"]);
      const record = await db.maintenanceRecord.findUnique({
        where: { id: recordId },
        include: {
          vehicle: true,
        },
      });

      if (!record) throw new Error("Maintenance record not found");

      if (record.vehicle?.companyId) {
        await checkPermission(userId, record.vehicle.companyId, [
          "role_admin",
          "role_manager",
        ]);
      }

      return record;
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

export const updateMaintenanceRecord = authenticatedAction(
  async (user, recordId: string, data: Prisma.MaintenanceRecordUpdateInput) => {
    const userId = user?.id;
    const companyId = user?.companyId || "";
    try {
      await checkPermission(userId, companyId, ["role_admin", "role_manager"]);
      const existingRecord = await db.maintenanceRecord.findUnique({
        where: { id: recordId },
        select: {
          status: true,
          type: true,
          vehicle: {
            select: {
              companyId: true,
              plate: true,
            },
          },
        },
      });

      if (!existingRecord?.vehicle?.companyId)
        throw new Error("Maintenance record not found");

      await checkPermission(userId, existingRecord.vehicle.companyId, [
        "role_admin",
        "role_manager",
      ]);

      // Normalize cost to USD if provided
      let finalData = { ...data };
      const rawCost = typeof data.cost === 'number' ? data.cost : (data.cost as any)?.set;
      const rawCurrency = typeof data.currency === 'string' ? data.currency : (data.currency as any)?.set;

      if (rawCost !== undefined && rawCurrency && rawCurrency !== "USD") {
        try {
          const rates = await getExchangeRates();
          const rate = rates.rates[rawCurrency] || 1;
          const normalizedCost = rawCost / rate;
          finalData.cost = normalizedCost;
          finalData.currency = "USD";
        } catch (err) {
          console.warn("[maintenance] Currency conversion failed in update:", err);
        }
      } else if (rawCurrency) {
        finalData.currency = "USD";
      }

      const updatedRecord = await db.maintenanceRecord.update({
        where: { id: recordId },
        data: finalData,
        include: { vehicle: { select: { plate: true, id: true } } },
      });

      // Dispatch Notification if status changed
      const oldStatus = existingRecord.status;
      const newStatus = (typeof data.status === 'string' ? data.status : (data.status as any)?.set) || updatedRecord.status;

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
          { companyId: existingRecord.vehicle.companyId! },
          {
            title,
            message,
            type,
            link: `/dashboard/vehicles/${updatedRecord.vehicle.id}`,
          }
        );
      }

      return updatedRecord;
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
    const userId = user?.id;
    const companyId = user?.companyId || "";
    try {
      await checkPermission(userId, companyId, ["role_admin", "role_manager"]);
      const existingRecord = await db.maintenanceRecord.findUnique({
        where: { id: recordId },
        select: {
          type: true,
          vehicleId: true,
          vehicle: {
            select: {
              companyId: true,
              plate: true,
            },
          },
        },
      });

      if (!existingRecord?.vehicle?.companyId)
        throw new Error("Maintenance record not found");

      await checkPermission(userId, existingRecord.vehicle.companyId, [
        "role_admin",
        "role_manager",
      ]);

      await db.maintenanceRecord.delete({
        where: { id: recordId },
      });

      // Dispatch Notification
      await createNotification(
        { companyId: existingRecord.vehicle.companyId! },
        {
          title: "Bakım Kaydı Silindi 🗑️",
          message: `${existingRecord.vehicle.plate} plakalı araca ait ${existingRecord.type} bakımı kaydı sistemden silindi.`,
          type: "WARNING",
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
  const userId = user?.id;
  const companyId = user?.companyId || "";
  try {
    await checkPermission(userId, companyId, [
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
        vehicle: { companyId },
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

    const totalCost = records.reduce((sum, record) => sum + record.cost, 0);

    const costByType: Record<string, number> = {};
    records.forEach((record) => {
      costByType[record.type] = (costByType[record.type] || 0) + record.cost;
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
        vehicle: { companyId },
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
          message: `${record.vehicle.plate} plakalı aracın ${record.type} bakımı yaklaşıyor (Tarih: ${record.date.toLocaleDateString()}).`,
          type: "WARNING",
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
