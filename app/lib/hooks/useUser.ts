"use client";

import { useState, useEffect } from "react";
import { getUserSession } from "../actions/auth";

export type UserSession = {
  id: string;
  companyId: string;
  roleId: string | null;
} | null;

export function useUser() {
  const [user, setUser] = useState<UserSession>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await getUserSession();
        if (session) {
          setUser(session);
        } else {
          // Fallback for development if no cookie exists
          // console.warn("No session found, using mock admin user");
          setUser({
            id: "usr_001",
            companyId: "cmlgt985b0003x0cuhtyxoihd",
            roleId: "role_admin",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user session", error);
        // Fallback on error
        setUser({
          id: "usr_001",
          companyId: "cmlgt985b0003x0cuhtyxoihd",
          roleId: "role_admin",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
}
