"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Typography,
  Avatar,
  Stack,
  Chip,
  TablePagination,
  Box,
  Button,
  Skeleton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InventoryIcon from "@mui/icons-material/Inventory";

import { StatusChip } from "@/app/components/chips/statusChips";

import { InventoryWithRelations } from "@/app/lib/type/inventory";
interface InventoryTableProps {
  items: InventoryWithRelations[];
  loading?: boolean;
  onSelect: (id: string) => void;
  onEdit?: (item: InventoryWithRelations) => void;
  onDelete?: (id: string) => void;
}

// Helper to derive status for UI
const getStatus = (quantity: number, minStock: number) => {
  if (quantity === 0) return "OUT_OF_STOCK";
  if (quantity <= minStock) return "LOW_STOCK";
  return "IN_STOCK";
};

const InventoryTable = ({
  items,
  loading,
  onSelect,
  onEdit,
  onDelete,
}: InventoryTableProps) => {
  /* --------------------------------- states --------------------------------- */
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = items.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };
  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /* -------------------------------- variables ------------------------------- */
  const isSelected = (id: string) => selected.indexOf(id) !== -1;
  const visibleRows = items.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  /* -------------------------------- function -------------------------------- */
  const getStockColor = (status: string) => {
    if (status === "IN_STOCK") return "success";
    if (status === "LOW_STOCK") return "warning";
    return "error";
  };
  const formatPrice = (price: number) => {
    // Check if Intl is supported or fallback
    try {
      return new Intl.NumberFormat("en-TR", {
        style: "currency",
        currency: "TRY",
      }).format(price);
    } catch {
      return `₺${price.toFixed(2)}`;
    }
  };

  return (
    <Paper
      sx={{
        width: "100%",
        mb: 2,
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: 0,
      }}
    >
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
          <TableHead sx={{ bgcolor: "background.default" }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={
                    selected.length > 0 && selected.length < items.length
                  }
                  checked={items.length > 0 && selected.length === items.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Product Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>SKU</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Stock Level</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Unit Price</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Warehouses</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from(new Array(5)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell padding="checkbox">
                    <Skeleton variant="rectangular" width={20} height={20} />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Skeleton variant="circular" width={40} height={40} />
                      <Skeleton variant="text" width={140} />
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={80} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={80} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rounded" width={90} height={24} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={60} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={100} />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton variant="circular" width={28} height={28} />
                  </TableCell>
                </TableRow>
              ))
            ) : visibleRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No inventory items found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;
                const status = getStatus(row.quantity, row.minStock);

                // Mock fields for UI preservation (until DB has them)
                const category = "General";
                const unitPrice = 100; // Placeholder

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row">
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          variant="rounded"
                          sx={{
                            bgcolor: "primary.light",
                            color: "primary.main",
                            width: 40,
                            height: 40,
                            fontSize: "1rem",
                            fontWeight: 600,
                          }}
                        >
                          {row.name.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" fontWeight={600}>
                          {row.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{row.sku}</TableCell>
                    <TableCell>
                      <Chip label={category} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: `${getStockColor(status)}.main`,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            color: `${getStockColor(status)}.main`,
                            fontWeight: 500,
                          }}
                        >
                          {row.quantity} {status === "LOW_STOCK" && "(Low)"}{" "}
                          {status === "OUT_OF_STOCK" && "(Out)"}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{formatPrice(unitPrice)}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <Chip
                          key={row.warehouseId}
                          label={row.warehouse.code}
                          size="small"
                          sx={{ fontSize: "0.7rem", height: 20 }}
                        />
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit?.(row);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete?.(row.id);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={items.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default InventoryTable;
