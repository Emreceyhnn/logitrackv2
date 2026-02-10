"use server";

import { db } from "../db";

export async function createCompany(userId: string, name: string, avatarUrl?: string) {
    try {
        const existingCompany = await db.company.findUnique({
            where: { name },
        });

        if (existingCompany) {
            throw new Error("Company name already exists");
        }

        const newCompany = await db.company.create({
            data: {
                name,
                avatarUrl,
                users: {
                    connect: { id: userId },
                },
            },
        });


        const updatedUser = await db.user.update({
            where: { id: userId },
            data: { roleId: "role_admin" }
        });


        return { company: newCompany, user: updatedUser };
    } catch (error: any) {
        console.error("Failed to create company:", error);
        throw new Error(error.message || "Failed to create company");
    }
}

export async function getCompanyById(companyId: string, userId: string) {
    try {
        // Check authorization and fetch company in one go
        const company = await db.company.findUnique({
            where: { id: companyId, users: { some: { id: userId } } },
        });

        if (!company) {
            throw new Error("User is not authorized to access this company");
        }

        return company;
    } catch (error: any) {
        console.error("Failed to get company:", error);
        throw new Error(error.message || "Failed to get company");
    }
}

export async function updateCompany(companyId: string, userId: string, data: { name?: string; avatarUrl?: string }) {
    try {
        const isAuthorized = await db.company.findUnique({
            where: { id: companyId, users: { some: { id: userId } } },
        });

        if (!isAuthorized) {
            throw new Error("User is not authorized to access this company");
        }

        const updatedCompany = await db.company.update({
            where: { id: companyId },
            data: {
                name: data.name,
                avatarUrl: data.avatarUrl
            },
        });
        return updatedCompany;
    } catch (error: any) {
        console.error("Failed to update company:", error);
        throw new Error(error.message || "Failed to update company");
    }
}

export async function deleteCompany(companyId: string, userId: string) {
    try {
        const isAuthorized = await db.company.findUnique({
            where: { id: companyId, users: { some: { id: userId } } },
        });

        if (!isAuthorized) {
            throw new Error("User is not authorized to access this company");
        }

        const deletedCompany = await db.company.delete({
            where: { id: companyId },
        });
        return deletedCompany;
    } catch (error: any) {
        console.error("Failed to delete company:", error);
        throw new Error(error.message || "Failed to delete company");
    }
}

export async function getCompanyUsers(companyId: string, userId: string) {
    try {
        const isAuthorized = await db.company.findUnique({
            where: { id: companyId, users: { some: { id: userId } } },
        });

        if (!isAuthorized) {
            throw new Error("User is not authorized to access this company");
        }

        const users = await db.user.findMany({
            where: { companyId },
        });
        return users;
    } catch (error: any) {
        console.error("Failed to get company users:", error);
        throw new Error(error.message || "Failed to get company users");
    }
}

export async function getCompanyWarehouses(companyId: string, userId: string) {
    try {
        const isAuthorized = await db.company.findUnique({
            where: { id: companyId, users: { some: { id: userId } } },
        });

        if (!isAuthorized) {
            throw new Error("User is not authorized to access this company");
        }

        const warehouses = await db.warehouse.findMany({
            where: { companyId },
        });
        return warehouses;
    } catch (error: any) {
        console.error("Failed to get company warehouses:", error);
        throw new Error(error.message || "Failed to get company warehouses");
    }
}

export async function getCompanyVehicles(companyId: string, userId: string) {
    try {
        const isAuthorized = await db.company.findUnique({
            where: { id: companyId, users: { some: { id: userId } } },
        });

        if (!isAuthorized) {
            throw new Error("User is not authorized to access this company");
        }

        const vehicles = await db.vehicle.findMany({
            where: { companyId },
        });
        return vehicles;
    } catch (error: any) {
        console.error("Failed to get company vehicles:", error);
        throw new Error(error.message || "Failed to get company vehicles");
    }
}

export async function getCompanyDrivers(companyId: string, userId: string) {
    try {
        const isAuthorized = await db.company.findUnique({
            where: { id: companyId, users: { some: { id: userId } } },
        });

        if (!isAuthorized) {
            throw new Error("User is not authorized to access this company");
        }

        const drivers = await db.driver.findMany({
            where: { companyId },
        });
        return drivers;
    } catch (error: any) {
        console.error("Failed to get company drivers:", error);
        throw new Error(error.message || "Failed to get company drivers");
    }
}

export async function getCompanyCustomers(companyId: string, userId: string) {
    try {
        const isAuthorized = await db.company.findUnique({
            where: { id: companyId, users: { some: { id: userId } } },
        });

        if (!isAuthorized) {
            throw new Error("User is not authorized to access this company");
        }

        const customers = await db.customer.findMany({
            where: { companyId },
        });
        return customers;
    } catch (error: any) {
        console.error("Failed to get company customers:", error);
        throw new Error(error.message || "Failed to get company customers");
    }
}

export async function addCompanyUser(companyId: string, userId: string, targetUserId: string, roleName: string, driverData: any) {
    try {
        const isAuthorized = await db.company.findUnique({
            where: { id: companyId, users: { some: { id: userId } } },
        });

        if (!isAuthorized) {
            throw new Error("User is not authorized to access this company");
        }

        const updatedUser = await db.user.update({
            where: { id: targetUserId },
            data: {
                companyId,
                roleId: roleName
            }
        });

        if (roleName === "role_driver") {
            await db.driver.create({
                data: {
                    userId: targetUserId,
                    companyId,
                    ...driverData
                }
            });
        }



        return updatedUser;
    } catch (error: any) {
        console.error("Failed to add company user:", error);
        throw new Error(error.message || "Failed to add company user");
    }
}

export async function removeCompanyUser(companyId: string, userId: string, targetUserId: string) {
    try {
        const isAuthorized = await db.company.findUnique({
            where: { id: companyId, users: { some: { id: userId } } },
        });

        if (!isAuthorized) {
            throw new Error("User is not authorized to access this company");
        }

        const updatedUser = await db.user.update({
            where: { id: targetUserId },
            data: {
                companyId: null,
            }
        });
        return updatedUser;
    } catch (error: any) {
        console.error("Failed to remove company user:", error);
        throw new Error(error.message || "Failed to remove company user");
    }
}

export async function getCompanyStats(companyId: string, userId: string) {
    try {
        const isAuthorized = await db.company.findUnique({
            where: { id: companyId, users: { some: { id: userId } } },
        });

        if (!isAuthorized) {
            throw new Error("User is not authorized to access this company");
        }

        const [userCount, vehicleCount, driverCount, warehouseCount, customerCount, shipmentCount] = await Promise.all([
            db.user.count({ where: { companyId } }),
            db.vehicle.count({ where: { companyId } }),
            db.driver.count({ where: { companyId } }),
            db.warehouse.count({ where: { companyId } }),
            db.customer.count({ where: { companyId } }),
            db.shipment.count({ where: { companyId } }),
        ]);

        return {
            users: userCount,
            vehicles: vehicleCount,
            drivers: driverCount,
            warehouses: warehouseCount,
            customers: customerCount,
            shipments: shipmentCount
        };

    } catch (error: any) {
        console.error("Failed to get company stats:", error);
        throw new Error(error.message || "Failed to get company stats");
    }
}
