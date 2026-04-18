"use client";

import React, { createContext, useContext, ReactNode } from "react";
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
