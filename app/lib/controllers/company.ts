"use server";

import { db } from "../db";
import { checkPermission } from "./utils/checkPermission";
import { authenticatedAction } from "../auth-middleware";
import { createSession, revokeSession } from "./session";

export const createCompany = authenticatedAction(
  async (user, name: string, avatarUrl?: string) => {
    const existingCompany = await db.company.findUnique({ where: { name } });
    if (existingCompany) throw new Error("Company name already exists");

    const newCompany = await db.company.create({
      data: {
        name,
        avatarUrl,
        users: { connect: { id: user.id } },
      },
    });

    // Ensure core roles exist
    const defaultRoles = [
      { id: "role_admin", name: "Administrator", description: "Full system access" },
      { id: "role_manager", name: "Manager", description: "Company management access" },
      { id: "role_dispatcher", name: "Dispatcher", description: "Shipment and route management" },
      { id: "role_driver", name: "Driver", description: "Limited access for drivers" },
      { id: "role_warehouse", name: "Warehouse", description: "Warehouse and inventory management" },
    ];

    for (const r of defaultRoles) {
      await db.role.upsert({
        where: { id: r.id },
        update: {},
        create: {
          id: r.id,
          name: r.name,
          description: r.description,
          permissions: [], // Permissions can be managed separately
        },
      });
    }

    const role = await db.role.findFirst({
      where: { id: "role_admin" },
    });

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        companyId: newCompany.id,
        roleId: role?.id ?? "role_admin",
      },
    });

    await revokeSession(user.sessionId);
    await createSession({
      id: user.id,
      username: updatedUser.email,
      roleId: updatedUser.roleId,
      companyId: newCompany.id,
    });

    return { company: newCompany, user: updatedUser };
  }
);

export const getCompanyById = authenticatedAction(async (user) => {
  const userId = user?.id || "";
  const companyId = user?.companyId || "";

  try {
    await checkPermission(userId, companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
      "role_driver",
      "role_warehouse",
    ]);

    const company = await db.company.findUnique({
      where: { id: companyId, users: { some: { id: userId } } },
    });

    if (!company) {
      throw new Error("User is not authorized to access this company");
    }

    return company;
  } catch (error) {
    console.error("Failed to get company:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get company"
    );
  }
});

export const updateCompany = authenticatedAction(
  async (user, data: { name?: string; avatarUrl?: string }) => {
    const userId = user?.id || "";
    const companyId = user?.companyId || "";

    try {
      await checkPermission(userId, companyId, ["role_admin"]);

      const updatedCompany = await db.company.update({
        where: { id: companyId },
        data: {
          name: data.name,
          avatarUrl: data.avatarUrl,
        },
      });
      return updatedCompany;
    } catch (error) {
      console.error("Failed to update company:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to update company"
      );
    }
  }
);

export const deleteCompany = authenticatedAction(async (user) => {
  const userId = user?.id || "";
  const companyId = user?.companyId || "";

  try {
    await checkPermission(userId, companyId, ["role_admin"]);

    const deletedCompany = await db.company.delete({
      where: { id: companyId },
    });
    return deletedCompany;
  } catch (error) {
    console.error("Failed to delete company:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete company"
    );
  }
});

export const getCompanyUsers = authenticatedAction(async (user) => {
  const userId = user?.id || "";
  const companyId = user?.companyId || "";

  try {
    await checkPermission(userId, companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
      "role_driver",
      "role_warehouse",
    ]);

    const users = await db.user.findMany({
      where: { companyId },
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
  const userId = user?.id || "";
  const companyId = user?.companyId || "";

  try {
    await checkPermission(userId, companyId, [
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
  const userId = user?.id || "";
  const companyId = user?.companyId || "";

  try {
    await checkPermission(userId, companyId, [
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
  const userId = user?.id || "";
  const companyId = user?.companyId || "";

  try {
    await checkPermission(userId, companyId, [
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
  const userId = user?.id || "";
  const companyId = user?.companyId || "";

  try {
    await checkPermission(userId, companyId, [
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

export const removeCompanyUser = authenticatedAction(
  async (user, targetUserId: string) => {
    const userId = user?.id || "";
    const companyId = user?.companyId || "";

    try {
      await checkPermission(userId, companyId, ["role_admin", "role_manager"]);

      const updatedUser = await db.user.update({
        where: { id: targetUserId },
        data: {
          companyId: null,
        },
      });
      return updatedUser;
    } catch (error) {
      console.error("Failed to remove company user:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to remove company user"
      );
    }
  }
);

export const getCompanyProfile = authenticatedAction(async (user) => {
  const userId = user?.id || "";
  const companyId = user?.companyId || "";

  try {
    await checkPermission(userId, companyId, ["role_admin", "role_manager"]);

    const company = await db.company.findUnique({
      where: { id: companyId, users: { some: { id: user.id } } },
      include: {
        users: {
          include: { role: { select: { name: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    const [
      vehicleCount,
      driverCount,
      warehouseCount,
      customerCount,
      shipmentCount,
    ] = await Promise.all([
      db.vehicle.count({ where: { companyId } }),
      db.driver.count({ where: { companyId } }),
      db.warehouse.count({ where: { companyId } }),
      db.customer.count({ where: { companyId } }),
      db.shipment.count({ where: { companyId } }),
    ]);

    return {
      profile: {
        id: company?.id,
        name: company?.name,
        avatarUrl: company?.avatarUrl ?? null,
        createdAt: company?.createdAt.toISOString(),
        updatedAt: company?.updatedAt.toISOString(),
      },
      stats: {
        users: company?.users.length,
        vehicles: vehicleCount,
        drivers: driverCount,
        warehouses: warehouseCount,
        customers: customerCount,
        shipments: shipmentCount,
      },
      members: company?.users.map((u) => ({
        id: u.id,
        name: u.name,
        surname: u.surname,
        email: u.email,
        avatarUrl: u.avatarUrl ?? null,
        status: u.status,
        roleName: u.role?.name ?? null,
        createdAt: u.createdAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Failed to get company profile:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get company profile"
    );
  }
});

export const getCompanyStats = authenticatedAction(async (user) => {
  const userId = user?.id || "";
  const companyId = user?.companyId || "";

  try {
    await checkPermission(userId, companyId, ["role_admin", "role_manager"]);

    const [
      userCount,
      vehicleCount,
      driverCount,
      warehouseCount,
      customerCount,
      shipmentCount,
    ] = await Promise.all([
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
      shipments: shipmentCount,
    };
  } catch (error) {
    console.error("Failed to get company stats:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get company stats"
    );
  }
});

export const addCompanyUser = authenticatedAction(
  async (user, targetUserId: string, roleName: string) => {
    const userId = user?.id || "";
    const companyId = user?.companyId || "";

    try {
      await checkPermission(userId, companyId, ["role_admin", "role_manager"]);

      const updatedUser = await db.user.update({
        where: { id: targetUserId },
        data: {
          companyId,
          roleId: roleName,
        },
      });

      return updatedUser;
    } catch (error) {
      console.error("Failed to add company user:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to add company user"
      );
    }
  }
);
