"use server";

import bcrypt from "bcryptjs";
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
