"use server";

import { db } from "../../db";
import { checkPermission } from "../utils/checkPermission";
import { authenticatedAction } from "../../auth-middleware";
import { controllerGuard } from "../utils/controllerGuard";

export const getCompanyUsers = authenticatedAction(async (user) => {
  const companyId = user?.companyId || "";

  return controllerGuard("getCompanyUsers", async () => {
    await checkPermission(user, companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
      "role_driver",
      "role_warehouse",
    ]);

    const users = await db.user.findMany({
      where: { companyId },
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
        avatarUrl: true,
        roleId: true,
        status: true,
        companyId: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        timezone: true,
        dateFormat: true,
        timeFormat: true,
        currency: true,
        language: true,
      },
    });
    return users;
  });
});

export const getCompanyWarehouses = authenticatedAction(async (user) => {
  const companyId = user?.companyId || "";

  return controllerGuard("getCompanyWarehouses", async () => {
    await checkPermission(user, companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
      "role_warehouse",
    ]);

    const warehouses = await db.warehouse.findMany({
      where: { companyId },
    });
    return warehouses;
  });
});

export const getCompanyVehicles = authenticatedAction(async (user) => {
  const companyId = user?.companyId || "";

  return controllerGuard("getCompanyVehicles", async () => {
    await checkPermission(user, companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
      "role_warehouse",
    ]);

    const vehicles = await db.vehicle.findMany({
      where: { companyId, deletedAt: null },
    });
    return vehicles;
  });
});

export const getCompanyDrivers = authenticatedAction(async (user) => {
  const companyId = user?.companyId || "";

  return controllerGuard("getCompanyDrivers", async () => {
    await checkPermission(user, companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
      "role_warehouse",
    ]);

    const drivers = await db.driver.findMany({
      where: { companyId },
    });
    return drivers;
  });
});

export const getCompanyCustomers = authenticatedAction(async (user) => {
  const companyId = user?.companyId || "";

  return controllerGuard("getCompanyCustomers", async () => {
    await checkPermission(user, companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
      "role_warehouse",
    ]);

    const customers = await db.customer.findMany({
      where: { companyId },
    });
    return customers;
  });
});
