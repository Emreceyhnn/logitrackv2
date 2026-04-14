"use client";

import { Theme, alpha } from "@mui/material";

export const selectSxFactory = (theme: Theme) => ({
  borderRadius: 2.5,
  bgcolor: (theme.palette.common as any).white_alpha.main_03,
  color: "white",
  transition: "all 0.2s",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: (theme.palette as any).divider_alpha.main_08 },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: (theme.palette.primary as any)._alpha.main_30 },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.primary.main },
  "& .MuiSvgIcon-root": { color: (theme.palette.common as any).white_alpha.main_30 },
  "& .MuiSelect-select": { 
    display: "flex", 
    alignItems: "center", 
    py: 1,
    fontWeight: 500,
    fontSize: "0.9rem"
  },
});

export const inputLabelSxFactory = (theme: Theme) => ({
  "& .MuiInputLabel-root": { 
    color: (theme.palette.common as any).white_alpha.main_40,
    fontSize: "0.85rem",
    fontWeight: 600
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "primary.main" },
});
