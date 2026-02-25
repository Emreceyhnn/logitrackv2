"use server";

import { getAuthenticatedUser } from "../auth-middleware";
import { LogoutUser } from "../controllers/users";
import { refreshSession } from "../controllers/session";

export async function getUserSession() {
  const user = await getAuthenticatedUser();
  return user;
}

export async function logoutAction() {
  const result = await LogoutUser();
  return result;
}

export async function refreshSessionAction() {
  const success = await refreshSession();
  return { success };
}
