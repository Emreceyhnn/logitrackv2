"use server";

import { adminDb } from "@/app/lib/firebase-admin";
import { Notification, NotificationTarget } from "../type/notification";
import { db } from "../db";
import { Prisma } from "@prisma/client";

export async function sendNotificationAction(
  target: NotificationTarget,
  notification: Omit<Notification, "id" | "createdAt" | "isRead">
) {
  try {
    if (!adminDb) {
      console.warn(
        "⚠️ Firebase Admin SDK not initialized. Skipping notification."
      );
      return { success: false, error: "Firebase not initialized" };
    }
    let path = "";

    if (
      target.companyId &&
      !target.userId &&
      !target.isGlobal &&
      notification.category
    ) {
      console.log(
        `[sendNotificationAction] 🎯 Targeted broadcast for category: ${notification.category}`
      );

      const whereClause: Prisma.UserWhereInput = {
        companyId: target.companyId,
        ...(target.roleId ? { roleId: target.roleId } : {}),
      };

      if (notification.category === "SHIPMENT_UPDATE")
        whereClause.notifEmailShipment = true;
      if (notification.category === "MAINTENANCE_ALERT")
        whereClause.notifEmailMaint = true;
      if (notification.category === "NEW_ASSIGNMENT")
        whereClause.notifPushAssignment = true;
      if (notification.category === "DELAY_ALERT")
        whereClause.notifPushDelay = true;

      const users = await db.user.findMany({
        where: whereClause,
        select: { id: true },
      });

      const promises = users.map(async (u) => {
        const personalPath = `notifications/inbox/${u.id}`;
        if (!adminDb) return;
        const ref = adminDb.ref(personalPath).push();
        return ref.set({
          ...notification,
          id: ref.key!,
          createdAt: Date.now(),
          isRead: false,
        });
      });

      await Promise.all(promises);
      return { success: true };
    }

    if (target.isGlobal) {
      path = "notifications/groups/everyone";
    } else if (target.userId) {
      path = `notifications/inbox/${target.userId}`;
    } else if (target.companyId) {
      if (target.roleId) {
        path = `notifications/groups/company_${target.companyId}_role_${target.roleId}`;
      } else {
        path = `notifications/groups/company_${target.companyId}`;
      }
    }

    if (!path) throw new Error("Invalid notification target");

    const newNotificationRef = adminDb.ref(path).push();
    const newNotification: Notification = {
      ...notification,
      id: newNotificationRef.key!,
      createdAt: Date.now(),
      isRead: false,
    };

    await newNotificationRef.set(newNotification);
    return { success: true, id: newNotificationRef.key };
  } catch (error) {
    console.error("Failed to send notification via Admin SDK:", error);
    return { success: false, error: String(error) };
  }
}

export async function markAsReadAction(path: string, notificationId: string) {
  try {
    if (!adminDb) throw new Error("Firebase not initialized");
    await adminDb.ref(`${path}/${notificationId}`).update({ isRead: true });
    return { success: true };
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    return { success: false, error: String(error) };
  }
}

export async function deleteNotificationAction(
  path: string,
  notificationId: string
) {
  try {
    if (!adminDb) throw new Error("Firebase not initialized");
    await adminDb.ref(`${path}/${notificationId}`).remove();
    return { success: true };
  } catch (error) {
    console.error("Failed to delete notification:", error);
    return { success: false, error: String(error) };
  }
}
