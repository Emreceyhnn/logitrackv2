"use client";

import { useMemo } from "react";
import { useUser } from "./useUser";
import { DateSettings } from "../lib/utils/date";

export function useDateSettings(): DateSettings {
  const { user } = useUser();

  return useMemo(
    () => ({
      timezone: user?.timezone || "UTC",
      dateFormat: user?.dateFormat || "DD/MM/YYYY",
      timeFormat: user?.timeFormat || "24h",
    }),
    [user?.timezone, user?.dateFormat, user?.timeFormat]
  );
}
