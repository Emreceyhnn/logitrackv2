import { validateSession, refreshSession } from "./controllers/session";

/**
 * Represent an authenticated user in the current session.
 */
export type AuthenticatedUser = {
  id: string;
  companyId: string | null;
  roleId: string | null;
  sessionId: string;
  name: string;
  surname: string;
  avatarUrl: string | null;
};

/**
 * Server Component Helper: Retrieves the current authenticated user session.
 * 
 * Logic:
 * 1. Validates current access token.
 * 2. If invalid/expired, attempts a refresh using the refresh token.
 * 3. Returns the user or null if unauthenticated.
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  try {
    let sessionUser = await validateSession();

    // If we have a session, we are good.
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

    // Attempt refresh if validation failed
    console.log("[getAuthenticatedUser] 🔄 Attempting session refresh...");
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
    console.error("[getAuthenticatedUser] ❌ Session check failed critical:", error);
  }

  return null;
}

/**
 * Server Action Wrapper: Ensures the action is only called by an authenticated user.
 * 
 * Re-verifies session on every call to prevent unauthorized access.
 */
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

/**
 * Server Action Wrapper: Passes user if authenticated, null otherwise.
 */
export function maybeAuthenticatedAction<T, Args extends unknown[]>(
  action: (user: AuthenticatedUser | null, ...args: Args) => Promise<T>
) {
  return async (...args: Args): Promise<T> => {
    const user = await getAuthenticatedUser();
    return action(user, ...args);
  };
}
