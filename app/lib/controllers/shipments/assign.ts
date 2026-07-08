"use server";

import { db } from "../../db";
import { authenticatedAction } from "../../auth-middleware";
import { checkPermission } from "../utils/checkPermission";
import { ShipmentStatus } from "@prisma/client";
import { sendNotificationAction as createNotification } from "@/app/lib/actions/notifications";
import { assertShipmentTransition } from "../utils/shipmentTransitions";
import { assertRouteCapacity } from "../utils/routeCapacity";
import { invalidateShipmentCache } from "./cache";
import { controllerGuard } from "../utils/controllerGuard";

export const assignDriverToShipment = authenticatedAction(
  async (user, shipmentId: string, driverId: string) => {
    const userId = user?.id;
    const companyId = user?.companyId;
    return controllerGuard("assignDriverToShipment", async () => {
      await checkPermission(user, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const existingShipment = await db.shipment.findUnique({
        where: { id: shipmentId },
        select: { companyId: true, status: true },
      });

      if (!existingShipment || existingShipment.companyId !== companyId) {
        throw new Error("Shipment not found or unauthorized");
      }

      assertShipmentTransition(
        existingShipment.status,
        ShipmentStatus.ASSIGNED
      );

      const driver = await db.driver.findFirst({
        where: { id: driverId, companyId },
        select: { status: true },
      });
      if (!driver) {
        throw new Error("Driver not found or unauthorized");
      }
      if (driver.status === "ON_LEAVE") {
        throw new Error("Driver is on leave and cannot be assigned");
      }

      const updatedShipment = await db.shipment.update({
        where: { id: shipmentId },
        data: {
          driverId,
          status: ShipmentStatus.ASSIGNED,
          history: {
            create: {
              status: ShipmentStatus.ASSIGNED,
              companyId: companyId!,
              description: `Driver assigned`,
              createdById: userId,
            },
          },
        },
      });

      await invalidateShipmentCache(companyId!, shipmentId);

      // Dispatch Notification
      await createNotification(
        { companyId: companyId! },
        {
          title: "Sürücü Atandı 👤",
          message: `${updatedShipment.trackingId} numaralı sevkiyata bir sürücü atandı.`,
          type: "SUCCESS",
          category: "NEW_ASSIGNMENT",
          link: `/dashboard/shipments/${updatedShipment.id}`,
        }
      );

      return updatedShipment;
    });
  }
);

export const assignRouteToShipment = authenticatedAction(
  async (user, shipmentId: string, routeId: string) => {
    const userId = user?.id;
    const companyId = user?.companyId;
    return controllerGuard("assignRouteToShipment", async () => {
      await checkPermission(user, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const existingShipment = await db.shipment.findUnique({
        where: { id: shipmentId },
        select: {
          companyId: true,
          status: true,
          weightKg: true,
          volumeM3: true,
        },
      });

      if (!existingShipment || existingShipment.companyId !== companyId) {
        throw new Error("Shipment not found or unauthorized");
      }

      assertShipmentTransition(
        existingShipment.status,
        ShipmentStatus.ASSIGNED
      );
      await assertRouteCapacity(
        db,
        routeId,
        companyId!,
        {
          weightKg: existingShipment.weightKg,
          volumeM3: existingShipment.volumeM3,
        },
        shipmentId
      );

      const updatedShipment = await db.shipment.update({
        where: { id: shipmentId },
        data: {
          routeId,
          status: ShipmentStatus.ASSIGNED,
          history: {
            create: {
              status: ShipmentStatus.ASSIGNED,
              companyId: companyId!,
              description: `Route assigned`,
              createdById: userId,
            },
          },
        },
      });

      await invalidateShipmentCache(companyId!, shipmentId);

      // Dispatch Notification
      await createNotification(
        { companyId: companyId! },
        {
          title: "Rota Planlandı 🚛",
          message: `${updatedShipment.trackingId} numaralı sevkiyat bir rotaya dahil edildi.`,
          type: "SUCCESS",
          category: "NEW_ASSIGNMENT",
          link: `/dashboard/shipments/${updatedShipment.id}`,
        }
      );

      return updatedShipment;
    });
  }
);

export const updateShipmentStatus = authenticatedAction(
  async (
    user,
    shipmentId: string,
    status: ShipmentStatus,
    location?: string,
    description?: string
  ) => {
    const userId = user?.id;
    const companyId = user?.companyId;
    return controllerGuard("updateShipmentStatus", async () => {
      await checkPermission(user, companyId);

      const existingShipment = await db.shipment.findUnique({
        where: { id: shipmentId },
        select: { companyId: true, status: true },
      });

      if (!existingShipment || existingShipment.companyId !== companyId) {
        throw new Error("Shipment not found or unauthorized");
      }

      assertShipmentTransition(existingShipment.status, status);
      if (existingShipment.status === status) {
        return db.shipment.findUniqueOrThrow({ where: { id: shipmentId } });
      }
      if (status === ShipmentStatus.FAILED && !description?.trim()) {
        throw new Error(
          "A failure reason (description) is required when marking a shipment as FAILED"
        );
      }

      const updatedShipment = await db.shipment.update({
        where: { id: shipmentId },
        data: {
          status,
          history: {
            create: {
              status,
              companyId: companyId!,
              location: location ?? null,
              description: description || `Status updated to ${status}`,
              createdById: userId,
            },
          },
        },
      });

      await invalidateShipmentCache(companyId!, shipmentId);

      // Dispatch Notification for critical status changes
      if (
        status === ShipmentStatus.DELAYED ||
        status === ShipmentStatus.CANCELLED
      ) {
        await createNotification(
          { companyId: companyId! },
          {
            title:
              status === ShipmentStatus.DELAYED
                ? "Sevkiyat Gecikmesi ⏳"
                : "Sevkiyat İptal Edildi ❌",
            message: `${updatedShipment.trackingId} numaralı sevkiyatın durumu ${status === ShipmentStatus.DELAYED ? "GECİKMİŞ" : "İPTAL EDİLDİ"} olarak güncellendi.`,
            type: status === ShipmentStatus.DELAYED ? "WARNING" : "ERROR",
            category:
              status === ShipmentStatus.DELAYED
                ? "DELAY_ALERT"
                : "SHIPMENT_UPDATE",
            link: `/dashboard/shipments/${updatedShipment.id}`,
          }
        );
      } else if (status === ShipmentStatus.DELIVERED) {
        await createNotification(
          { companyId: companyId! },
          {
            title: "Sevkiyat Teslim Edildi ✅",
            message: `${updatedShipment.trackingId} numaralı sevkiyat başarıyla teslim edildi.`,
            type: "SUCCESS",
            category: "SHIPMENT_UPDATE",
            link: `/dashboard/shipments/${updatedShipment.id}`,
          }
        );
      } else if (
        status === ShipmentStatus.PROCESSING ||
        status === ShipmentStatus.IN_TRANSIT
      ) {
        await createNotification(
          { companyId: companyId! },
          {
            title:
              status === ShipmentStatus.PROCESSING
                ? "Sevkiyat Hazırlanıyor ⚙️"
                : "Sevkiyat Yolda 🚛",
            message: `${updatedShipment.trackingId} numaralı sevkiyat ${status === ShipmentStatus.PROCESSING ? "işleme alındı" : "yola çıktı"}.`,
            type: "INFO",
            category: "SHIPMENT_UPDATE",
            link: `/dashboard/shipments/${updatedShipment.id}`,
          }
        );
      }

      return updatedShipment;
    });
  }
);
