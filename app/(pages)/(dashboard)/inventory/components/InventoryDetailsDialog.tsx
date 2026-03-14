"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Paper,
  Stack,
  Typography,
  Chip,
  Divider,
  Avatar,
  useTheme,
  alpha,
  DialogActions,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Inventory as InventoryIcon,
  Scale as ScaleIcon,
  ViewInAr as VolumeIcon,
  GridOn as PalletIcon,
  Edit as EditIcon,
  Warehouse as WarehouseIcon,
  LocalOffer as LocalOfferIcon,
  History as HistoryIcon,
  Assessment as OverviewIcon,
  TrendingDown as OutIcon,
  TrendingUp as InIcon,
  Build as AdjustIcon,
} from "@mui/icons-material";
import { InventoryDetailsProps, InventoryMovement } from "@/app/lib/type/inventory";
import { getInventoryMovements } from "@/app/lib/controllers/inventory";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`inventory-tabpanel-${index}`}
      aria-labelledby={`inventory-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

export default function InventoryDetailsDialog({
  isOpen,
  onClose,
  item,
  onEdit,
}: InventoryDetailsProps) {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [loadingMovements, setLoadingMovements] = useState(false);

  useEffect(() => {
    if (isOpen && item && tabValue === 1) {
      loadMovements();
    }
  }, [isOpen, item, tabValue]);

  const loadMovements = async () => {
    if (!item) return;
    setLoadingMovements(true);
    try {
      const data = await getInventoryMovements(item.sku, item.warehouseId) as any[];
      setMovements(data);
    } catch (error) {
      console.error("Failed to load movements", error);
    } finally {
      setLoadingMovements(false);
    }
  };

  if (!item) return null;

  const isLowStock = item.quantity <= item.minStock;
  const statusLabel = item.quantity === 0 ? "OUT OF STOCK" : isLowStock ? "LOW STOCK" : "IN STOCK";
  const statusColor = item.quantity === 0 ? "error" : isLowStock ? "warning" : "success";

  const getMovementIcon = (type: string) => {
    switch (type) {
      case "PICK": return <OutIcon sx={{ color: "error.main" }} />;
      case "PUTAWAY": return <InIcon sx={{ color: "success.main" }} />;
      default: return <AdjustIcon sx={{ color: "info.main" }} />;
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          bgcolor: "#0B0F19",
          backgroundImage: "none",
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, pb: 0 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar
              variant="rounded"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                width: 64,
                height: 64,
                fontSize: "1.75rem",
                fontWeight: 800,
                borderRadius: 2,
              }}
            >
              {item.name.charAt(0)}
            </Avatar>
            <Stack spacing={0.5}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Typography variant="h6" fontWeight={800} color="white">
                  {item.name}
                </Typography>
                <Chip
                  label={statusLabel}
                  size="small"
                  sx={{ 
                    fontWeight: 700, 
                    height: 20,
                    fontSize: "0.65rem",
                    bgcolor: alpha(theme.palette[statusColor].main, 0.15),
                    color: theme.palette[statusColor].light,
                    border: `1px solid ${alpha(theme.palette[statusColor].main, 0.2)}`
                  }}
                />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                SKU: {item.sku} • {item.warehouse.name}
              </Typography>
            </Stack>
          </Stack>

          <IconButton onClick={onClose} sx={{ color: "text.secondary" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Tabs 
          value={tabValue} 
          onChange={(_, v) => setTabValue(v)}
          sx={{ 
            mt: 3,
            minHeight: 40,
            "& .MuiTab-root": {
              color: alpha("#fff", 0.4),
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              minHeight: 40,
              minWidth: 100,
              p: 0,
            },
            "& .Mui-selected": {
              color: `${theme.palette.primary.main} !important`,
            },
            "& .MuiTabs-indicator": {
              bgcolor: theme.palette.primary.main,
              height: 3,
              borderRadius: "3px 3px 0 0",
            }
          }}
        >
          <Tab icon={<OverviewIcon sx={{ fontSize: "1.1rem" }} />} iconPosition="start" label="Overview" />
          <Tab icon={<HistoryIcon sx={{ fontSize: "1.1rem" }} />} iconPosition="start" label="Inventory History" />
        </Tabs>
      </Box>

      <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.1) }} />

      <DialogContent sx={{ p: 0, minHeight: 400 }}>
        {/* Overview Tab */}
        <CustomTabPanel value={tabValue} index={0}>
          <Grid container>
            {/* Left Metrics */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{ p: 4, borderRight: { md: `1px solid ${alpha(theme.palette.divider, 0.1)}` }, bgcolor: alpha(theme.palette.background.default, 0.2), height: "100%" }}>
                <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ letterSpacing: "1px", textTransform: "uppercase" }}>
                  Stock Levels
                </Typography>
                
                <Stack spacing={2} mt={2}>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: alpha(theme.palette.background.paper, 0.05), borderColor: alpha(theme.palette.divider, 0.1), borderRadius: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                        <InventoryIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>AVAILABLE</Typography>
                        <Typography variant="h5" fontWeight={800} color="white">{item.quantity.toLocaleString()}</Typography>
                      </Box>
                    </Stack>
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 2, bgcolor: alpha(theme.palette.background.paper, 0.05), borderColor: alpha(theme.palette.divider, 0.1), borderRadius: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.light }}>
                        <WarehouseIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>SAFETY STOCK</Typography>
                        <Typography variant="h5" fontWeight={800} color="white">{item.minStock.toLocaleString()}</Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Stack>

                <Box mt={4}>
                  <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ letterSpacing: "1px", textTransform: "uppercase" }}>
                    Location Data
                  </Typography>
                  <Stack spacing={1} mt={1.5}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Warehouse Code</Typography>
                      <Typography variant="body2" fontWeight={600} color="white">{item.warehouse.code}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Cargo Type</Typography>
                      <Typography variant="body2" fontWeight={600} color="white">{item.cargoType || "General"}</Typography>
                    </Box>
                  </Stack>
                </Box>
              </Box>
            </Grid>

            {/* Right Specs */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Box sx={{ p: 4 }}>
                <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ letterSpacing: "1px", textTransform: "uppercase" }}>
                  Physical Specifications
                </Typography>

                <Grid container spacing={3} mt={1}>
                  <Grid size={4}>
                    <Paper variant="outlined" sx={{ p: 2, textAlign: "center", borderRadius: 3, bgcolor: alpha(theme.palette.background.paper, 0.02), borderColor: alpha(theme.palette.divider, 0.1) }}>
                      <ScaleIcon sx={{ color: "primary.main", mb: 1 }} />
                      <Typography variant="caption" display="block" color="text.secondary">WEIGHT</Typography>
                      <Typography variant="h6" fontWeight={800} color="white">{item.weightKg}kg</Typography>
                    </Paper>
                  </Grid>
                  <Grid size={4}>
                    <Paper variant="outlined" sx={{ p: 2, textAlign: "center", borderRadius: 3, bgcolor: alpha(theme.palette.background.paper, 0.02), borderColor: alpha(theme.palette.divider, 0.1) }}>
                      <VolumeIcon sx={{ color: "secondary.main", mb: 1 }} />
                      <Typography variant="caption" display="block" color="text.secondary">VOLUME</Typography>
                      <Typography variant="h6" fontWeight={800} color="white">{item.volumeM3}m³</Typography>
                    </Paper>
                  </Grid>
                  <Grid size={4}>
                    <Paper variant="outlined" sx={{ p: 2, textAlign: "center", borderRadius: 3, bgcolor: alpha(theme.palette.background.paper, 0.02), borderColor: alpha(theme.palette.divider, 0.1) }}>
                      <PalletIcon sx={{ color: "success.main", mb: 1 }} />
                      <Typography variant="caption" display="block" color="text.secondary">PALLETS</Typography>
                      <Typography variant="h6" fontWeight={800} color="white">{item.palletCount}</Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4, p: 2, borderRadius: 3, bgcolor: alpha(theme.palette.info.main, 0.05), border: `1px solid ${alpha(theme.palette.info.main, 0.1)}` }}>
                  <Typography variant="caption" fontWeight={700} color="info.light" sx={{ display: "block", mb: 0.5 }}>Architectural Intelligence</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.75rem", lineHeight: 1.5 }}>
                    Real-time stock monitoring is active. Re-stock workflows will trigger when quantity drops below {item.minStock} units.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CustomTabPanel>

        {/* History Tab */}
        <CustomTabPanel value={tabValue} index={1}>
          <Box sx={{ p: 0 }}>
            {loadingMovements ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
                <CircularProgress size={24} />
              </Box>
            ) : movements.length === 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, color: "text.secondary" }}>
                <HistoryIcon sx={{ fontSize: 48, opacity: 0.2, mb: 1 }} />
                <Typography variant="body2">No movement history recorded yet.</Typography>
              </Box>
            ) : (
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow sx={{ "& th": { bgcolor: alpha(theme.palette.background.paper, 0.1), color: "text.secondary", fontWeight: 700, fontSize: "0.7rem", borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` } }}>
                      <TableCell>TYPE</TableCell>
                      <TableCell align="right">QUANTITY</TableCell>
                      <TableCell>USER</TableCell>
                      <TableCell align="right">DATE</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {movements.map((move) => (
                      <TableRow key={move.id} sx={{ "& td": { color: "text.secondary", borderColor: alpha(theme.palette.divider, 0.05) } }}>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            {getMovementIcon(move.type)}
                            <Typography variant="body2" sx={{ color: "white", fontSize: "0.75rem", fontWeight: 600 }}>{move.type}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ color: move.quantity > 0 ? "success.light" : "error.light", fontWeight: 700 }}>
                            {move.quantity > 0 ? `+${move.quantity}` : move.quantity}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">{move.user ? `${move.user.name} ${move.user.surname}` : "System"}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="caption">{new Date(move.date).toLocaleString()}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </CustomTabPanel>
      </DialogContent>

      <Box sx={{ p: 3, px: 4, bgcolor: alpha(theme.palette.background.default, 0.1), borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button 
            onClick={onClose} 
            sx={{ px: 3, fontWeight: 600, color: "text.secondary", textTransform: "none", "&:hover": { color: "white" } }}
          >
            Close View
          </Button>
          <Button
            startIcon={<EditIcon />}
            variant="contained"
            onClick={() => onEdit(item.id)}
            sx={{ 
              minWidth: 160,
              borderRadius: 2, 
              fontWeight: 700,
              textTransform: "none",
              boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            Modify Specs
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}
