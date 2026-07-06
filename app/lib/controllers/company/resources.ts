"use server";

import { db } from "../../db";
import { checkPermission } from "../utils/checkPermission";
import { authenticatedAction } from "../../auth-middleware";

export const getCompanyUsers = authenticatedAction(async (user) => {
  const companyId = user?.companyId || "";

  try {
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
  } catch (error) {
    console.error("Failed to get company users:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get company users"
    );
  }
});

export const getCompanyWarehouses = authenticatedAction(async (user) => {
  const companyId = user?.companyId || "";

  try {
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
  } catch (error) {
    console.error("Failed to get company warehouses:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to get company warehouses"
    );
  }
});

export const getCompanyVehicles = authenticatedAction(async (user) => {
  const companyId = user?.companyId || "";

  try {
    await checkPermission(user, companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
      "role_warehouse",
    ]);

    const vehicles = await db.vehicle.findMany({
      where: { companyId },
    });
    return vehicles;
  } catch (error) {
    console.error("Failed to get company vehicles:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get company vehicles"
    );
  }
});

export const getCompanyDrivers = authenticatedAction(async (user) => {
  const companyId = user?.companyId || "";

  try {
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
  } catch (error) {
    console.error("Failed to get company drivers:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get company drivers"
    );
  }
});

export const getCompanyCustomers = authenticatedAction(async (user) => {
  const companyId = user?.companyId || "";

  try {
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
  } catch (error) {
    console.error("Failed to get company customers:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get company customers"
    );
  }
});
