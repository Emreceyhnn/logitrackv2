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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InventoryIcon from "@mui/icons-material/Inventory";
import InventoryDetailDialog from "@/app/components/dialogs/inventory/inventoryDetailDialog";
import { StatusChip } from "@/app/components/chips/statusChips";

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  onHand: number;
  unitPrice: number;
  status: string; // 'IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'
  warehouseCodes: string[];
  lastUpdated: string;
}

interface InventoryTableProps {
  items: InventoryItem[];
}

const InventoryTable = ({ items }: InventoryTableProps) => {
  /* --------------------------------- states --------------------------------- */
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<InventoryItem | null>(null);

  /* -------------------------------- handlers -------------------------------- */
  const handleEditClick = (event: React.MouseEvent, item: InventoryItem) => {
    event.stopPropagation(); // Prevent row selection
    setDetailItem(item);
    setDetailOpen(true);
  };
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
            {visibleRows.map((row, index) => {
              const isItemSelected = isSelected(row.id);
              const labelId = `enhanced-table-checkbox-${index}`;

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
                        // src={`/images/products/${row.id}.jpg`} // Placeholder
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
                    <Chip
                      label={row.category}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: `${getStockColor(row.status)}.main`,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: `${getStockColor(row.status)}.main`,
                          fontWeight: 500,
                        }}
                      >
                        {row.onHand} {row.status === "LOW_STOCK" && "(Low)"}{" "}
                        {row.status === "OUT_OF_STOCK" && "(Out)"}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{formatPrice(row.unitPrice)}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5}>
                      {row.warehouseCodes.map((code) => (
                        <Chip
                          key={code}
                          label={code}
                          size="small"
                          sx={{ fontSize: "0.7rem", height: 20 }}
                        />
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => handleEditClick(e, row)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
            {visibleRows.length === 0 && (
              <TableRow style={{ height: 53 * 5 }}>
                <TableCell colSpan={8} align="center">
                  <Stack alignItems="center" spacing={2} sx={{ py: 5 }}>
                    <InventoryIcon
                      sx={{ fontSize: 48, color: "text.disabled" }}
                    />{" "}
                    {/* Need to import InventoryIcon here too if using it, or just Typography */}
                    <Typography color="text.secondary">
                      No inventory items found
                    </Typography>
                    <Button variant="outlined" size="small">
                      Clear Filters
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
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
      <InventoryDetailDialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        item={detailItem}
      />
    </Paper>
  );
};

export default InventoryTable;
