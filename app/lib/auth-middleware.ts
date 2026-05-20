import { cache } from "react";
import { redirect } from "next/navigation";
import { validateSession } from "./controllers/session";

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
  language: string;
  notifEmailShipment: boolean;
  notifEmailMaint: boolean;
  notifEmailWeekly: boolean;
  notifPushAssignment: boolean;
  notifPushDelay: boolean;
};

export const getAuthenticatedUser = cache(
  async (): Promise<AuthenticatedUser | null> => {
    try {
      const sessionUser = await validateSession();

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
          language: sessionUser.language || "en",
          notifEmailShipment: sessionUser.notifEmailShipment,
          notifEmailMaint: sessionUser.notifEmailMaint,
          notifEmailWeekly: sessionUser.notifEmailWeekly,
          notifPushAssignment: sessionUser.notifPushAssignment,
          notifPushDelay: sessionUser.notifPushDelay,
        };
      }
      
      // If validateSession returns null, it means the token is invalid/revoked.
      // We no longer attempt refreshSession() here because Server Components cannot
      // set cookies. Middleware now handles token expiration via /api/auth/refresh.

    } catch (error) {
      if ((error as { digest?: string })?.digest === "DYNAMIC_SERVER_USAGE") {
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

export function maybeAuthenticatedAction<T, Args extends unknown[]>(
  action: (user: AuthenticatedUser | null, ...args: Args) => Promise<T>
) {
  return async (...args: Args): Promise<T> => {
    const user = await getAuthenticatedUser();
    return action(user, ...args);
  };
}
