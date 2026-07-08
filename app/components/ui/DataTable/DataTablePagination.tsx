import { Box, Typography, TablePagination, useTheme } from "@mui/material";
import { Table } from "@tanstack/react-table";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import type { PaginationMeta } from "@/app/lib/type/dataTable";

interface DataTablePaginationProps<TRow> {
  table: Table<TRow>;
  isServerSide: boolean;
  meta?: PaginationMeta;
  rowsLength: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function DataTablePagination<TRow>({
  table,
  isServerSide,
  meta,
  rowsLength,
  onPageChange,
  onLimitChange,
}: DataTablePaginationProps<TRow>) {
  const theme = useTheme();
  const dict = useDictionary();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        py: 0.5,
        borderTop: `1px solid ${theme.palette.divider_alpha?.main_10 || theme.palette.divider}`,
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: 1, sm: 0 },
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontWeight: 500, fontSize: 13 }}
      >
        {(
          dict.common.pagination?.totalRecords || "{count} records"
        ).replace(
          "{count}",
          isServerSide
            ? (meta?.total || 0).toString()
            : rowsLength.toString()
        )}
      </Typography>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={isServerSide ? meta?.total || 0 : rowsLength}
        rowsPerPage={
          isServerSide
            ? meta?.limit || 10
            : table.getState().pagination.pageSize
        }
        page={
          isServerSide
            ? Math.max(0, (meta?.page || 1) - 1)
            : table.getState().pagination.pageIndex
        }
        onPageChange={(_, newPage) => {
          if (isServerSide && onPageChange) {
            onPageChange(newPage + 1);
          } else if (!isServerSide) {
            table.setPageIndex(newPage);
          }
        }}
        onRowsPerPageChange={(e) => {
          const newLimit = parseInt(e.target.value, 10);
          if (isServerSide && onLimitChange) {
            onLimitChange(newLimit);
          } else if (!isServerSide) {
            table.setPageSize(newLimit);
          }
        }}
        labelRowsPerPage={dict.common.pagination?.rowsPerPage || "Rows per page:"}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} ${dict.common.pagination?.of || "of"} ${
            count !== -1
              ? count
              : dict.common.moreThan?.replace("{count}", to.toString()) ||
                to.toString()
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
  );
}
