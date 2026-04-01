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

  // Separate effect for cleaning up when user changes or logs out
  useEffect(() => {
    if (!user?.id) {
      setNotificationMap({});
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    setLoading(true);

    const paths = [
      { key: "everybody", path: "notifications/groups/everyone" },
      { key: "personal", path: `notifications/inbox/${user.id}` },
      ...(user.companyId ? [{ key: "company", path: `notifications/groups/company_${user.companyId}` }] : []),
      ...(user.companyId && user.roleName ? [{ key: "role", path: `notifications/groups/company_${user.companyId}_role_${user.roleName}` }] : []),
    ];

    const listeners: Array<{ nodeRef: ReturnType<typeof ref>; listener: (snap: DataSnapshot) => void; path: string }> = [];

    paths.forEach(({ path }) => {
      const nodeRef = ref(db, path);
      const listener = (snapshot: DataSnapshot) => {
        const data = snapshot.val() as Record<string, Omit<Notification, "id" | "_sourcePath">> | null;
        
        setNotificationMap(prev => {
          const next = { ...prev };
          
          // Clear current path's entries before rebuilding to ensure sync
          Object.keys(next).forEach(k => {
            if (next[k]._sourcePath === path) delete next[k];
          });

          if (data) {
            Object.entries(data).forEach(([id, val]) => {
              next[`${path}_${id}`] = { ...val, id, _sourcePath: path } as Notification;
            });
          }
          return next;
        });
        setLoading(false);
      };

      onValue(nodeRef, listener, (err) => {
        console.error(`Sub error [${path}]:`, err);
        setLoading(false);
      });

      listeners.push({ nodeRef, listener, path });
    });

    return () => {
      listeners.forEach(({ nodeRef, listener }) => off(nodeRef, "value", listener));
    };
  }, [user?.id, user?.companyId, user?.roleName]);

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
