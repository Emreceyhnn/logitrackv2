"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { db, ref, onValue, off, type DataSnapshot, type DatabaseReference } from "@/app/lib/firebase";
import { NotificationType } from "@/app/lib/notifications";
import { markAsReadAction, deleteNotificationAction } from "@/app/lib/actions/notifications";

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
  roleId?: string | null;
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

    const paths = [
      { key: "everybody", path: "notifications/groups/everyone" },
      { key: "personal", path: `notifications/inbox/${user.id}` },
      ...(user.companyId ? [{ key: "company", path: `notifications/groups/company_${user.companyId}` }] : []),
      ...(user.companyId && user.roleId ? [{ key: "role", path: `notifications/groups/company_${user.companyId}_role_${user.roleId}` }] : []),
    ];

    const listeners: Array<{ nodeRef: DatabaseReference; listener: (snap: DataSnapshot) => void; path: string }> = [];

    setLoading(true);
    let pathsLoaded = 0;

    paths.forEach(({ path }) => {
      const nodeRef = ref(db, path);
      const listener = (snapshot: DataSnapshot) => {
        const data = snapshot.val() as Record<string, Omit<Notification, "id">> | null;
        
        setNotificationMap(prev => {
          const next = { ...prev };
          // Remove old notifications from this path
          Object.keys(next).forEach(id => {
            if (next[id]._sourcePath === path) delete next[id];
          });
          // Add new ones
          if (data) {
            Object.entries(data).forEach(([id, val]) => {
              next[id] = { ...val, id, _sourcePath: path } as Notification;
            });
          }
          return next;
        });

        if (pathsLoaded < paths.length) {
          pathsLoaded++;
          if (pathsLoaded === paths.length) setLoading(false);
        }
      };

      onValue(nodeRef, listener, (err) => {
        console.error(`Subscription error on [${path}]:`, err);
        if (pathsLoaded < paths.length) {
          pathsLoaded++;
          if (pathsLoaded === paths.length) setLoading(false);
        }
      });

      listeners.push({ nodeRef, listener, path });
    });

    return () => {
      listeners.forEach(({ nodeRef, listener }) => off(nodeRef, "value", listener));
    };
  }, [user?.id, user?.companyId, user?.roleId]);

  const notifications = useMemo(() => {
    return Object.values(notificationMap).sort((a, b) => b.createdAt - a.createdAt);
  }, [notificationMap]);

  const unreadCount = useMemo(() => 
    notifications.filter((n) => !n.isRead).length
  , [notifications]);

  const markAsRead = useCallback(async (notification: Notification) => {
    if (!user?.id || !notification._sourcePath) return;
    try {
      await markAsReadAction(notification._sourcePath, notification.id);
    } catch (err) {
      console.error("Mark read failed:", err);
    }
  }, [user?.id]);

  const markAllAsRead = useCallback(async () => {
    if (!user?.id || notifications.length === 0) return;
    try {
      const promises = notifications
        .filter(n => !n.isRead && n._sourcePath)
        .map(n => markAsReadAction(n._sourcePath!, n.id));
      await Promise.all(promises);
    } catch (err) {
      console.error("Mark all read failed:", err);
    }
  }, [user?.id, notifications]);

  const deleteNotification = useCallback(async (notification: Notification) => {
    if (!user?.id || !notification._sourcePath) return;
    try {
      await deleteNotificationAction(notification._sourcePath, notification.id);
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
