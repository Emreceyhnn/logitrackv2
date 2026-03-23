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
    locations?: { name: string; address: string; lat?: number; lng?: number; isDefault?: boolean }[]
  ) => {
    try {
      await checkPermission(user.id, user.companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const existingCode = await db.customer.findFirst({
        where: { code: code, companyId: user.companyId },
      });

      if (code && existingCode) {
        throw new Error("Customer with this code already exists");
      }

      // Auto-generate code if not provided
      const customerCode = code || `CUST-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      const newCustomer = await db.customer.create({
        data: {
          name,
          code: customerCode,
          industry,
          taxId,
          email,
          phone,
          companyId: user.companyId,
          locations: {
            create: locations?.map((loc) => ({
              name: loc.name,
              address: loc.address,
              lat: loc.lat,
              lng: loc.lng,
              isDefault: loc.isDefault ?? false,
            })) || [],
          },
        },
        include: {
          locations: true,
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
        locations: true,
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
          locations: true,
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
  async (
    user,
    customerId: string,
    data: {
      name?: string;
      code?: string;
      industry?: string;
      taxId?: string;
      email?: string;
      phone?: string;
      locations?: {
        id?: string;
        name: string;
        address: string;
        lat?: number;
        lng?: number;
        isDefault?: boolean;
      }[];
    }
  ) => {
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
      
      let finalCode = data.code;
      if (finalCode === "") {
        finalCode = `CUST-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      }

      const updateData: Prisma.CustomerUpdateInput = {
        name: data.name,
        code: finalCode,
        industry: data.industry,
        taxId: data.taxId,
        email: data.email,
        phone: data.phone,
      };

      if (data.locations) {
        // Find existing locations to determine what to delete, update, or create
        const currentLocations = await db.customerLocation.findMany({
          where: { customerId }
        });
        
        const incomingIds = data.locations.map(l => l.id).filter(Boolean);
        const locationsToDelete = currentLocations.filter((cl) => !incomingIds.includes(cl.id));
        const locationsToCreate = data.locations.filter(l => !l.id);
        const locationsToUpdate = data.locations.filter(l => l.id);

        updateData.locations = {
          deleteMany: {
            id: { in: locationsToDelete.map((l) => l.id) }
          },
          create: locationsToCreate.map(loc => ({
            name: loc.name,
            address: loc.address,
            lat: loc.lat,
            lng: loc.lng,
            isDefault: loc.isDefault ?? false,
          })),
          update: locationsToUpdate.map(loc => ({
            where: { id: loc.id },
            data: {
              name: loc.name,
              address: loc.address,
              lat: loc.lat,
              lng: loc.lng,
              isDefault: loc.isDefault ?? false,
            }
          }))
        };
      }

      const updatedCustomer = await db.customer.update({
        where: { id: customerId },
        data: updateData,
        include: { locations: true }
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
