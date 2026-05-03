import { db as firebase, ref, update, push } from "./firebase";
import { db as prisma } from "./db";

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
 * Creates and dispatches notifications.
 * Implements a "Fan-out on Write" pattern to ensure each user gets a personal copy
 * in their inbox, supporting offline persistence and individual read states.
 */
export const createNotification = async (
  target: NotificationTarget,
  payload: NotificationPayload
) => {
  try {
    const targetUserIds: string[] = [];

    // 1. Resolve Target Users
    if (target.isGlobal) {
      const allUsers = await prisma.user.findMany({
        where: { status: "ACTIVE" },
        select: { id: true },
      });
      targetUserIds.push(...allUsers.map((u) => u.id));
    } else if (target.userId) {
      targetUserIds.push(target.userId);
    } else if (target.companyId) {
      const companyUsers = await prisma.user.findMany({
        where: {
          companyId: target.companyId,
          status: "ACTIVE",
          ...(target.roleName ? { role: { name: target.roleName } } : {}),
        },
        select: { id: true },
      });
      targetUserIds.push(...companyUsers.map((u) => u.id));
    }

    if (targetUserIds.length === 0) {
      // If no users found for a specific target, we return success as there's nothing to do
      return { success: true, count: 0, message: "No target users found" };
    }

    // 2. Prepare Updates
    const updates: Record<string, unknown> = {};
    const notificationId = Date.now().toString(36) + Math.random().toString(36).substring(2);

    targetUserIds.forEach((uid) => {
      const path = `notifications/inbox/${uid}/${notificationId}`;
      updates[path] = {
        ...payload,
        id: notificationId,
        createdAt: Date.now(),
        isRead: false,
      };
    });

    // 3. Batch Update Firebase
    await update(ref(firebase), updates);

    return { 
      success: true, 
      notificationId, 
      recipientCount: targetUserIds.length,
      targetType: target.isGlobal ? "GLOBAL" : target.companyId ? "COMPANY" : "USER"
    };
  } catch (error) {
    console.error("Failed to send notification fan-out:", error);
    throw error;
  }
};

