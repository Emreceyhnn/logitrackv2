"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "../db";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev_only";

function generateToken(user: any) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.roleId },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export async function getUserFromToken(token: string) {
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.id) {
      throw new Error("Invalid token");
    }

    const user = await db.user.findUnique({
      where: { id: decoded.id },
      include: { company: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Return safe user object
    const { password, ...safeUser } = user;
    return safeUser;
  } catch (error) {
    console.error("Failed to get user from token:", error);
    return null;
  }
}

export async function getUsers() {
  try {
    const allUsers = await db.user.findMany({
      include: {
        role: true,
        driver: true,
      },
    });
    return allUsers;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw new Error("Failed to fetch users");
  }
}

export async function RegisterUser(
  username: string,
  name: string,
  surname: string,
  password: string,
  email: string
) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const isExist = await db.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (isExist) {
      if (isExist.username === username) {
        throw new Error("Username already exists");
      }
      throw new Error("Email already exists");
    }

    const newUser = await db.user.create({
      data: {
        username,
        name,
        surname,
        password: hashedPassword,
        email,
      },
    });

    const token = generateToken(newUser);

    // Set cookie
    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // Return serializable object
    return {
      user: newUser,
      token,
    };
  } catch (error: any) {
    console.error("Failed to create user:", error);
    throw new Error(error.message || "Failed to create user");
  }
}

export async function LoginUser(email: string, password: string) {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password || "");
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const token = generateToken(user);

    // Set cookie
    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return {
      user,
      token,
    };
  } catch (error) {
    console.error("Failed to login user:", error);
    // Be careful not to expose too much info in prod, but for now keeping error message consistent
    throw new Error("Failed to login user");
  }
}

export async function updateUser(
  username: string,
  name: string,
  surname: string,
  password: string,
  email: string,
  avatarUrl: string,
  role: string
) {
  try {
    const user = await db.user.upsert({
      where: { username },
      update: {},
      create: {
        username,
        name,
        surname,
        password,
        email,
        avatarUrl,
        roleId: role,
      },
    });
    return user;
  } catch (error) {
    console.error("Failed to update user:", error);
    throw new Error("Failed to update user");
  }
}

export async function createUserForCompany(token: string, userData: any) {
  try {
    const requester = await getUserFromToken(token);
    if (!requester || !requester.companyId) {
      throw new Error("Unauthorized");
    }

    // specific role checks if needed, e.g. only ADMIN can add users
    // For now assuming any user in company can add (or limit to admin/manager)
    // const role = await db.role.findUnique({ where: { id: requester.roleId } });
    // if (role?.name !== 'ADMIN' && role?.name !== 'MANAGER') ...

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const isExist = await db.user.findFirst({
      where: {
        OR: [{ username: userData.username }, { email: userData.email }],
      },
    });

    if (isExist) {
      if (isExist.username === userData.username) {
        throw new Error("Username already exists");
      }
      throw new Error("Email already exists");
    }

    // Find the role ID by name (assuming roles are seeded)
    // You might need a seed script or helper to find role by name
    // For now, let's assume valid role name is passed or map it
    // The form sends "admin", "manager", etc.
    // The DB roles might be "ADMIN", "MANAGER" or "role_admin" etc. 
    // Let's try to find insensitive or standard
    const roleName = userData.role.toUpperCase();
    const role = await db.role.findFirst({
      where: { name: { equals: roleName, mode: "insensitive" } }
    });

    const newUser = await db.user.create({
      data: {
        username: userData.username,
        name: userData.name,
        surname: userData.surname,
        email: userData.email,
        password: hashedPassword,
        companyId: requester.companyId,
        roleId: role ? role.id : undefined,
        // If role not found, it will be null (or default based on Schema)
      },
    });

    return newUser;
  } catch (error: any) {
    console.error("Failed to create company user:", error);
    throw new Error(error.message || "Failed to create company user");
  }
}

export async function getUsersForMyCompany(token: string) {
  try {
    const requester = await getUserFromToken(token);
    if (!requester || !requester.companyId) {
      throw new Error("Unauthorized");
    }

    const users = await db.user.findMany({
      where: { companyId: requester.companyId },
      include: { role: true }
    });

    // Return safe user objects
    return users.map(u => {
      const { password, ...safe } = u;
      return safe;
    });
  } catch (error: any) {
    console.error("Failed to fetch company users:", error);
    throw new Error(error.message || "Failed to fetch company users");
  }
}
