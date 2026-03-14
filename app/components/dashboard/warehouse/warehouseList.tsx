import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  LinearProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState } from "react";
import CustomCard from "../../cards/card";
import {
  WarehouseTableProps,
} from "@/app/lib/type/warehouse";
import TableSkeleton from "@/app/components/skeletons/TableSkeleton";

const WarehouseListTable = ({
  warehouses,
  loading,
  onSelect,
  onEdit,
  onDelete,
  onDetails,
}: WarehouseTableProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRowId, setMenuRowId] = useState<string | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, id: string) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuRowId(id);
  };

  const handleMenuClose = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    setAnchorEl(null);
    setMenuRowId(null);
  };

  const handleEditClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onEdit && menuRowId) {
      onEdit(menuRowId);
    }
    handleMenuClose();
  };

  const handleDetailsClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onDetails && menuRowId) {
      onDetails(menuRowId);
    }
    handleMenuClose();
  };

  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onDelete && menuRowId) {
      onDelete(menuRowId);
    }
    handleMenuClose();
  };

  if (loading) {
    return <TableSkeleton title="Warehouse List" rows={5} columns={7} />;
  }

  return (
    <CustomCard sx={{ p: 3, borderRadius: "12px", boxShadow: 3 }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Warehouse List
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              >
                CODE
              </TableCell>
              <TableCell
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              >
                NAME
              </TableCell>
              <TableCell
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              >
                CITY
              </TableCell>
              <TableCell
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  width: "25%",
                }}
              >
                CAPACITY (PALLETS)
              </TableCell>
              <TableCell
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  width: "25%",
                }}
              >
                CAPACITY (VOLUME)
              </TableCell>
              <TableCell
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  textAlign: "right",
                }}
              >
                OPERATING HOURS
              </TableCell>
              <TableCell
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  textAlign: "right",
                  width: 60,
                }}
              >
                ACTIONS
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {warehouses.map((warehouse) => {
              const usedPallets = (warehouse._count?.inventory || 0) * 10;
              const totalPallets = warehouse.capacityPallets || 5000;
              const usedVolume = (warehouse._count?.inventory || 0) * 5;
              const totalVolume = warehouse.capacityVolumeM3 || 100000;

              const palletPct = (usedPallets / totalPallets) * 100;
              const volumePct = (usedVolume / totalVolume) * 100;

              const operatingHours =
                warehouse.operatingHours || "08:00 - 18:00";

              return (
                <TableRow
                  key={warehouse.id}
                  hover
                  onClick={() => onSelect(warehouse.id)}
                  sx={{ 
                    cursor: "pointer",
                    "&:last-child td, &:last-child th": { border: 0 } 
                  }}
                >
                  <TableCell sx={{ fontWeight: 600 }}>
                    {warehouse.code}
                  </TableCell>
                  <TableCell>{warehouse.name}</TableCell>
                  <TableCell>{warehouse.city}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <LinearProgress
                        variant="determinate"
                        value={palletPct}
                        sx={{
                          flex: 1,
                          height: 6,
                          borderRadius: 3,
                          bgcolor: "rgba(255,255,255,0.05)",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: "#3b82f6",
                            borderRadius: 3,
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ minWidth: 80, fontFamily: "monospace" }}
                      >
                        {usedPallets.toLocaleString()} /{" "}
                        {totalPallets.toLocaleString()}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <LinearProgress
                        variant="determinate"
                        value={volumePct}
                        sx={{
                          flex: 1,
                          height: 6,
                          borderRadius: 3,
                          bgcolor: "rgba(255,255,255,0.05)",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: "#10b981",
                            borderRadius: 3,
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ minWidth: 100, fontFamily: "monospace" }}
                      >
                        {usedVolume.toLocaleString()}k /{" "}
                        {totalVolume.toLocaleString()}k m³
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right" sx={{ fontFamily: "monospace" }}>
                    {typeof operatingHours === "object"
                      ? (operatingHours as any).monFri
                      : operatingHours}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, warehouse.id)}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
            {warehouses.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  No warehouses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleMenuClose()}
        PaperProps={{
          elevation: 3,
          sx: { minWidth: 150, borderRadius: 2, mt: 1 },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleEditClick}>
          <EditIcon fontSize="small" sx={{ mr: 1.5, color: "text.secondary" }} />
          <Typography variant="body2">Edit Warehouse</Typography>
        </MenuItem>
        <MenuItem onClick={handleDetailsClick}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1.5, color: "text.secondary" }} />
          <Typography variant="body2">View Details</Typography>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1.5, color: "inherit" }} />
          <Typography variant="body2">Delete Warehouse</Typography>
        </MenuItem>
      </Menu>
    </CustomCard>
  );
};

export default WarehouseListTable;
