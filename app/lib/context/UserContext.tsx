"use client";

import { createContext, useContext, ReactNode } from "react";
import { AuthenticatedUser } from "@/app/lib/auth-middleware";

interface UserContextType {
  user: AuthenticatedUser | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: AuthenticatedUser | null;
}) {
  // Since we fetch on server and pass it down, we start with loading = false
  // if initialUser was attempted.
  return (
    <UserContext.Provider value={{ user: initialUser, loading: false }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}

/**
 * Tolerant variant for components that render both inside and outside the
 * dashboard (e.g. the root theme provider): returns a null user instead of
 * throwing when no UserProvider is mounted (landing / auth / static pages).
 */
export function useOptionalUserContext(): UserContextType {
  const context = useContext(UserContext);
  return context ?? { user: null, loading: false };
}
