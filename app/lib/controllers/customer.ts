"use server";

import { db } from "../db";
import { checkPermission } from "./utils/checkPermission";
import { Prisma } from "@prisma/client";

export async function createCustomer(
    userId: string,
    companyId: string,
    name: string,
    code: string,
    industry?: string,
    taxId?: string,
    email?: string,
    phone?: string,
    address?: string
) {
    try {
        await checkPermission(userId, companyId, ["role_admin", "role_manager", "role_dispatcher"]);

        // Check if code already exists
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
                companyId,
            },
        });

        return { customer: newCustomer };
    } catch (error: any) {
        console.error("Failed to create customer:", error);
        throw new Error(error.message || "Failed to create customer");
    }
}

export async function getCustomers(companyId: string, userId: string) {
    try {
        await checkPermission(userId, companyId);

        const customers = await db.customer.findMany({
            where: { companyId },
            include: {
                _count: {
                    select: { shipments: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return customers;
    } catch (error: any) {
        console.error("Failed to get customers:", error);
        throw new Error(error.message || "Failed to get customers");
    }
}

export async function getCustomerById(customerId: string, userId: string) {
    try {
        const customer = await db.customer.findUnique({
            where: { id: customerId },
            include: {
                shipments: {
                    orderBy: { createdAt: 'desc' },
                    take: 5
                }
            }
        });

        if (!customer) throw new Error("Customer not found");

        if (customer.companyId) {
            await checkPermission(userId, customer.companyId);
        }

        return customer;
    } catch (error: any) {
        console.error("Failed to get customer:", error);
        throw new Error(error.message || "Failed to get customer");
    }
}

export async function updateCustomer(customerId: string, userId: string, data: Prisma.CustomerUpdateInput) {
    try {
        const existingCustomer = await db.customer.findUnique({
            where: { id: customerId },
            select: { companyId: true }
        });

        if (!existingCustomer?.companyId) throw new Error("Customer not found");

        await checkPermission(userId, existingCustomer.companyId, ["role_admin", "role_manager", "role_dispatcher"]);

        const updatedCustomer = await db.customer.update({
            where: { id: customerId },
            data: {
                ...data,
            }
        });

        return updatedCustomer;
    } catch (error: any) {
        console.error("Failed to update customer:", error);
        throw new Error(error.message || "Failed to update customer");
    }
}

export async function deleteCustomer(customerId: string, userId: string) {
    try {
        const existingCustomer = await db.customer.findUnique({
            where: { id: customerId },
            select: { companyId: true }
        });

        if (!existingCustomer?.companyId) throw new Error("Customer not found");

        await checkPermission(userId, existingCustomer.companyId, ["role_admin", "role_manager"]);

        await db.customer.delete({
            where: { id: customerId }
        });

        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete customer:", error);
        throw new Error(error.message || "Failed to delete customer");
    }
}
