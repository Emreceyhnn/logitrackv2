import { validateSession, refreshSession } from "./controllers/session";

export type AuthenticatedUser = {
  id: string;
  companyId: string | null; // null = user registered but has no company yet
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
 *
 * NOTE: A user with a null companyId is still authenticated — they just
 * haven't created/joined a company yet. Individual controllers must enforce
 * companyId requirements themselves.
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  // Try validating the current access token
  let sessionUser = await validateSession();

  if (sessionUser) {
    return {
      id: sessionUser.id,
      companyId: sessionUser.companyId,
      roleId: sessionUser.roleId,
      sessionId: sessionUser.sessionId,
    };
  }

  // If access token failed, try refreshing
  const refreshed = await refreshSession();
  if (refreshed) {
    // Re-validate with the new access token
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
  }
}
