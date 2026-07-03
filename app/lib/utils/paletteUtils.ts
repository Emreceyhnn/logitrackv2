import type { Palette } from "@mui/material/styles";

/**
 * Resolves a dotted palette path like "success.main" coming from runtime
 * status metadata against the typed MUI palette.
 */
export function resolvePaletteColor(
  palette: Palette,
  path: string
): string | undefined {
  const [key, variant = "main"] = path.split(".");
  const entry: unknown = palette[key as keyof Palette];
  if (entry && typeof entry === "object" && variant in entry) {
    const value = (entry as Record<string, unknown>)[variant];
    if (typeof value === "string") return value;
  }
  return undefined;
}

/**
 * Returns the `_alpha` scale of a palette entry (e.g. "success" →
 * palette.success._alpha) when the entry defines one.
 */
export function resolvePaletteAlpha(
  palette: Palette,
  key: string
): Record<string, string> | undefined {
  const entry: unknown = palette[key as keyof Palette];
  if (entry && typeof entry === "object" && "_alpha" in entry) {
    const alpha = (entry as { _alpha?: unknown })._alpha;
    if (alpha && typeof alpha === "object")
      return alpha as Record<string, string>;
  }
  return undefined;
}
