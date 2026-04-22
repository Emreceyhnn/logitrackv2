"use client";

import "dayjs/locale/tr";
import "dayjs/locale/en";
import { useMemo, useState, useEffect, useCallback } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeContext } from "./themeContext";
import { getTheme, type ThemeMode } from "./theme";
import QueryProvider from "../providers/QueryProvider";
import { Toaster } from "@/app/components/toast";
import { useParams } from "next/navigation";

const THEME_STORAGE_KEY = "logitrack-theme-mode";
const VALID_MODES = ["light", "dark", "system"] as const;
type StoredMode = typeof VALID_MODES[number];

function getSavedStoredMode(): StoredMode {
  if (typeof window === "undefined") return "dark";
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as StoredMode | null;
    return saved && (VALID_MODES as readonly string[]).includes(saved) ? saved : "dark";
  } catch {
    return "dark";
  }
}

function resolveMode(stored: StoredMode): ThemeMode {
  if (stored === "system") {
    if (typeof window === "undefined") return "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return stored;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("dark");
  const theme = useMemo(() => getTheme(mode), [mode]);
  const params = useParams();
  const lang = (params?.lang as string) || "en";

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    const stored = getSavedStoredMode();
    setModeState(resolveMode(stored));

    // If system mode, listen for OS preference changes
    if (stored === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e: MediaQueryListEvent) =>
        setModeState(e.matches ? "dark" : "light");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, []);

  const setMode = useCallback((newMode: ThemeMode | "system") => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch {
      // localStorage not available (private browsing, etc.)
    }
    const resolved = resolveMode(newMode as StoredMode);
    setModeState(resolved);

    // If switching to system, start listening
    if (newMode === "system" && typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e: MediaQueryListEvent) =>
        setModeState(e.matches ? "dark" : "light");
      // Remove any old listeners first (simple approach: refresh the component won't keep old ones)
      mq.addEventListener("change", handler);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={lang}>
        <QueryProvider>
          <ThemeProvider theme={theme}>
            <Toaster />
            <CssBaseline />
            {children}
          </ThemeProvider>
        </QueryProvider>
      </LocalizationProvider>
    </ThemeContext.Provider>
  );
}
