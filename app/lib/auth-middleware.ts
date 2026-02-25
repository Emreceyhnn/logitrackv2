import { validateSession, refreshSession } from "./controllers/session";

export type AuthenticatedUser = {
  id: string;
  companyId: string;
  roleId: string | null;
  sessionId: string;
};

/**
 * Gets the authenticated user from the current session.
 *
 * Strategy:
 * 1. Attempt to validate the current access token via DB session lookup
 * 2. If the access token is expired but a refresh token exists, attempt refresh
 * 3. If refresh succeeds, re-validate the new access token
 * 4. Returns null if all strategies fail
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  // Try validating the current access token
  let sessionUser = await validateSession();

  if (sessionUser && sessionUser.companyId) {
    return {
      id: sessionUser.id,
      companyId: sessionUser.companyId,
      roleId: sessionUser.roleId,
      sessionId: sessionUser.sessionId,
    };
  }

  // If access token failed, try refreshing
  if (!sessionUser) {
    const refreshed = await refreshSession();
    if (refreshed) {
      // Re-validate with the new access token
      sessionUser = await validateSession();
      if (sessionUser && sessionUser.companyId) {
        return {
          id: sessionUser.id,
          companyId: sessionUser.companyId,
          roleId: sessionUser.roleId,
          sessionId: sessionUser.sessionId,
        };
      }
    }
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
