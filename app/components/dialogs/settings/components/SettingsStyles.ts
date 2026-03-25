"use client";

import { Theme, alpha } from "@mui/material";

export const selectSxFactory = (theme: Theme) => ({
  borderRadius: 2.5,
  bgcolor: alpha("#ffffff", 0.03),
  color: "white",
  transition: "all 0.2s",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha(theme.palette.divider, 0.08) },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha(theme.palette.primary.main, 0.3) },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.primary.main },
  "& .MuiSvgIcon-root": { color: alpha("#fff", 0.3) },
  "& .MuiSelect-select": { 
    display: "flex", 
    alignItems: "center", 
    py: 1,
    fontWeight: 500,
    fontSize: "0.9rem"
  },
});

export const inputLabelSx = {
  "& .MuiInputLabel-root": { 
    color: alpha("#fff", 0.4),
    fontSize: "0.85rem",
    fontWeight: 600
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "primary.main" },
};
