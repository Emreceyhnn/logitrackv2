"use client";
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
  alpha,
  useTheme,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState } from "react";
import { WarehouseTableProps } from "@/app/lib/type/warehouse";
import TableSkeleton from "@/app/components/skeletons/TableSkeleton";

const WarehouseListTable = ({
  warehouses,
  loading,
  onSelect,
  onEdit,
  onDelete,
  onDetails,
}: WarehouseTableProps) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRowId, setMenuRowId] = useState<string | null>(null);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    id: string
  ) => {
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
    <>
      <TableContainer sx={{ p: 0 }}>
        <Table size="small" sx={{ minWidth: 1000 }}>
          <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
            <TableRow>
              {[
                "Code",
                "Name",
                "Type / City",
                "Capacity (Pallets)",
                "Capacity (Volume)",
                "Operating Hours",
                "",
              ].map((head, idx) => (
                <TableCell
                  key={idx}
                  sx={{
                    borderColor: alpha(theme.palette.divider, 0.1),
                    ...(head === "" && { width: 60 }),
                  }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{ "& tr:last-child td": { border: 0 } }}>
            {warehouses.map((warehouse) => {
              const usedPallets = (warehouse._count?.inventory || 0) * 10;
              const totalPallets = warehouse.capacityPallets || 5000;
              const usedVolume = (warehouse._count?.inventory || 0) * 5;
              const totalVolume = warehouse.capacityVolumeM3 || 100000;

              const palletPct = Math.min(
                (usedPallets / totalPallets) * 100,
                100
              );
              const volumePct = Math.min((usedVolume / totalVolume) * 100, 100);

              const operatingHours = warehouse.operatingHours || "24/7";

              return (
                <TableRow
                  key={warehouse.id}
                  hover
                  onClick={() => onSelect(warehouse.id)}
                  sx={{
                    cursor: "pointer",
                    "& td": { borderColor: alpha(theme.palette.divider, 0.1) },
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.02),
                    },
                    transition: "background-color 0.2s ease",
                  }}
                >
                  <TableCell>
                    <Typography
                      variant="body2"
                      fontWeight={800}
                      color="primary.main"
                    >
                      {warehouse.code}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={700}>
                      {warehouse.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ opacity: 0.7 }}
                    >
                      {warehouse.address?.split(",")[0]}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Typography
                        variant="caption"
                        sx={{
                          px: 1,
                          py: 0.2,
                          borderRadius: 1,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          fontWeight: 800,
                          fontSize: "0.6rem",
                          textTransform: "uppercase",
                          width: "fit-content",
                        }}
                      >
                        {warehouse.type.replace("_", " ")}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="text.secondary"
                      >
                        {warehouse.city}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "20%",
                    }}
                  >
                    <Stack spacing={1}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography
                          variant="caption"
                          fontWeight={700}
                          color="text.secondary"
                        >
                          {palletPct.toFixed(0)}% Utilized
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ fontFamily: "monospace", opacity: 0.6 }}
                        >
                          {usedPallets.toLocaleString()} /{" "}
                          {totalPallets.toLocaleString()}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={palletPct}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: alpha(theme.palette.divider, 0.05),
                          "& .MuiLinearProgress-bar": {
                            bgcolor:
                              palletPct > 85 ? "error.main" : "primary.main",
                            borderRadius: 3,
                            boxShadow: `0 0 8px ${alpha(palletPct > 85 ? theme.palette.error.main : theme.palette.primary.main, 0.4)}`,
                          },
                        }}
                      />
                    </Stack>
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "20%",
                    }}
                  >
                    <Stack spacing={1}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography
                          variant="caption"
                          fontWeight={700}
                          color="text.secondary"
                        >
                          {volumePct.toFixed(0)}% Space
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ fontFamily: "monospace", opacity: 0.6 }}
                        >
                          {usedVolume.toLocaleString()} /{" "}
                          {totalVolume.toLocaleString()} m³
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={volumePct}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: alpha(theme.palette.divider, 0.05),
                          "& .MuiLinearProgress-bar": {
                            bgcolor: "success.main",
                            borderRadius: 3,
                            boxShadow: `0 0 8px ${alpha(theme.palette.success.main, 0.4)}`,
                          },
                        }}
                      />
                    </Stack>
                  </TableCell>
                  <TableCell
                    align="right"
                  >
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ fontFamily: "monospace" }}
                    >
                      {typeof operatingHours === "object" &&
                      operatingHours !== null &&
                      "monFri" in operatingHours
                        ? (operatingHours as { monFri: string }).monFri
                        : operatingHours}
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="right"
                  >
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, warehouse.id)}
                      sx={{
                        color: "text.secondary",
                        "&:hover": {
                          color: "primary.main",
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                        },
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleMenuClose()}
        PaperProps={{
          elevation: 0,
          sx: {
            minWidth: 180,
            borderRadius: "16px",
            mt: 1,
            bgcolor: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: "blur(10px)",
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: `0 10px 40px ${alpha("#000", 0.3)}`,
            "& .MuiMenuItem-root": {
              borderRadius: "8px",
              mx: 1,
              my: 0.5,
              py: 1,
              transition: "all 0.2s",
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleEditClick}>
          <EditIcon fontSize="small" sx={{ mr: 1.5, color: "inherit" }} />
          <Typography variant="body2" fontWeight={600}>
            Edit Warehouse
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleDetailsClick}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1.5, color: "inherit" }} />
          <Typography variant="body2" fontWeight={600}>
            View Details
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={handleDeleteClick}
          sx={{
            color: "error.main",
            "&:hover": {
              bgcolor: alpha(theme.palette.error.main, 0.1) + " !important",
            },
          }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1.5, color: "inherit" }} />
          <Typography variant="body2" fontWeight={600}>
            Delete Factory
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default WarehouseListTable;
