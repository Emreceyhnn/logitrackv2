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
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  useTheme,
  alpha,
  LinearProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CategoryIcon from "@mui/icons-material/Category";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import mockData from "@/app/lib/mockData.json";

export interface InventoryItemDisplay {
  id: string;
  sku: string;
  name: string;
  category: string;
  onHand: number;
  unitPrice: number;
  status: string;
  warehouseCodes: string[];
  lastUpdated: string;
}

interface InventoryDetailDialogParams {
  open: boolean;
  onClose: () => void;
  item?: InventoryItemDisplay | null;
}

const InventoryDetailDialog = ({
  open,
  onClose,
  item,
}: InventoryDetailDialogParams) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  if (!item) return null;

  const stockDistribution = (() => {
    if (!mockData.inventory.stock) return [];

    const stockLines = mockData.inventory.stock.filter(
      (s) => s.skuId === item.id
    );

    return stockLines.map((line) => {
      const wh = mockData.warehouses.find((w) => w.id === line.warehouseId);
      return {
        warehouseName: wh?.name || "Unknown Warehouse",
        warehouseCode: wh?.code || line.warehouseId,
        available: line.quantity - line.reserved,
        onHand: line.quantity,
        reserved: line.reserved,
        location: (line as any).location || "N/A",
      };
    });
  })();

  /* -------------------------------- functions ------------------------------- */
  const getStatusColor = (status: string) => {
    if (status === "IN_STOCK") return "success";
    if (status === "LOW_STOCK") return "warning";
    return "error";
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          p: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Stack direction="row" spacing={2.5} alignItems="center">
            <Avatar
              variant="rounded"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                width: 64,
                height: 64,
                fontSize: "1.75rem",
                fontWeight: 700,
                borderRadius: 2,
              }}
            >
              {item.name.charAt(0)}
            </Avatar>
            <Stack spacing={0.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{ color: theme.palette.text.primary }}
                >
                  {item.name}
                </Typography>
                <Chip
                  label={item.status.replace(/_/g, " ")}
                  size="small"
                  color={getStatusColor(item.status) as any}
                  sx={{ fontWeight: 600, height: 24, borderRadius: 1 }}
                />
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <LocalOfferIcon
                    fontSize="small"
                    sx={{ color: "text.secondary", fontSize: "1rem" }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    SKU:{" "}
                    <Box
                      component="span"
                      sx={{ fontFamily: "monospace", fontWeight: 600 }}
                    >
                      {item.sku}
                    </Box>
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{
                    bgcolor: alpha(theme.palette.text.primary, 0.05),
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontWeight: 500,
                    color: "text.secondary",
                  }}
                >
                  Last Updated: {new Date().toLocaleDateString()}
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              size="small"
              sx={{
                textTransform: "none",
                borderColor: theme.palette.divider,
                color: theme.palette.text.secondary,
                "&:hover": {
                  borderColor: theme.palette.text.primary,
                  color: theme.palette.text.primary,
                },
              }}
            >
              Edit
            </Button>
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.text.secondary, 0.1),
                "&:hover": {
                  bgcolor: alpha(theme.palette.text.secondary, 0.2),
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            height: "100%",
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", md: "40%" },
              p: 3,
              borderRight: { md: `1px solid ${theme.palette.divider}` },
              borderBottom: {
                xs: `1px solid ${theme.palette.divider}`,
                md: "none",
              },
              bgcolor: alpha(theme.palette.background.default, 0.4),
            }}
          >
            <Typography
              variant="overline"
              color="text.secondary"
              fontWeight={700}
              letterSpacing={1.2}
            >
              Key Metrics
            </Typography>

            <Stack spacing={2} mt={2}>
              <Paper
                variant="outlined"
                sx={{ p: 2, borderRadius: 2, bgcolor: "background.paper" }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      color: theme.palette.info.main,
                    }}
                  >
                    <CategoryIcon />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      CATEGORY
                    </Typography>
                    <Typography variant="body1" fontWeight={700}>
                      {item.category}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              <Paper
                variant="outlined"
                sx={{ p: 2, borderRadius: 2, bgcolor: "background.paper" }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main,
                    }}
                  >
                    <Inventory2Icon />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      TOTAL STOCK
                    </Typography>
                    <Typography variant="body1" fontWeight={700}>
                      {item.onHand.toLocaleString()}{" "}
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        Units
                      </Typography>
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              <Paper
                variant="outlined"
                sx={{ p: 2, borderRadius: 2, bgcolor: "background.paper" }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                      color: theme.palette.warning.dark,
                    }}
                  >
                    <AttachMoneyIcon />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      UNIT PRICE
                    </Typography>
                    <Typography variant="body1" fontWeight={700}>
                      {new Intl.NumberFormat("en-TR", {
                        style: "currency",
                        currency: "TRY",
                      }).format(item.unitPrice)}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Box>

          <Box sx={{ width: { xs: "100%", md: "60%" }, p: 3 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography
                variant="overline"
                color="text.secondary"
                fontWeight={700}
                letterSpacing={1.2}
              >
                Warehouse Distribution
              </Typography>
              <Chip
                label={`${stockDistribution.length} Locations`}
                size="small"
                sx={{ height: 20, fontSize: "0.65rem", fontWeight: 600 }}
              />
            </Stack>

            <Paper
              variant="outlined"
              sx={{ borderRadius: 2, overflow: "hidden" }}
            >
              <Table size="small">
                <TableHead
                  sx={{ bgcolor: alpha(theme.palette.action.hover, 0.5) }}
                >
                  <TableRow>
                    <TableCell
                      sx={{
                        color: "text.secondary",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                      }}
                    >
                      WAREHOUSE
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: "text.secondary",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                      }}
                    >
                      AVAILABLE
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: "text.secondary",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                      }}
                    >
                      RESERVED
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stockDistribution.map((stock, idx) => (
                    <TableRow
                      key={idx}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <WarehouseIcon fontSize="small" color="action" />
                            <Typography variant="body2" fontWeight={600}>
                              {stock.warehouseName}
                            </Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            sx={{ pl: 3.5, width: "100%" }}
                          >
                            <LinearProgress
                              variant="determinate"
                              value={Math.min(
                                (stock.available / (stock.onHand || 1)) * 100,
                                100
                              )}
                              sx={{
                                flex: 1,
                                height: 4,
                                borderRadius: 2,
                                bgcolor:
                                  theme.palette.mode === "dark"
                                    ? "rgba(255,255,255,0.1)"
                                    : "rgba(0,0,0,0.1)",
                              }}
                            />
                          </Stack>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="success.main"
                        >
                          {stock.available}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" color="warning.main">
                          {stock.reserved}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                  {stockDistribution.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        align="center"
                        sx={{ py: 4, color: "text.secondary" }}
                      >
                        <Stack alignItems="center" spacing={1}>
                          <Inventory2Icon fontSize="large" color="disabled" />
                          <Typography variant="body2">
                            No stock recorded in any warehouse.
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Paper>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryDetailDialog;
