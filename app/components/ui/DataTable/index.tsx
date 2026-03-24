"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  alpha,
  useTheme,
  Divider,
  Box,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import type { SelectChangeEvent } from "@mui/material";
import { useState, useEffect, useCallback, useRef } from "react";
import TableSkeleton from "@/app/components/skeletons/TableSkeleton";
import type {
  DataTableProps,
  DataTableFilter,
  DataTableRowAction,
} from "@/app/lib/type/dataTable";

// ---------------------------------------------------------------------------
// Internal: RowMenu
// ---------------------------------------------------------------------------

interface RowMenuProps<TRow> {
  row: TRow;
  actions: DataTableRowAction<TRow>[];
}

function RowMenu<TRow>({ row, actions }: RowMenuProps<TRow>) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          setAnchorEl(e.currentTarget);
        }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              minWidth: 150,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            },
          },
        }}
      >
        {actions.map((action, idx) => (
          <MenuItem
            key={idx}
            onClick={() => {
              handleClose();
              action.onClick(row);
            }}
            sx={{
              color:
                action.color === "error"
                  ? "error.main"
                  : action.color === "warning"
                  ? "warning.main"
                  : "text.primary",
              fontSize: 14,
            }}
          >
            <ListItemIcon
              sx={{
                color:
                  action.color === "error"
                    ? "error.main"
                    : action.color === "warning"
                    ? "warning.main"
                    : "text.secondary",
                minWidth: 32,
              }}
            >
              {action.icon}
            </ListItemIcon>
            <ListItemText>{action.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

// ---------------------------------------------------------------------------
// Internal: Toolbar
// ---------------------------------------------------------------------------

interface DataTableToolbarProps {
  searchValue: string;
  searchPlaceholder: string;
  onSearchChange: (value: string) => void;
  filters: DataTableFilter[];
  activeFilters: Record<string, string[]>;
  onFilterChange: (key: string, values: string[]) => void;
}

function DataTableToolbar({
  searchValue,
  searchPlaceholder,
  onSearchChange,
  filters,
  activeFilters,
  onFilterChange,
}: DataTableToolbarProps) {
  const theme = useTheme();
  const [localSearch, setLocalSearch] = useState(searchValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync internal state when external searchValue changes (e.g. reset)
  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

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
    event: SelectChangeEvent<string[]>
  ) => {
    const { value } = event.target;
    onFilterChange(key, typeof value === "string" ? value.split(",") : value);
  };

  const totalActive = Object.values(activeFilters).reduce(
    (sum, v) => sum + v.length,
    0
  );

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={1.5}
      alignItems={{ xs: "stretch", md: "center" }}
      sx={{
        px: 2,
        py: 1.5,
        bgcolor: alpha(theme.palette.background.paper, 0.6),
      }}
    >
      {/* Search */}
      <TextField
        placeholder={searchPlaceholder}
        size="small"
        value={localSearch}
        onChange={(e) => handleSearchChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  fontSize="small"
                  sx={{ color: "text.secondary" }}
                />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          flex: 1,
          minWidth: 220,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            fontSize: 14,
          },
        }}
      />

      {/* Dynamic filter dropdowns */}
      {filters.map((filter) => {
        const selected = activeFilters[filter.key] ?? [];
        return (
          <FormControl key={filter.key} size="small" sx={{ minWidth: 160 }}>
            <InputLabel sx={{ fontSize: 13 }}>{filter.label}</InputLabel>
            <Select
              multiple={filter.multiple !== false}
              value={selected}
              onChange={(e) =>
                handleFilterChange(filter.key, e as SelectChangeEvent<string[]>)
              }
              input={<OutlinedInput label={filter.label} />}
              renderValue={(sel) =>
                (sel as string[]).length === 0 ? (
                  <Typography variant="caption" color="text.secondary">
                    All
                  </Typography>
                ) : (
                  <Stack direction="row" spacing={0.5} flexWrap="wrap">
                    {(sel as string[]).slice(0, 2).map((v) => (
                      <Chip
                        key={v}
                        label={v.replace(/_/g, " ")}
                        size="small"
                        sx={{ fontSize: 11, height: 20 }}
                      />
                    ))}
                    {(sel as string[]).length > 2 && (
                      <Chip
                        label={`+${(sel as string[]).length - 2}`}
                        size="small"
                        sx={{ fontSize: 11, height: 20 }}
                      />
                    )}
                  </Stack>
                )
              }
              sx={{ borderRadius: 2, fontSize: 13 }}
            >
              {filter.options.map((opt) => (
                <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: 13 }}>
                  <Checkbox
                    size="small"
                    checked={selected.indexOf(opt.value) > -1}
                    sx={{ py: 0.5 }}
                  />
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

      {/* Active filter count badge */}
      {totalActive > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
          {totalActive} filter{totalActive > 1 ? "s" : ""} active
        </Typography>
      )}
    </Stack>
  );
}

// ---------------------------------------------------------------------------
// Main: DataTable
// ---------------------------------------------------------------------------

function DataTable<TRow extends { id: string }>({
  rows,
  columns,
  loading = false,
  emptyMessage = "No records found",
  searchValue = "",
  searchPlaceholder = "Search...",
  onSearchChange,
  filters = [],
  activeFilters = {},
  onFilterChange,
  rowActions,
}: DataTableProps<TRow>) {
  const theme = useTheme();
  const colCount = columns.length + (rowActions && rowActions.length > 0 ? 1 : 0);

  const showToolbar =
    !!onSearchChange || (filters.length > 0 && !!onFilterChange);

  if (loading) {
    return (
      <>
        {showToolbar && (
          <>
            <DataTableToolbar
              searchValue={searchValue}
              searchPlaceholder={searchPlaceholder}
              onSearchChange={onSearchChange ?? (() => {})}
              filters={filters}
              activeFilters={activeFilters}
              onFilterChange={onFilterChange ?? (() => {})}
            />
            <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.1) }} />
          </>
        )}
        <TableSkeleton rows={5} columns={colCount} />
      </>
    );
  }

  return (
    <>
      {showToolbar && (
        <>
          <DataTableToolbar
            searchValue={searchValue}
            searchPlaceholder={searchPlaceholder}
            onSearchChange={onSearchChange ?? (() => {})}
            filters={filters}
            activeFilters={activeFilters}
            onFilterChange={onFilterChange ?? (() => {})}
          />
          <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.1) }} />
        </>
      )}

      <TableContainer sx={{ p: 0 }}>
        <Table size="small">
          {/* ── Head ─────────────────────────────────────────────────── */}
          <TableHead
            sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03) }}
          >
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  align={col.align ?? "left"}
                  width={col.width}
                  sx={{
                    borderColor: alpha(theme.palette.divider, 0.1),
                    fontWeight: 600,
                    fontSize: 13,
                    color: "text.secondary",
                    whiteSpace: "nowrap",
                  }}
                >
                  {col.label}
                </TableCell>
              ))}

              {rowActions && rowActions.length > 0 && (
                <TableCell
                  align="right"
                  sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}
                />
              )}
            </TableRow>
          </TableHead>

          {/* ── Body ─────────────────────────────────────────────────── */}
          <TableBody sx={{ "& tr:last-child td": { border: 0 } }}>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={colCount}
                  align="center"
                  sx={{
                    py: 6,
                    borderColor: alpha(theme.palette.divider, 0.1),
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: 13 }}
                    >
                      {emptyMessage}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{
                    cursor: "default",
                    "& td": {
                      borderColor: alpha(theme.palette.divider, 0.1),
                      fontSize: 13,
                    },
                    transition: "background-color 0.15s",
                  }}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      align={col.align ?? "left"}
                      width={col.width}
                    >
                      {col.render(row)}
                    </TableCell>
                  ))}

                  {rowActions && rowActions.length > 0 && (
                    <TableCell align="right">
                      <RowMenu row={row} actions={rowActions} />
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default DataTable;
