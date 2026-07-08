import { useState, useEffect, useCallback, useRef } from "react";
import {
  Stack,
  TextField,
  InputAdornment,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Checkbox,
  ListItemText,
  Typography,
  Chip,
  useTheme,
  SelectChangeEvent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import type { DataTableFilter } from "@/app/lib/type/dataTable";
import { DataTableActiveFilters } from "./DataTableActiveFilters";

export interface DataTableToolbarProps {
  searchValue: string;
  searchPlaceholder: string;
  onSearchChange: (value: string) => void;
  filters: DataTableFilter[];
  activeFilters: Record<string, string[]>;
  onFilterChange: (key: string, values: string[]) => void;
}

export function DataTableToolbar({
  searchValue,
  searchPlaceholder,
  onSearchChange,
  filters,
  activeFilters,
  onFilterChange,
}: DataTableToolbarProps) {
  const theme = useTheme();
  const dict = useDictionary();
  const [localSearch, setLocalSearch] = useState(searchValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  const commonInputStyles = {
    borderRadius: "10px",
    fontSize: 14,
    height: 40,
    bgcolor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.03)"
        : "rgba(0, 0, 0, 0.02)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "& fieldset": {
      borderColor: theme.palette.divider,
      opacity: 0.8,
      transition: "all 0.3s ease",
    },
    "&:hover fieldset": {
      borderColor: "primary.main",
      opacity: 1,
    },
    "&.Mui-focused": {
      bgcolor:
        theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "#fff",
      boxShadow: `0 0 0 4px ${theme.palette.primary._alpha.main_15}`,
      "& fieldset": {
        borderColor: "primary.main",
        borderWidth: "1.5px",
        opacity: 1,
      },
    },
  };

  const handleSearchChange = useCallback(
    (value: string) => {
      setLocalSearch(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onSearchChange(value);
      }, 400);
    },
    [onSearchChange]
  );

  const handleFilterChange = (
    key: string,
    event: SelectChangeEvent<string | string[]>,
    isMultiple: boolean
  ) => {
    const { value } = event.target;
    if (isMultiple) {
      onFilterChange(
        key,
        typeof value === "string" ? value.split(",") : (value as string[])
      );
    } else {
      onFilterChange(key, value ? [value as string] : []);
    }
  };

  const totalActive = Object.entries(activeFilters).filter(([, values]) => {
    return values && values.length > 0;
  }).length;

  return (
    <>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.5}
        alignItems={{ xs: "stretch", md: "center" }}
        sx={{
          px: 2,
          py: 1.5,
          bgcolor: theme.palette.background.paper_alpha.main_60,
        }}
      >
        <TextField
          placeholder={searchPlaceholder}
          size="small"
          value={localSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip
                    title={dict.common.tooltips?.search || "Search"}
                    arrow
                  >
                    <SearchIcon
                      sx={{ color: "text.secondary", fontSize: 20 }}
                    />
                  </Tooltip>
                </InputAdornment>
              ),
            },
            htmlInput: {
              "aria-label": searchPlaceholder,
            },
          }}
          sx={{
            flex: 1,
            minWidth: 220,
            "& .MuiOutlinedInput-root": {
              ...commonInputStyles,
              "& input::placeholder": {
                color: theme.palette.text.secondary,
                opacity: 1,
                fontWeight: 500,
              },
            },
          }}
        />

        {filters.map((filter) => {
          const isMultiple = filter.multiple !== false;
          const selectedArr = activeFilters[filter.key] ?? [];

          const selectValue = isMultiple ? selectedArr : selectedArr[0] || "";

          return (
            <FormControl key={filter.key} size="small" sx={{ minWidth: 160 }}>
              <InputLabel sx={{ fontSize: 14, top: 1 }}>
                {filter.label}
              </InputLabel>
              <Select
                multiple={isMultiple}
                value={selectValue}
                onChange={(e) => handleFilterChange(filter.key, e, isMultiple)}
                input={<OutlinedInput label={filter.label} />}
                renderValue={(sel) => {
                  const arr = isMultiple
                    ? (sel as string[])
                    : sel
                      ? [sel as string]
                      : [];
                  if (arr.length === 0) {
                    return (
                      <Typography variant="caption" color="text.secondary">
                        {dict.common.all}
                      </Typography>
                    );
                  }
                  return (
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                      {arr.slice(0, 2).map((v: string) => {
                        const opt = filter.options.find((o: { label: string; value: string }) => o.value === v);
                        const label = opt ? opt.label : v.replace(/_/g, " ");
                        return (
                          <Chip
                            key={v}
                            label={label}
                            size="small"
                            sx={{ fontSize: 11, height: 20 }}
                          />
                        );
                      })}
                      {arr.length > 2 && (
                        <Chip
                          label={`+${arr.length - 2}`}
                          size="small"
                          sx={{ fontSize: 11, height: 20 }}
                        />
                      )}
                    </Stack>
                  );
                }}
                sx={commonInputStyles}
              >
                {!isMultiple && (
                  <MenuItem value="">
                    <ListItemText
                      primary={dict.common.all}
                      slotProps={{
                        primary: {
                          sx: {
                            fontSize: 13,
                            fontStyle: "italic",
                            opacity: 0.7,
                          },
                        },
                      }}
                    />
                  </MenuItem>
                )}
                {filter.options.map((opt: { label: string; value: string }) => (
                  <MenuItem
                    key={opt.value}
                    value={opt.value}
                    sx={{ fontSize: 13 }}
                  >
                    {isMultiple && (
                      <Checkbox
                        size="small"
                        checked={selectedArr.indexOf(opt.value) > -1}
                        sx={{ py: 0.5 }}
                      />
                    )}
                    <ListItemText
                      primary={opt.label}
                      slotProps={{ primary: { sx: { fontSize: 13 } } }}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        })}
      </Stack>
      <DataTableActiveFilters
        filters={filters}
        activeFilters={activeFilters}
        onFilterChange={onFilterChange}
        totalActive={totalActive}
      />
    </>
  );
}
