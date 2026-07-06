"use server";

import { db } from "../../db";
import { checkPermission } from "../utils/checkPermission";
import { DocumentType, DocumentStatus } from "@prisma/client";
import { sendNotificationAction as createNotification } from "@/app/lib/actions/notifications";
import { authenticatedAction } from "../../auth-middleware";
import { CreateDriverFormData } from "../../type/driver";
import { controllerGuard } from "../utils/controllerGuard";
import { createDriverSchema, updateDriverSchema } from "../../validation/serverSchemas";
import { ConflictError, NotFoundError } from "../../errors";
import { driverCache } from "./shared";

export const getDriverById = authenticatedAction(
  async (user, driverId: string) => {
    return controllerGuard("getDriverById", async () => {
      const companyId = user?.companyId || "";
      await checkPermission(user, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const foundDriver = await db.driver.findUnique({
        where: { id: driverId },
        include: {
          user: true,
          currentVehicle: true,
          company: true,
          homeBaseWarehouse: true,
          shipments: true,
          documents: true,
        },
      });

      if (!foundDriver || foundDriver.companyId !== companyId) {
        throw new NotFoundError("Driver");
      }

      return foundDriver;
    });
  }
);

export const createDriver = authenticatedAction(
  async (user, data: CreateDriverFormData) => {
    return controllerGuard("createDriver", async () => {
      const companyId = user?.companyId || "";
      await checkPermission(user, companyId, ["role_admin", "role_manager"]);

      const parsed = createDriverSchema.parse(data);

      const targetUser = await db.user.findUnique({
        where: { id: parsed.userId },
        include: { driver: true },
      });

      if (!targetUser || targetUser.companyId !== companyId) {
        throw new NotFoundError("User not found or unauthorized");
      }

      if (targetUser.driver) {
        throw new ConflictError("User is already assigned as a driver");
      }

      if (parsed.employeeId) {
        const existingEmployee = await db.driver.findUnique({
          where: {
            companyId_employeeId: { companyId, employeeId: parsed.employeeId },
          },
        });
        if (existingEmployee) {
          throw new ConflictError("A driver with this Employee ID already exists");
        }
      }

      if (parsed.currentVehicleId) {
        const vehicle = await db.vehicle.findUnique({
          where: { id: parsed.currentVehicleId },
          include: { driver: true },
        });
        if (!vehicle) {
          throw new NotFoundError("Selected vehicle");
        }
        if (vehicle.driver && vehicle.driver.userId !== parsed.userId) {
          throw new ConflictError("Vehicle is already assigned to another driver");
        }
      }

      await db.$transaction(async (tx) => {
        const finalEmployeeId =
          parsed.employeeId && parsed.employeeId.trim() !== ""
            ? parsed.employeeId
            : `EMP-${Math.random().toString(36).substring(2, 7).toLocaleUpperCase('en-US')}`;

        await tx.driver.create({
          data: {
            companyId: user.companyId!,
            userId: parsed.userId,
            phone: parsed.phone,
            employeeId: finalEmployeeId,
            licenseNumber: parsed.licenseNumber,
            licenseType: parsed.licenseType,
            licenseExpiry: parsed.licenseExpiry,
            status: parsed.status,
            currentVehicleId: parsed.currentVehicleId,
            homeBaseWarehouseId: parsed.homeBaseWarehouseId,
            languages: parsed.languages ?? [],
            hazmatCertified: parsed.hazmatCertified ?? false,
            safetyScore: 100,
            efficiencyScore: 100,
            rating: 5.0,
            documents: {
              create: [
                ...(parsed.licensePhotoUrl
                  ? [
                      {
                        type: DocumentType.LICENSE,
                        name: "License Scan",
                        url: parsed.licensePhotoUrl,
                        companyId,
                        status: DocumentStatus.ACTIVE,
                      },
                    ]
                  : []),
                ...(parsed.documents?.map((doc) => ({
                  type: doc.type as DocumentType,
                  name: doc.name,
                  url: doc.url,
                  expiryDate: doc.expiryDate,
                  companyId: user.companyId!,
                  status: DocumentStatus.ACTIVE,
                })) ?? []),
              ],
            },
          },
        });

        await tx.user.update({
          where: { id: parsed.userId },
          data: { roleId: "role_driver" },
        });
      });

      await driverCache.invalidate(companyId);

      // Dispatch Notification for new driver
      const driverUser = await db.user.findUnique({ where: { id: parsed.userId }, select: { name: true, surname: true } });
      await createNotification(
        { companyId },
        {
          title: "Yeni Sürücü Aramıza Katıldı! 🚛",
          message: `${driverUser?.name} ${driverUser?.surname} sisteme yeni sürücü olarak eklendi.`,
          type: "SUCCESS",
          link: `/dashboard/drivers`,
        }
      );

      return { success: true };
    });
  }
);

export const updateDriver = authenticatedAction(
  async (user, driverId: string, data: Partial<CreateDriverFormData>) => {
    return controllerGuard("updateDriver", async () => {
      const companyId = user?.companyId || "";
      await checkPermission(user, companyId, ["role_admin", "role_manager"]);

      const parsed = updateDriverSchema.parse(data);

      const foundDriver = await db.driver.findUnique({
        where: { id: driverId },
      });

      if (!foundDriver || foundDriver.companyId !== companyId) {
        throw new NotFoundError("Driver");
      }

      if (parsed.currentVehicleId) {
        const vehicle = await db.vehicle.findUnique({
          where: { id: parsed.currentVehicleId },
          include: { driver: true },
        });
        if (!vehicle) {
          throw new NotFoundError("Selected vehicle");
        }
        if (vehicle.driver && vehicle.driver.userId !== foundDriver.userId) {
          throw new ConflictError("Vehicle is already assigned to another driver");
        }
      }

      const updatedDriver = await db.driver.update({
        where: { id: driverId },
        data: {
          phone: parsed.phone,
          employeeId:
            parsed.employeeId && parsed.employeeId.trim() !== ""
              ? parsed.employeeId
              : parsed.employeeId === ""
                ? `EMP-${Math.random().toString(36).substring(2, 7).toLocaleUpperCase('en-US')}`
                : foundDriver.employeeId,
          licenseNumber: parsed.licenseNumber,
          licenseType: parsed.licenseType,
          licenseExpiry: parsed.licenseExpiry,
          status: parsed.status,
          ...(parsed.currentVehicleId !== undefined
            ? { currentVehicleId: parsed.currentVehicleId }
            : {}),
          ...(parsed.homeBaseWarehouseId !== undefined
            ? { homeBaseWarehouseId: parsed.homeBaseWarehouseId }
            : {}),
          ...(parsed.languages !== undefined
            ? { languages: parsed.languages }
            : {}),
          ...(parsed.hazmatCertified !== undefined
            ? { hazmatCertified: parsed.hazmatCertified }
            : {}),
          ...(parsed.licensePhotoUrl
            ? {
                documents: {
                  create: [
                    {
                      type: DocumentType.LICENSE,
                      name: "License Scan",
                      url: parsed.licensePhotoUrl,
                      companyId: user.companyId!,
                      status: DocumentStatus.ACTIVE,
                    },
                  ],
                },
              }
            : {}),
          ...(parsed.documents && parsed.documents.length > 0
            ? {
                documents: {
                  create: parsed.documents.map((doc) => ({
                    type: doc.type as DocumentType,
                    name: doc.name,
                    url: doc.url,
                    expiryDate: doc.expiryDate,
                    companyId: user.companyId!,
                    status: DocumentStatus.ACTIVE,
                  })),
                },
              }
            : {}),
        },
      });

      await driverCache.invalidate(companyId, driverId);
      return updatedDriver;
    });
  }
);

export const deleteDriver = authenticatedAction(
  async (user, driverId: string) => {
    return controllerGuard("deleteDriver", async () => {
      const companyId = user?.companyId || "";
      await checkPermission(user, companyId, ["role_admin", "role_manager"]);

      const foundDriver = await db.driver.findUnique({
        where: { id: driverId },
        select: { userId: true, companyId: true },
      });

      if (!foundDriver || foundDriver.companyId !== companyId) {
        throw new NotFoundError("Driver");
      }

      await db.$transaction(async (tx) => {
        const defaultRole = await tx.role.findFirst({
          where: { name: { contains: "DEFAULT", mode: "insensitive" } },
        });

        await tx.driver.delete({
          where: { id: driverId },
        });

        await tx.user.update({
          where: { id: foundDriver.userId },
          data: { roleId: defaultRole?.id ?? null },
        });
      });

      await driverCache.invalidate(companyId, driverId);
      return { success: true };
    });
  }
);
