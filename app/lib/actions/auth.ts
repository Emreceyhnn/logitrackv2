"use server";

import { getAuthenticatedUser } from "../auth-middleware";

export async function getUserSession() {
  const user = await getAuthenticatedUser();
  return user;
}
