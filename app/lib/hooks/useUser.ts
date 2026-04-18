"use client";

import { useUserContext } from "../context/UserContext";

/**
 * useUser hook refactored to consume the global UserContext.
 * This ensures that on every dashboard refresh or navigation, 
 * we use the server-hydrated session data instead of making redundant fetches.
 */
export function useUser() {
  const { user, loading } = useUserContext();
  
  return { user, loading };
}
