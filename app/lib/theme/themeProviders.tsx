"use client";

import { useMemo, useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeContext } from "./themeContext";
import { getTheme, type ThemeMode } from "./theme";
import QueryProvider from "../providers/QueryProvider";
import { Toaster } from "@/app/components/toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("dark");
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
