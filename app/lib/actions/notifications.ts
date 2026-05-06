"use server";

import { adminDb } from "@/app/lib/firebase-admin";
import { Notification, NotificationTarget } from "../notifications";

/**
 * Sends a notification to a specific target (user, company, or role)
 * using the Firebase Admin SDK to bypass client-side write restrictions.
 */
export async function sendNotificationAction(
  target: NotificationTarget,
  notification: Omit<Notification, "id" | "createdAt" | "isRead">
) {
  try {
    let path = "";

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

/**
 * Marks a specific notification as read.
 */
export async function markAsReadAction(path: string, notificationId: string) {
  try {
    await adminDb.ref(`${path}/${notificationId}`).update({ isRead: true });
    return { success: true };
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Deletes a specific notification.
 */
export async function deleteNotificationAction(path: string, notificationId: string) {
  try {
    await adminDb.ref(`${path}/${notificationId}`).remove();
    return { success: true };
  } catch (error) {
    console.error("Failed to delete notification:", error);
    return { success: false, error: String(error) };
  }
}
