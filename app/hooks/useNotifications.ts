"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { db, ref, onValue, off, update, type DataSnapshot } from "@/app/lib/firebase";
import { NotificationType } from "@/app/lib/notifications";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: number;
  isRead: boolean;
  link?: string;
  metadata?: Record<string, unknown>;
  _sourcePath?: string; // Internal tracking for marking as read
}

interface UserContext {
  id: string;
  companyId?: string | null;
  roleName?: string | null;
}

export const useNotifications = (user: UserContext | undefined) => {
  const [notificationMap, setNotificationMap] = useState<Record<string, Notification>>({});
  const [loading, setLoading] = useState(true);
  const [prevUserId, setPrevUserId] = useState(user?.id);

  if (user?.id !== prevUserId) {
    setPrevUserId(user?.id);
    if (!user?.id) {
      setNotificationMap({});
      setLoading(false);
    } else {
      setLoading(true);
    }
  }

  useEffect(() => {
    if (!user?.id) return;

    const path = `notifications/inbox/${user.id}`;
    const nodeRef = ref(db, path);

    const listener = (snapshot: DataSnapshot) => {
      const data = snapshot.val() as Record<string, Omit<Notification, "id">> | null;
      
      if (data) {
        const newNotifications: Record<string, Notification> = {};
        Object.entries(data).forEach(([id, val]) => {
          newNotifications[id] = { ...val, id, _sourcePath: path } as Notification;
        });
        setNotificationMap(newNotifications);
      } else {
        setNotificationMap({});
      }
      setLoading(false);
    };

    onValue(nodeRef, listener, (err) => {
      console.error(`Subscription error on [${path}]:`, err);
      setLoading(false);
    });

    return () => {
      off(nodeRef, "value", listener);
    };
  }, [user?.id]);


  const notifications = useMemo(() => {
    return Object.values(notificationMap).sort((a, b) => b.createdAt - a.createdAt);
  }, [notificationMap]);

  const unreadCount = useMemo(() => 
    notifications.filter((n) => !n.isRead).length
  , [notifications]);

  const markAsRead = useCallback(async (notification: Notification) => {
    if (!user?.id || !notification._sourcePath) return;
    try {
      const updates: Record<string, boolean> = {};
      updates[`${notification._sourcePath}/${notification.id}/isRead`] = true;
      await update(ref(db), updates);
    } catch (err) {
      console.error("Mark read failed:", err);
    }
  }, [user?.id]);

  const markAllAsRead = useCallback(async () => {
    if (!user?.id || notifications.length === 0) return;
    try {
      const updates: Record<string, boolean> = {};
      notifications.forEach((n) => {
        if (!n.isRead && n._sourcePath) {
          updates[`${n._sourcePath}/${n.id}/isRead`] = true;
        }
      });
      if (Object.keys(updates).length > 0) await update(ref(db), updates);
    } catch (err) {
      console.error("Mark all read failed:", err);
    }
  }, [user?.id, notifications]);

  const deleteNotification = useCallback(async (notification: Notification) => {
    if (!user?.id || !notification._sourcePath) return;
    try {
      const updates: Record<string, null> = {};
      updates[`${notification._sourcePath}/${notification.id}`] = null;
      await update(ref(db), updates);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }, [user?.id]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};
