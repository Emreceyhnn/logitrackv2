import { db as firebase, ref, update, push } from "./firebase";

export type NotificationType = "INFO" | "WARNING" | "ERROR" | "SUCCESS";

interface NotificationTarget {
  userId?: string;
  companyId?: string;
  roleName?: string;
  isGlobal?: boolean;
}

interface NotificationPayload {
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Sends a real-time notification via Firebase RTDB.
 * Supports individual inbox, company-wide groups, or role-based groups.
 * No Prisma dependency for delivery.
 */
export const createNotification = async (
  target: NotificationTarget,
  payload: NotificationPayload
) => {
  try {
    let path = "";

    // Determine the target path in Firebase
    if (target.isGlobal) {
      path = "notifications/groups/everyone";
    } else if (target.userId) {
      path = `notifications/inbox/${target.userId}`;
    } else if (target.companyId) {
      if (target.roleName) {
        path = `notifications/groups/company_${target.companyId}_role_${target.roleName}`;
      } else {
        path = `notifications/groups/company_${target.companyId}`;
      }
    }

    if (!path) {
      throw new Error("Invalid notification target. Must provide isGlobal, userId, or companyId.");
    }

    // Generate a unique key for the notification
    const notificationKey = push(ref(firebase, path)).key;
    if (!notificationKey) throw new Error("Failed to generate notification key");

    const notificationData = {
      ...payload,
      id: notificationKey,
      createdAt: Date.now(),
      isRead: false,
    };

    const updates: Record<string, unknown> = {};
    updates[`${path}/${notificationKey}`] = notificationData;

    await update(ref(firebase), updates);

    return { success: true, notificationId: notificationKey, path };
  } catch (error) {
    console.error("Failed to send notification:", error);
    throw error;
  }
};
