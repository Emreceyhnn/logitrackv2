import {
  Stack,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { VehicleFilters } from "@/app/lib/type/vehicle";
import { VehicleStatus, VehicleType } from "@prisma/client";
import { useState, useEffect } from "react";

interface VehicleToolbarProps {
  filters: VehicleFilters;
  onFilterChange: (newFilters: Partial<VehicleFilters>) => void;
}

const STATUS_OPTIONS = Object.values(VehicleStatus);
const TYPE_OPTIONS = Object.values(VehicleType);

export default function VehicleToolbar({
  filters,
  onFilterChange,
}: VehicleToolbarProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || "");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        onFilterChange({ search: searchTerm });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filters.search, onFilterChange]);

  const handleStatusChange = (event: any) => {
    const {
      target: { value },
    } = event;
    onFilterChange({
      status: typeof value === "string" ? value.split(",") : value,
    });
  };

  const handleTypeChange = (event: any) => {
    const {
      target: { value },
    } = event;
    onFilterChange({
      type: typeof value === "string" ? value.split(",") : value,
    });
  };

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      alignItems="center"
      sx={{ p: 2, bgcolor: "background.paper", borderRadius: 2 }}
    >
      <TextField
        placeholder="Search vehicles..."
        size="small"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
        sx={{ flexGrow: 1 }}
      />

      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Status</InputLabel>
        <Select
          multiple
          value={filters.status || []}
          onChange={handleStatusChange}
          input={<OutlinedInput label="Status" />}
          renderValue={(selected) => (selected as string[]).join(", ")}
        >
          {STATUS_OPTIONS.map((status) => (
            <MenuItem key={status} value={status}>
              <Checkbox checked={(filters.status || []).indexOf(status) > -1} />
              <ListItemText primary={status} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Type</InputLabel>
        <Select
          multiple
          value={filters.type || []}
          onChange={handleTypeChange}
          input={<OutlinedInput label="Type" />}
          renderValue={(selected) => (selected as string[]).join(", ")}
        >
          {TYPE_OPTIONS.map((type) => (
            <MenuItem key={type} value={type}>
              <Checkbox checked={(filters.type || []).indexOf(type) > -1} />
              <ListItemText primary={type} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}
