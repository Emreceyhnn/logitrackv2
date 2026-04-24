import { cache } from "react";
import { redirect } from "next/navigation";
import { validateSession, refreshSession } from "./controllers/session";

export type AuthenticatedUser = {
  id: string;
  companyId: string | null;
  roleId: string | null;
  roleName: string | null;
  sessionId: string;
  name: string;
  surname: string;
  avatarUrl: string | null;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
};

export const getAuthenticatedUser = cache(
  async (): Promise<AuthenticatedUser | null> => {
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
          roleName: sessionUser.roleName,
          sessionId: sessionUser.sessionId,
          timezone: sessionUser.timezone,
          dateFormat: sessionUser.dateFormat,
          timeFormat: sessionUser.timeFormat,
          currency: sessionUser.currency || "USD",
        };
      }

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
            roleName: sessionUser.roleName,
            sessionId: sessionUser.sessionId,
            timezone: sessionUser.timezone,
            dateFormat: sessionUser.dateFormat,
            timeFormat: sessionUser.timeFormat,
            currency: sessionUser.currency || "USD",
          };
        }
      }
    } catch (error) {
      if ((error as any)?.digest === "DYNAMIC_SERVER_USAGE") {
        throw error;
      }
      console.error(
        "[getAuthenticatedUser] ❌ Session check failed critical:",
        error
      );
    }

    return null;
  }
);

export function authenticatedAction<T, Args extends unknown[]>(
  action: (user: AuthenticatedUser, ...args: Args) => Promise<T>
) {
  return async (...args: Args): Promise<T> => {
    const user = await getAuthenticatedUser();

    if (!user) {
      redirect("/");
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
