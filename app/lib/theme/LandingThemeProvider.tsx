"use client";

import { useMemo } from "react";
import { ThemeProvider } from "@mui/material";
import { getTheme } from "./theme";

/**
 * LandingThemeProvider
 *
 * Wraps landing pages with a permanently dark MUI theme, completely
 * independent of the user's Light/Dark preference that lives in
 * ThemeContext. This ensures landing page colours are always static
 * and never flip to the dashboard's light theme.
 */
export default function LandingThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const darkTheme = useMemo(() => getTheme("dark"), []);

  return <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>;
}
