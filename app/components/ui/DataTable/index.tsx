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

  const totalActive = Object.values(activeFilters).reduce(
    (sum, v) => sum + (v ? v.length : 0),
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
                <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
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
                        sx: { fontSize: 13, fontStyle: "italic", opacity: 0.7 },
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

      {totalActive > 0 && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ whiteSpace: "nowrap" }}
        >
          {dict.common.filtersActive.replace("{count}", totalActive.toString())}
        </Typography>
      )}
    </Stack>
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
}: DataTableProps<TRow>) {
  const theme = useTheme();
  const dict = useDictionary();

  const finalEmptyMessage = emptyMessage === "No records found" ? dict.common.noData : emptyMessage;
  const finalSearchPlaceholder = searchPlaceholder === "Search..." ? dict.common.search : searchPlaceholder;

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
            <Divider sx={{ borderColor: theme.palette.divider_alpha.main_10 }} />
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
        <TableContainer sx={{ p: 0 }}>
          <Table size="small">
            <TableHead
              sx={{ bgcolor: (theme.palette.primary as any).main_03 }}
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
            borderTop: `1px solid ${theme.palette.divider_alpha.main_10}`,
          }}
        />
      )}
    </>
  );

  return wrapCard ? (
    <CustomCard sx={{ padding: 0, overflow: "hidden" }}>
      {innerContent}
    </CustomCard>
  ) : (
    innerContent
  );
}

export default DataTable;
