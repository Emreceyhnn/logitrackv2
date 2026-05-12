"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
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
  useTheme,
  Divider,
  Box,
  Chip,
  Button,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { SelectChangeEvent } from "@mui/material";
import { useState, useEffect, useCallback, useRef } from "react";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import TableSkeleton from "@/app/components/skeletons/TableSkeleton";
import CustomCard from "@/app/components/cards/card";
import type {
  DataTableProps,
  DataTableFilter,
  DataTableRowAction,
} from "@/app/lib/type/dataTable";

interface RowMenuProps<TRow> {
  row: TRow;
  actions: DataTableRowAction<TRow>[];
}

function RowMenu<TRow>({ row, actions }: RowMenuProps<TRow>) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const dict = useDictionary();
  const theme = useTheme();

  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Tooltip title={dict.common.tooltips.actions} arrow>
        <IconButton
          size="medium"
          onClick={(e) => {
            e.stopPropagation();
            setAnchorEl(e.currentTarget);
          }}
          sx={{
            width: 38,
            height: 38,
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "primary._alpha.main_10",
              color: "primary.main",
              transform: "rotate(90deg)",
            },
          }}
        >
          <MoreVertIcon sx={{ fontSize: 22 }} />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              minWidth: 180,
              mt: 1,
              bgcolor:
                theme.palette.mode === "dark"
                  ? "background.paper"
                  : "common.white",
              border: `1px solid ${theme.palette.divider_alpha.main_10}`,
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 8px 32px rgba(0,0,0,0.5)"
                  : "0 8px 32px rgba(0,0,0,0.08)",
              "& .MuiMenuItem-root": {
                px: 2,
                py: 1.2,
                fontSize: 14,
                fontWeight: 500,
                borderRadius: 1.5,
                mx: 0.8,
                my: 0.4,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "primary._alpha.main_08",
                  color: "primary.main",
                },
              },
            },
          },
        }}
      >
        {actions
          .filter(
            (action: DataTableRowAction<TRow>) =>
              !action.hidden || !action.hidden(row)
          )
          .map((action: DataTableRowAction<TRow>, idx: number) => (
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
  const dict = useDictionary();
  const [localSearch, setLocalSearch] = useState(searchValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
                  <Tooltip title={dict.common.tooltips.search} arrow>
                    <SearchIcon
                      sx={{ color: "text.secondary", fontSize: 20 }}
                    />
                  </Tooltip>
                </InputAdornment>
              ),
            },
          }}
          sx={{
            flex: 1,
            minWidth: 220,
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              fontSize: 14,
              bgcolor: theme.palette.background.paper_alpha.main_40,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "& fieldset": {
                borderColor: theme.palette.divider_alpha.main_10,
                transition: "all 0.3s ease",
              },
              "&:hover fieldset": {
                borderColor: "primary.main",
              },
              "&.Mui-focused": {
                bgcolor: theme.palette.background.paper,
                boxShadow: `0 0 0 4px ${theme.palette.primary._alpha.main_15}`,
                "& fieldset": {
                  borderColor: "primary.main",
                  borderWidth: "1.5px",
                },
              },
              "& input::placeholder": {
                color: "text.secondary",
                opacity: 0.9,
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
              <InputLabel sx={{ fontSize: 13 }}>{filter.label}</InputLabel>
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
                      {arr.slice(0, 2).map((v) => (
                        <Chip
                          key={v}
                          label={v.replace(/_/g, " ")}
                          size="small"
                          sx={{ fontSize: 11, height: 20 }}
                        />
                      ))}
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
                sx={{ borderRadius: 2, fontSize: 13 }}
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
                {filter.options.map((opt) => (
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
      {totalActive > 0 && (
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          alignItems="center"
          sx={{
            px: 2,
            pb: 1.5,
            mt: -0.5,
            bgcolor: theme.palette.background.paper_alpha.main_60,
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 600, mr: 1 }}
          >
            {dict.common.filtersActive.replace(
              "{count}",
              totalActive.toString()
            )}
            :
          </Typography>

          {Object.entries(activeFilters).map(([key, values]) => {
            const filter = filters.find((f) => f.key === key);
            if (!filter || !values || values.length === 0) return null;

            return values.map((val) => {
              const option = filter.options.find((o) => o.value === val);
              const label = option ? option.label : val.replace(/_/g, " ");

              return (
                <Tooltip
                  key={`${key}-${val}`}
                  title={dict.common.tooltips.filterBy.replace(
                    "{value}",
                    label
                  )}
                  arrow
                >
                  <Chip
                    label={`${filter.label}: ${label}`}
                    size="small"
                    onDelete={() => {
                      const newValues = values.filter((v) => v !== val);
                      onFilterChange(key, newValues);
                    }}
                    sx={{
                      bgcolor: theme.palette.primary._alpha.main_10,
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      borderRadius: "6px",
                      border: `1px solid ${theme.palette.primary._alpha.main_20}`,
                      "& .MuiChip-deleteIcon": {
                        color: theme.palette.primary.main,
                        fontSize: 14,
                        "&:hover": { color: theme.palette.primary.dark },
                      },
                    }}
                  />
                </Tooltip>
              );
            });
          })}

          <Button
            size="small"
            variant="text"
            onClick={() => {
              Object.keys(activeFilters).forEach((key) => {
                onFilterChange(key, []);
              });
            }}
            sx={{
              fontSize: "0.75rem",
              fontWeight: 800,
              color: "primary.main",
              minWidth: "auto",
              ml: 1.5,
              textTransform: "none",
              "&:hover": {
                bgcolor: "primary._alpha.main_10",
                textDecoration: "underline",
              },
            }}
          >
            {dict.common.clearAll}
          </Button>

          <Box sx={{ flex: 1 }} />

          <Tooltip title={dict.common.tooltips.clearAllFilters} arrow>
            <Button
              size="small"
              variant="text"
              onClick={() => {
                Object.keys(activeFilters).forEach((key) =>
                  onFilterChange(key, [])
                );
              }}
              sx={{
                fontSize: "0.7rem",
                textTransform: "none",
                color: theme.palette.text.secondary,
                "&:hover": { color: theme.palette.primary.main },
              }}
            >
              {dict.common.clearAll}
            </Button>
          </Tooltip>
        </Stack>
      )}
    </>
  );
}

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
  meta,
  onPageChange,
  onLimitChange,
  sortField,
  sortOrder,
  onRequestSort,
  tableTitle,
  wrapCard = false,
  sx,
}: DataTableProps<TRow>) {
  const theme = useTheme();
  const dict = useDictionary();

  const finalEmptyMessage =
    emptyMessage === "No records found" ? dict.common.noData : emptyMessage;
  const finalSearchPlaceholder =
    searchPlaceholder === "Search..." ? dict.common.search : searchPlaceholder;

  const colCount =
    columns.length + (rowActions && rowActions.length > 0 ? 1 : 0);

  const showToolbar =
    !!onSearchChange || (filters.length > 0 && !!onFilterChange);

  const innerContent = (
    <>
      {tableTitle && wrapCard && (
        <>
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 600,
              p: 2,
              pb: showToolbar ? 1 : 2,
            }}
          >
            {tableTitle}
          </Typography>
          {!showToolbar && (
            <Divider
              sx={{ borderColor: theme.palette.divider_alpha.main_10 }}
            />
          )}
        </>
      )}

      {showToolbar && (
        <>
          <DataTableToolbar
            searchValue={searchValue}
            searchPlaceholder={finalSearchPlaceholder}
            onSearchChange={onSearchChange ?? (() => {})}
            filters={filters}
            activeFilters={activeFilters}
            onFilterChange={onFilterChange ?? (() => {})}
          />
          <Divider sx={{ borderColor: theme.palette.divider_alpha.main_10 }} />
        </>
      )}

      {loading ? (
        <TableSkeleton rows={5} columns={colCount} />
      ) : (
        <TableContainer sx={{ p: 0, flex: 1, overflowY: "auto" }}>
          <Table size="small">
            <TableHead
              sx={{
                bgcolor: theme.palette.primary._alpha.main_03,
              }}
            >
              <TableRow>
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    align={col.align ?? "left"}
                    width={col.width}
                    sortDirection={
                      sortField === (col.sortKey || col.key) ? sortOrder : false
                    }
                    sx={{ borderColor: theme.palette.divider_alpha.main_10 }}
                  >
                    {col.sortable ? (
                      <TableSortLabel
                        active={sortField === (col.sortKey || col.key)}
                        direction={
                          sortField === (col.sortKey || col.key)
                            ? sortOrder
                            : "asc"
                        }
                        onClick={() => {
                          if (onRequestSort)
                            onRequestSort(col.sortKey || col.key);
                        }}
                      >
                        {col.label}
                      </TableSortLabel>
                    ) : (
                      col.label
                    )}
                  </TableCell>
                ))}

                {rowActions && rowActions.length > 0 && (
                  <TableCell
                    align="right"
                    sx={{ borderColor: theme.palette.divider_alpha.main_10 }}
                  />
                )}
              </TableRow>
            </TableHead>

            <TableBody sx={{ "& tr:last-child td": { border: 0 } }}>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={colCount}
                    align="center"
                    sx={{
                      py: 6,
                      borderColor: theme.palette.divider_alpha.main_10,
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
                        {finalEmptyMessage}
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
                        borderColor: theme.palette.divider_alpha.main_10,
                        fontSize: 13,
                      },
                      "&.MuiTableRow-hover:hover": {
                        bgcolor:
                          theme.palette.primary._alpha.main_08 + " !important",
                        transition: "background-color 0.2s",
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
      )}

      {meta && !loading && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 0.5,
            borderTop: `1px solid ${theme.palette.divider_alpha.main_10}`,
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 1, sm: 0 },
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 500, fontSize: 13 }}
          >
            {(dict.common.pagination.totalRecords || "{count} records").replace(
              "{count}",
              (meta.total || 0).toString()
            )}
          </Typography>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={meta.total || 0}
            rowsPerPage={meta.limit || 10}
            page={Math.max(0, (meta.page || 1) - 1)}
            onPageChange={(_, newPage) => {
              if (onPageChange) onPageChange(newPage + 1);
            }}
            onRowsPerPageChange={(e) => {
              const newLimit = parseInt(e.target.value, 10);
              if (onLimitChange) onLimitChange(newLimit);
            }}
            labelRowsPerPage={dict.common.pagination.rowsPerPage}
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} ${dict.common.pagination.of} ${
                count !== -1
                  ? count
                  : dict.common.moreThan.replace("{count}", to.toString())
              }`
            }
            sx={{
              borderTop: "none",
              ".MuiTablePagination-toolbar": {
                pl: 0,
              },
              ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                {
                  fontSize: 13,
                },
            }}
          />
        </Box>
      )}
    </>
  );

  const finalContent = (
    <Box
      sx={{ display: "flex", flexDirection: "column", height: "100%", ...sx }}
    >
      {innerContent}
    </Box>
  );

  return wrapCard ? (
    <CustomCard sx={{ padding: 0, overflow: "hidden", height: "100%", ...sx }}>
      {finalContent}
    </CustomCard>
  ) : (
    finalContent
  );
}

export default DataTable;
