"use server";

import { db } from "../../db";
import { authenticatedAction } from "../../auth-middleware";
import { logAuditEvent } from "../session";
import { headers } from "next/headers";
import { controllerGuard } from "../utils/controllerGuard";

export const updateUserRegionalSettings = authenticatedAction(
  async (
    user,
    settings: {
      timezone: string;
      dateFormat: string;
      timeFormat: string;
      language?: string;
      currency?: string;
    }
  ) => {
    return controllerGuard("updateUserRegionalSettings", async () => {
      const updatedUser = await db.user.update({
        where: { id: user.id },
        data: {
          timezone: settings.timezone,
          dateFormat: settings.dateFormat,
          timeFormat: settings.timeFormat,
          language: settings.language || "en",
          ...(settings.currency ? { currency: settings.currency } : {}),
        },
      });

      const headerStore = await headers();
      const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || headerStore.get("x-real-ip") || "127.0.0.1";
      const userAgent = headerStore.get("user-agent") || "Unknown Device";

      // Log audit event
      await logAuditEvent({
        userId: user.id,
        action: "SETTINGS_UPDATE",
        ipAddress: ip,
        deviceInfo: userAgent,
        metadata: { ...settings, type: "regional_settings_update" },
      });

      return { success: true, user: updatedUser };
    });
  }
);

export const updateUserNotificationSettings = authenticatedAction(
  async (
    user,
    settings: {
      emailShipmentUpdates: boolean;
      emailMaintenanceAlerts: boolean;
      emailWeeklyReports: boolean;
      pushNewAssignments: boolean;
      pushDelayAlerts: boolean;
    }
  ) => {
    return controllerGuard("updateUserNotificationSettings", async () => {
      const updatedUser = await db.user.update({
        where: { id: user.id },
        data: {
          notifEmailShipment: settings.emailShipmentUpdates,
          notifEmailMaint: settings.emailMaintenanceAlerts,
          notifEmailWeekly: settings.emailWeeklyReports,
          notifPushAssignment: settings.pushNewAssignments,
          notifPushDelay: settings.pushDelayAlerts,
        },
      });

      const headerStore = await headers();
      const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || headerStore.get("x-real-ip") || "127.0.0.1";
      const userAgent = headerStore.get("user-agent") || "Unknown Device";

      // Log audit event
      await logAuditEvent({
        userId: user.id,
        action: "SETTINGS_UPDATE",
        ipAddress: ip,
        deviceInfo: userAgent,
        metadata: { ...settings, type: "notification_settings_update" },
      });

      return { success: true, user: updatedUser };
    });
  }
);
