export type NotificationType = "INFO" | "WARNING" | "ERROR" | "SUCCESS";

export interface NotificationTarget {
  userId?: string;
  companyId?: string;
  roleId?: string;
  isGlobal?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: number;
  isRead: boolean;
  link?: string;
  metadata?: Record<string, unknown>;
}
