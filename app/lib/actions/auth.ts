"use server";

import { getAuthenticatedUser } from "../auth-middleware";
import { LogoutUser } from "../controllers/users";
import { refreshSession } from "../controllers/session";

export async function getUserSession() {
  try {
    const user = await getAuthenticatedUser();
    return user;
  } catch (error) {
    console.error("CRITICAL ERROR in getUserSession:", error);
    throw error;
  }
}

export async function logoutAction() {
  const result = await LogoutUser();
  return result;
}

export async function refreshSessionAction() {
  const success = await refreshSession();
  return { success };
}
