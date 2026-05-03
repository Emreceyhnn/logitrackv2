"use server";

import { redis } from "../redis";
import { getAuthenticatedUser } from "../auth-middleware";

export async function saveUserTheme(mode: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, error: "Unauthorized" };

    await redis.set(`user:${user.id}:theme`, mode);
    return { success: true };
  } catch (err) {
    if ((err as any)?.digest === "DYNAMIC_SERVER_USAGE") {
      throw err;
    }
    console.error("Failed to save theme to Redis", err);
    return { success: false, error: "Failed to save theme" };
  }
}

export async function getUserTheme(): Promise<string | null> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return null;

    const theme = await redis.get<string>(`user:${user.id}:theme`);
    return theme;
  } catch (err) {
    if ((err as any)?.digest === "DYNAMIC_SERVER_USAGE") {
      throw err;
    }
    console.error("Failed to get theme from Redis", err);
    return null;
  }
}
