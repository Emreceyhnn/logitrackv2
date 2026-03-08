import { validateSession, refreshSession } from "./controllers/session";

export type AuthenticatedUser = {
  id: string;
  companyId: string | null;
  roleId: string | null;
  sessionId: string;
};

export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  try {
    let sessionUser = await validateSession();

    if (sessionUser) {
      return {
        id: sessionUser.id,
        companyId: sessionUser.companyId,
        roleId: sessionUser.roleId,
        sessionId: sessionUser.sessionId,
      };
    }

    const refreshed = await refreshSession();
    if (refreshed) {
      sessionUser = await validateSession();
      if (sessionUser) {
        return {
          id: sessionUser.id,
          companyId: sessionUser.companyId,
          roleId: sessionUser.roleId,
          sessionId: sessionUser.sessionId,
        };
      }
    }
  } catch (error) {
    console.error("[getAuthenticatedUser] ❌ Session check failed:", error);
  }

  return null;
}

export function authenticatedAction<T>(
  action: (user: AuthenticatedUser, ...args: any[]) => Promise<T>
) {
  return async (...args: any[]): Promise<T> => {
    const user = await getAuthenticatedUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    return action(user, ...args);
  };
}

export function maybeAuthenticatedAction<T>(
  action: (user: AuthenticatedUser | null, ...args: any[]) => Promise<T>
) {
  return async (...args: any[]): Promise<T> => {
    const user = await getAuthenticatedUser();
    return action(user, ...args);
  };
}
