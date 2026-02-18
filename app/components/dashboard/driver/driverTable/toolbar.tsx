"use client";

import {
  Box,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  SelectChangeEvent,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { DriverStatus } from "@prisma/client";
import { DriverFilters } from "@/app/lib/type/driver";
import { useEffect, useState } from "react";

interface DriverTableToolbarProps {
  filters: DriverFilters;
  onFilterChange: (newFilters: Partial<DriverFilters>) => void;
}

export default function DriverTableToolbar({
  filters,
  onFilterChange,
}: DriverTableToolbarProps) {
  /* --------------------------------- states --------------------------------- */
  const [searchTerm, setSearchTerm] = useState(filters.search || "");

  /* -------------------------------- lifecycle ------------------------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        onFilterChange({ search: searchTerm });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filters.search, onFilterChange]);

  /* -------------------------------- handlers -------------------------------- */
  const handleStatusChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    const statusArray = typeof value === "string" ? value.split(",") : value;
    onFilterChange({ status: statusArray as DriverStatus[] });
  };

  const vehicleFilterValue =
    filters.hasVehicle === true
      ? "assigned"
      : filters.hasVehicle === false
        ? "unassigned"
        : "all";

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <TextField
        size="small"
        placeholder="Search drivers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setSearchTerm("")}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ minWidth: 250, flexGrow: 1 }}
      />

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Status</InputLabel>
        <Select
          multiple
          value={filters.status || []}
          onChange={handleStatusChange}
          label="Status"
          renderValue={(selected) => (selected as string[]).join(", ")}
        >
          {Object.values(DriverStatus).map((status) => (
            <MenuItem key={status} value={status}>
              {status.replace("_", " ")}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Vehicle Assignment</InputLabel>
        <Select
          value={vehicleFilterValue}
          label="Vehicle Assignment"
          onChange={(e) => {
            const val = e.target.value;
            if (val === "all") onFilterChange({ hasVehicle: undefined });
            else if (val === "assigned") onFilterChange({ hasVehicle: true });
            else onFilterChange({ hasVehicle: false });
          }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="assigned">Assigned</MenuItem>
          <MenuItem value="unassigned">Unassigned</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
