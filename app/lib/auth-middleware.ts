import { validateSession, refreshSession } from "./controllers/session";

export type AuthenticatedUser = {
  id: string;
  companyId: string | null;
  roleId: string | null;
  sessionId: string;
  name: string;
  surname: string;
  avatarUrl: string | null;
};

export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  try {
    let sessionUser = await validateSession();

    if (sessionUser) {
      return {
        id: sessionUser.id,
        name: sessionUser.name,
        surname: sessionUser.surname,
        avatarUrl: sessionUser.avatarUrl,
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
          name: sessionUser.name,
          surname: sessionUser.surname,
          avatarUrl: sessionUser.avatarUrl,
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

export function authenticatedAction<T, Args extends unknown[]>(
  action: (user: AuthenticatedUser, ...args: Args) => Promise<T>
) {
  return async (...args: Args): Promise<T> => {
    const user = await getAuthenticatedUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    return action(user, ...args);
  };
}

export function maybeAuthenticatedAction<T, Args extends unknown[]>(
  action: (user: AuthenticatedUser | null, ...args: Args) => Promise<T>
) {
  return async (...args: Args): Promise<T> => {
    const user = await getAuthenticatedUser();
    return action(user, ...args);
  };
}
