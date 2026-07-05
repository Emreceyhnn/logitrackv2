"use client";

// Centralised dayjs setup (locales + plugins + English `formats` patch).
// The configured singleton is re-exported so `dayjs.tz.setDefault` below uses
// the same instance every picker in the tree relies on.
import dayjs from "@/app/lib/utils/dayjsConfig";
import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeContext } from "./themeContext";
import { getTheme, type ThemeMode } from "./theme";
import QueryProvider from "../providers/QueryProvider";
import { Toaster } from "@/app/components/toast";
import { useParams } from "next/navigation";
import { saveUserTheme } from "@/app/lib/actions/theme";
import { useOptionalUserContext } from "../context/UserContext";

const THEME_STORAGE_KEY = "logitrack-theme-mode";
const VALID_MODES = ["light", "dark", "system"] as const;
type StoredMode = typeof VALID_MODES[number];

function getSavedStoredMode(): StoredMode {
  if (typeof window === "undefined") return "dark";
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as StoredMode | null;
    if (saved && (VALID_MODES as readonly string[]).includes(saved)) return saved;
    // Fallback: the theme cookie is written by saveUserTheme with
    // httpOnly:false precisely so the client can read it. The server no
    // longer forwards it via initialMode (that read forced every route
    // dynamic), so this is the cross-device source when localStorage is cold.
    const cookieTheme = document.cookie
      .split("; ")
      .find((c) => c.startsWith("logitrack-theme="))
      ?.split("=")[1];
    if (cookieTheme && (VALID_MODES as readonly string[]).includes(cookieTheme)) {
      return cookieTheme as StoredMode;
    }
    return "dark";
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

import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

export default function Providers({ 
  children,
  initialMode 
}: { 
  children: React.ReactNode;
  initialMode?: StoredMode;
}) {
  const { user } = useOptionalUserContext();
  const [mode, setModeState] = useState<ThemeMode>(() => resolveMode(initialMode || "dark"));
  const theme = useMemo(() => getTheme(mode), [mode]);
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const safeLang = ["en", "tr"].includes(lang) ? lang : "en";

  // Set global dayjs timezone when user preferences change
  useEffect(() => {
    if (user?.timezone) {
      dayjs.tz.setDefault(user.timezone);
    }
  }, [user?.timezone]);

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    const stored = getSavedStoredMode();
    const modeToUse = initialMode || stored;
    const resolved = resolveMode(modeToUse);
    
    // Defer state update to avoid cascading render warning
    queueMicrotask(() => {
      setModeState((prev) => (prev !== resolved ? resolved : prev));
    });

    // If system mode, listen for OS preference changes
    if (stored === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e: MediaQueryListEvent) =>
        setModeState(e.matches ? "dark" : "light");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [initialMode]);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setMode = useCallback((newMode: ThemeMode | "system") => {
    // Skip if the value in localStorage is already the same (prevents duplicate calls)
    const currentStored = typeof window !== "undefined"
      ? localStorage.getItem(THEME_STORAGE_KEY)
      : null;
    if (currentStored === newMode) {
      // Still update visual state in case SSR/client mismatch
      setModeState(resolveMode(newMode as StoredMode));
      return;
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch {
      // localStorage not available (private browsing, etc.)
    }

    // Debounce server-action call — only fires if user stops clicking for 600ms
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveUserTheme(newMode).catch((err) =>
        console.error("Redis theme sync error", err)
      );
    }, 600);

    const resolved = resolveMode(newMode as StoredMode);
    setModeState(resolved);

    // If switching to system, start listening
    if (newMode === "system" && typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e: MediaQueryListEvent) =>
        setModeState(e.matches ? "dark" : "light");
      mq.addEventListener("change", handler);
    }
  }, []);

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeContext.Provider value={{ mode, setMode }}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={safeLang}>
          <QueryProvider>
            <ThemeProvider theme={theme}>
              <Toaster />
              <CssBaseline />
              {children}
            </ThemeProvider>
          </QueryProvider>
        </LocalizationProvider>
      </ThemeContext.Provider>
    </AppRouterCacheProvider>
  );
}
