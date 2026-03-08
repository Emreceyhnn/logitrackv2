"use server";

import { db } from "../db";
import { authenticatedAction } from "../auth-middleware";
import { checkPermission } from "./utils/checkPermission";
import { Prisma } from "@prisma/client";

export const createCustomer = authenticatedAction(
  async (
    user,
    name: string,
    code: string,
    industry?: string,
    taxId?: string,
    email?: string,
    phone?: string,
    address?: string,
    lat?: number,
    lng?: number
  ) => {
    try {
      await checkPermission(user.id, user.companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const existingCustomer = await db.customer.findUnique({
        where: { code },
      });

      if (existingCustomer) {
        throw new Error("Customer code already exists");
      }

      const newCustomer = await db.customer.create({
        data: {
          name,
          code,
          industry,
          taxId,
          email,
          phone,
          address,
          lat,
          lng,
          companyId: user.companyId,
        },
      });

      return { customer: newCustomer };
    } catch (error) {
      console.error("Failed to create customer:", error);
      throw error;
    }
  }
);

export const getCustomers = authenticatedAction(async (user) => {
  const userId = user?.id || "";
  const companyId = user?.companyId || "";

  try {
    await checkPermission(userId, companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
    ]);

    const customers = await db.customer.findMany({
      where: { companyId },
      include: {
        _count: {
          select: { shipments: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return customers;
  } catch (error) {
    console.error("Failed to get customers:", error);
    throw error;
  }
});

export const getCustomerById = authenticatedAction(
  async (user, customerId: string) => {
    const userId = user?.id || "";
    const companyId = user?.companyId || "";

    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const foundCustomer = await db.customer.findUnique({
        where: { id: customerId },
        include: {
          shipments: {
            orderBy: { createdAt: "desc" },
            take: 5,
          },
        },
      });

      return foundCustomer;
    } catch (error) {
      console.error("Failed to get customer:", error);
      throw error;
    }
  }
);

export const updateCustomer = authenticatedAction(
  async (user, customerId: string, data: Prisma.CustomerUpdateInput) => {
    const userId = user?.id || "";
    const companyId = user?.companyId || "";

    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const existingCustomer = await db.customer.findUnique({
        where: { id: customerId },
        select: { companyId: true },
      });

      if (!existingCustomer || existingCustomer.companyId !== companyId) {
        throw new Error("Customer not found or unauthorized");
      }

      const updatedCustomer = await db.customer.update({
        where: { id: customerId },
        data: {
          ...data,
        },
      });

      return updatedCustomer;
    } catch (error) {
      console.error("Failed to update customer:", error);
      throw error;
    }
  }
);

export const deleteCustomer = authenticatedAction(
  async (user, customerId: string) => {
    const userId = user?.id || "";
    const companyId = user?.companyId || "";

    try {
      await checkPermission(userId, companyId, ["role_admin", "role_manager"]);

      const existingCustomer = await db.customer.findUnique({
        where: { id: customerId },
        select: { companyId: true },
      });

      if (!existingCustomer || existingCustomer.companyId !== companyId) {
        throw new Error("Customer not found or unauthorized");
      }

      await db.customer.delete({
        where: { id: customerId },
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to delete customer:", error);
      throw error;
    }
  }
);
