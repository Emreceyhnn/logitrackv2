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
  IconButton,
  Typography,
  Avatar,
  Stack,
  Chip,
  TablePagination,
  Box,
  useTheme,
  alpha,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InfoIcon from "@mui/icons-material/Info";

import { InventoryWithRelations } from "@/app/lib/type/inventory";
import TableSkeleton from "@/app/components/skeletons/TableSkeleton";

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
  loading = false,
  onSelect,
  onEdit,
  onDelete,
}: InventoryTableProps) => {
  /* --------------------------------- states --------------------------------- */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] =
    useState<InventoryWithRelations | null>(null);

  if (loading) {
    return <TableSkeleton title="Inventory List" rows={5} columns={8} />;
  }

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    item: InventoryWithRelations
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = (event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    setAnchorEl(null);
  };

  const handleAction = (action: "details" | "edit" | "delete") => {
    if (!selectedItem) return;
    if (action === "details") onSelect(selectedItem.id);
    if (action === "edit") onEdit?.(selectedItem);
    if (action === "delete") onDelete?.(selectedItem.id);
    handleMenuClose();
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

  /* -------------------------------- function -------------------------------- */
  const getStockColor = (status: string) => {
    if (status === "IN_STOCK") return "success";
    if (status === "LOW_STOCK") return "warning";
    return "error";
  };
  const formatPrice = (price: number) => {
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
        bgcolor: "transparent",
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        boxShadow: 0,
      }}
    >
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
          <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: "text.secondary", borderColor: alpha(theme.palette.divider, 0.1) }}>Product Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.secondary", borderColor: alpha(theme.palette.divider, 0.1) }}>SKU</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.secondary", borderColor: alpha(theme.palette.divider, 0.1) }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.secondary", borderColor: alpha(theme.palette.divider, 0.1) }}>Stock Level</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.secondary", borderColor: alpha(theme.palette.divider, 0.1) }}>Unit Price</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.secondary", borderColor: alpha(theme.palette.divider, 0.1) }}>Warehouses</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: "text.secondary", borderColor: alpha(theme.palette.divider, 0.1) }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4, borderColor: alpha(theme.palette.divider, 0.1) }}>
                  <Typography variant="body2" color="text.secondary">
                    No inventory items found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              items.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                const status = getStatus(row.quantity, row.minStock);
                const category = "General";
                const unitPrice = 100;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.2s ease-in-out",
                      "& td": { borderColor: alpha(theme.palette.divider, 0.1) },
                      "&:hover": { 
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                      }
                    }}
                  >
                    <TableCell component="th" id={labelId} scope="row">
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          variant="rounded"
                          src={row.imageUrl || undefined}
                          sx={{
                            bgcolor: "primary.light",
                            color: "primary.main",
                            width: 40,
                            height: 40,
                            fontSize: "1rem",
                            fontWeight: 600,
                            "& img": {
                              objectFit: "cover",
                            },
                          }}
                        >
                          {!row.imageUrl && row.name.charAt(0)}
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
                        onClick={(e) => handleMenuOpen(e, row)}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleMenuClose()}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => handleAction("details")}>
          <ListItemIcon>
            <InfoIcon fontSize="small" color="info" />
          </ListItemIcon>
          <ListItemText
            primary="Details"
            primaryTypographyProps={{ variant: "body2", fontWeight: 600 }}
          />
        </MenuItem>
        <MenuItem onClick={() => handleAction("edit")}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Edit"
            primaryTypographyProps={{ variant: "body2", fontWeight: 600 }}
          />
        </MenuItem>
        <MenuItem
          onClick={() => handleAction("delete")}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText
            primary="Delete"
            primaryTypographyProps={{ variant: "body2", fontWeight: 600 }}
          />
        </MenuItem>
      </Menu>
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
