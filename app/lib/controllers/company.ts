"use server";

import { db } from "../db";
import { authenticatedAction } from "../auth-middleware";
import { createSession, revokeSession } from "./session";

/**
 * Creates a new company for the authenticated user.
 * After creation the session is re-issued so the JWT immediately
 * carries the new companyId (required by middleware for routing).
 */
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

    // Assign Administrator role
    const role = await db.role.findFirst({
      where: { name: { equals: "Administrator", mode: "insensitive" } },
    });

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        companyId: newCompany.id,
        roleId: role?.id ?? null,
      },
    });

    // Re-issue session so the new JWT carries the companyId
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

export async function updateCompany(
  companyId: string,
  userId: string,
  data: { name?: string; avatarUrl?: string }
) {
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
        avatarUrl: data.avatarUrl,
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

export async function addCompanyUser(
  companyId: string,
  userId: string,
  targetUserId: string,
  roleName: string,
  driverData: any
) {
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
        roleId: roleName,
      },
    });

    if (roleName === "role_driver") {
      await db.driver.create({
        data: {
          userId: targetUserId,
          companyId,
          ...driverData,
        },
      });
    }

    return updatedUser;
  } catch (error: any) {
    console.error("Failed to add company user:", error);
    throw new Error(error.message || "Failed to add company user");
  }
}

export async function removeCompanyUser(
  companyId: string,
  userId: string,
  targetUserId: string
) {
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
      },
    });
    return updatedUser;
  } catch (error: any) {
    console.error("Failed to remove company user:", error);
    throw new Error(error.message || "Failed to remove company user");
  }
}

export async function getCompanyProfile(companyId: string, userId: string) {
  try {
    const company = await db.company.findUnique({
      where: { id: companyId, users: { some: { id: userId } } },
      include: {
        users: {
          include: { role: { select: { name: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!company) {
      throw new Error("User is not authorized to access this company");
    }

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
        id: company.id,
        name: company.name,
        avatarUrl: company.avatarUrl ?? null,
        createdAt: company.createdAt.toISOString(),
        updatedAt: company.updatedAt.toISOString(),
      },
      stats: {
        users: company.users.length,
        vehicles: vehicleCount,
        drivers: driverCount,
        warehouses: warehouseCount,
        customers: customerCount,
        shipments: shipmentCount,
      },
      members: company.users.map((u) => ({
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
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : "Failed to get company profile";
    console.error("Failed to get company profile:", error);
    throw new Error(msg);
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
  } catch (error: any) {
    console.error("Failed to get company stats:", error);
    throw new Error(error.message || "Failed to get company stats");
  }
}

export const addMemberToMyCompany = authenticatedAction(
  async (
    requester,
    targetUserId: string,
    roleName: string,
    driverData?: {
      employeeId: string;
      phone: string;
      licenseNumber?: string;
      licenseType?: string;
      licenseExpiry?: string;
    }
  ) => {
    if (!requester.companyId) {
      throw new Error("You must belong to a company to add users.");
    }

    try {
      const targetUser = await db.user.findUnique({
        where: { id: targetUserId },
      });

      if (!targetUser) {
        throw new Error("Target user not found.");
      }

      if (targetUser.companyId === requester.companyId) {
        throw new Error("User is already a member of this company.");
      }

      let roleIdToAssign = undefined;
      if (roleName) {
        // The frontend passes role IDs directly (e.g. "role_admin", "role_driver")
        const role = await db.role.findUnique({
          where: { id: roleName },
        });

        if (role) {
          roleIdToAssign = role.id;
        } else {
          // Fallback just in case a name was passed
          const roleByName = await db.role.findFirst({
            where: { name: { equals: roleName, mode: "insensitive" } },
          });
          if (roleByName) {
            roleIdToAssign = roleByName.id;
          } else {
            // Create the role dynamically if it does not exist
            let newRoleName = roleName;
            if (roleName.startsWith("role_")) {
              newRoleName = roleName.replace("role_", "").toUpperCase();
            }
            const newRole = await db.role.create({
              data: {
                id: roleName,
                name: newRoleName,
                permissions: [],
              },
            });
            roleIdToAssign = newRole.id;
          }
        }
      }

      const updatedUser = await db.user.update({
        where: { id: targetUserId },
        data: {
          companyId: requester.companyId,
          // Assign the looked up role ID, which is likely the same as the input string
          ...(roleIdToAssign ? { roleId: roleIdToAssign } : {}),
        },
      });

      // If user is a driver (checked by the role id), create driver record.
      if (roleName === "role_driver" && driverData) {
        // Prepare optional date safely
        const expiryDate = driverData.licenseExpiry
          ? new Date(driverData.licenseExpiry)
          : null;

        await db.driver.create({
          data: {
            userId: targetUserId,
            companyId: requester.companyId,
            employeeId: driverData.employeeId,
            phone: driverData.phone,
            licenseNumber: driverData.licenseNumber || null,
            licenseType: driverData.licenseType || null,
            licenseExpiry: isNaN(expiryDate?.getTime() || NaN)
              ? null
              : expiryDate,
          },
        });
      }

      return { success: true, user: updatedUser };
    } catch (error: any) {
      console.error("Failed to add member to company:", error);
      throw new Error(error.message || "Failed to add member.");
    }
  }
);
