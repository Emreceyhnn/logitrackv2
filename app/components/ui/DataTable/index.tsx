"use client";

import {
  Table,
  TableContainer,
  Typography,
  useTheme,
  Divider,
  Box,
} from "@mui/material";
import { useState, useMemo } from "react";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import TableSkeleton from "@/app/components/skeletons/TableSkeleton";
import CustomCard from "@/app/components/cards/card";
import type { DataTableProps } from "@/app/lib/type/dataTable";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";

import { RowMenu } from "./RowMenu";
import { DataTableToolbar } from "./DataTableToolbar";
import { DataTableHeader } from "./DataTableHeader";
import { DataTableBody } from "./DataTableBody";
import { DataTablePagination } from "./DataTablePagination";

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

  const showToolbar =
    !!onSearchChange || (filters.length > 0 && !!onFilterChange);

  // Stable column helper — must not be recreated on every render or TanStack
  // rebuilds its entire internal state, causing flicker and pagination resets.
  const columnHelper = useMemo(() => createColumnHelper<TRow>(), []);

  const tanstackColumns = useMemo(() => {
    const mapped = columns.map((col) => {
      return columnHelper.display({
        id: col.sortKey || col.key,
        header: () => col.label,
        cell: (info) => col.render(info.row.original),
        enableSorting: !!col.sortable,
        meta: {
          align: col.align,
          width: col.width,
        },
      });
    });

    if (rowActions && rowActions.length > 0) {
      mapped.push(
        columnHelper.display({
          id: "_actions",
          header: () => null,
          cell: (info) => (
            <RowMenu row={info.row.original} actions={rowActions} />
          ),
          enableSorting: false,
          meta: { align: "right" },
        })
      );
    }
    return mapped;
  }, [columns, rowActions, columnHelper]);

  const isServerSide = !!meta;

  const [sorting, setSorting] = useState<SortingState>([]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: rows,
    columns: tanstackColumns,
    state: {
      // For server-side, always reflect the external sort prop (even when empty).
      // Using `isServerSide && sortField` is wrong because "" is falsy and would
      // fall back to the stale local sorting state.
      sorting: isServerSide
        ? sortField
          ? [{ id: sortField, desc: sortOrder === "desc" }]
          : []
        : sorting,
      pagination:
        isServerSide && meta
          ? { pageIndex: Math.max(0, meta.page - 1), pageSize: meta.limit }
          : undefined,
    },
    onSortingChange: (updater) => {
      if (isServerSide && onRequestSort) {
        const current = sortField
          ? [{ id: sortField, desc: sortOrder === "desc" }]
          : [];
        const newSorting =
          typeof updater === "function" ? updater(current) : updater;
        // Only propagate when the user actively chose a sort column.
        // When TanStack clears sort (empty array), leave the server-side sort as-is.
        if (newSorting.length > 0) {
          onRequestSort(newSorting[0].id);
        }
      } else {
        setSorting(updater);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // getFilteredRowModel is intentionally omitted: DataTable uses display columns
    // (columnHelper.display) whose getValue() returns undefined, so TanStack's
    // globalFilter would hide every row when any search text is present.
    // Filtering is always handled externally — server-side via API params, or
    // client-side by the parent filtering the rows array before passing it in.
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: isServerSide,
    manualSorting: isServerSide,
    pageCount:
      isServerSide && meta ? Math.ceil(meta.total / meta.limit) : undefined,
  });

  const colCount = table.getAllColumns().length;

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
        <TableSkeleton rows={10} columns={colCount} />
      ) : (
        <TableContainer sx={{ p: 0, flex: 1, overflowY: "auto" }}>
          <Table size="small">
            <DataTableHeader table={table} />
            <DataTableBody
              table={table}
              colCount={colCount}
              finalEmptyMessage={finalEmptyMessage}
              searchValue={searchValue}
              activeFilters={activeFilters}
              onSearchChange={onSearchChange}
              onFilterChange={onFilterChange}
            />
          </Table>
        </TableContainer>
      )}

      {((isServerSide && meta) || (!isServerSide && rows.length > 0)) &&
        !loading && (
          <DataTablePagination
            table={table}
            isServerSide={isServerSide}
            meta={meta}
            rowsLength={rows.length}
            onPageChange={onPageChange}
            onLimitChange={onLimitChange}
          />
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
