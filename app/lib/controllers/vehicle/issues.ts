"use server";

import { db } from "../../db";
import {
  Issue,
  IssueStatus,
  IssuePriority,
  IssueType,
} from "@prisma/client";
import { sendNotificationAction as createNotification } from "@/app/lib/actions/notifications";
import { checkPermission } from "../utils/checkPermission";
import { authenticatedAction } from "../../auth-middleware";
import { invalidateVehicleCache } from "./cache";
import { controllerGuard } from "../utils/controllerGuard";

export const createVehicleIssue = authenticatedAction(
  async (
    user,
    vehicleId: string,
    issueData: {
      title: string;
      type: IssueType;
      priority: IssuePriority;
      description?: string | undefined;
    }
  ) => {
    const companyId = user?.companyId || "";
    return controllerGuard("createVehicleIssue", async () => {
      await checkPermission(user, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
        "role_driver",
      ]);

      const foundVehicle = await db.vehicle.findUnique({
        where: { id: vehicleId },
        select: { companyId: true, plate: true },
      });

      if (!foundVehicle || foundVehicle.companyId !== companyId) {
        throw new Error("Vehicle not found or unauthorized");
      }

      const issue = await db.issue.create({
        data: {
          title: issueData.title,
          type: issueData.type,
          priority: issueData.priority,
          description: issueData.description || null,
          status: IssueStatus.OPEN,
          vehicleId,
          companyId,
        },
      });

      await invalidateVehicleCache(companyId, vehicleId);

      // Dispatch Notification
      const priorityMap: Record<string, string> = {
        CRITICAL: "KRİTİK 🚨",
        HIGH: "Yüksek Öncelikli ⚠️",
        MEDIUM: "Orta Öncelikli 🛠️",
        LOW: "Düşük Öncelikli ℹ️",
      };

      await createNotification(
        { companyId: companyId! },
        {
          title: `${priorityMap[issueData.priority] || "Yeni"} Araç Sorunu Bildirildi!`,
          message: `${foundVehicle.plate} plakalı araç için ${issueData.type} arızası bildirildi: ${issueData.title}`,
          type: issueData.priority === "CRITICAL" ? "ERROR" : "WARNING",
          category: "MAINTENANCE_ALERT",
          link: `/dashboard/vehicles/${vehicleId}`,
        }
      );

      return issue;
    });
  }
);

export const getOpenIssuesForUser = authenticatedAction(async (user) => {
  const companyId = user?.companyId || "";
  return controllerGuard("getOpenIssuesForUser", async () => {
    await checkPermission(user, companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
      "role_driver",
    ]);

    if (!companyId) throw new Error("User has no company");

    const vehiclesWithIssues = await db.vehicle.findMany({
      where: { companyId },
      include: {
        issues: {
          where: {
            status: { in: ["OPEN", "IN_PROGRESS"] },
          },
          orderBy: { createdAt: "desc" },
          include: {
            vehicle: {
              select: { plate: true },
            },
          },
        },
      },
    });

    const issues: Issue[] = [];
    vehiclesWithIssues.forEach((v) => {
      if (v.issues && v.issues.length > 0) {
        issues.push(...v.issues);
      }
    });

    return issues.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, { fallback: [] });
});

export const updateIssue = authenticatedAction(
  async (
    user,
    issueId: string,
    data: {
      status?: IssueStatus;
      priority?: IssuePriority;
      description?: string;
    }
  ) => {
    const companyId = user?.companyId || "";
    return controllerGuard("updateIssue", async () => {
      await checkPermission(user, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const foundIssue = await db.issue.findUnique({
        where: { id: issueId },
        select: { companyId: true, vehicleId: true },
      });

      if (!foundIssue || foundIssue.companyId !== companyId) {
        throw new Error("Issue not found or unauthorized");
      }

      const updatedIssue = await db.issue.update({
        where: { id: issueId },
        data,
        include: { vehicle: { select: { plate: true } } },
      });

      await invalidateVehicleCache(
        companyId,
        foundIssue.vehicleId ?? undefined
      );

      // Dispatch Notification for status changes
      if (data.status === "IN_PROGRESS") {
        await createNotification(
          { companyId: companyId! },
          {
            title: "Sorun Üzerinde Çalışılıyor 🛠️",
            message: `${updatedIssue.vehicle?.plate} plakalı aracın ${updatedIssue.title} arızası için çalışmalar başladı.`,
            type: "INFO",
            link: `/dashboard/vehicles/${foundIssue.vehicleId}`,
          }
        );
      } else if (data.status === "RESOLVED" || data.status === "CLOSED") {
        await createNotification(
          { companyId: companyId! },
          {
            title: "Sorun Giderildi! ✅",
            message: `${updatedIssue.vehicle?.plate} plakalı aracın ${updatedIssue.title} arızası giderildi.`,
            type: "SUCCESS",
            link: `/dashboard/vehicles/${foundIssue.vehicleId}`,
          }
        );
      }

      return updatedIssue;
    });
  }
);
