import { Warehouse } from "@/app/lib/types";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import mockData from "@/app/lib/mockData.json";

interface WarehouseDialogParams {
  open: boolean;
  onClose: () => void;
  warehouseData?: Warehouse;
}

const WarehouseDialog = ({
  open,
  onClose,
  warehouseData,
}: WarehouseDialogParams) => {
  if (!warehouseData) return null;

  const warehouseStock = mockData.inventory.stock.filter(
    (s) => s.warehouseId === warehouseData.id
  );

  const inventoryItems = warehouseStock
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)
    .map((stockItem) => {
      const catalogItem = mockData.inventory.catalog.find(
        (c) => c.id === stockItem.skuId
      );
      return {
        name: catalogItem?.name || stockItem.skuId,
        qty: stockItem.quantity,
        code: catalogItem?.code || stockItem.skuId,

        onHand: stockItem.quantity,
        reserved: stockItem.reserved,
        available: stockItem.quantity - stockItem.reserved,
        details: catalogItem,
      };
    });

  const palletPct = Math.round(
    (warehouseData.capacity.usedPallets / warehouseData.capacity.maxPallets) *
      100
  );
  const volumePct = Math.round(
    (warehouseData.capacity.usedVolumeM3 / warehouseData.capacity.maxVolumeM3) *
      100
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          backgroundImage: "none",
        },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ p: 3, pb: 1 }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">
            {warehouseData.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {warehouseData.code}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            size="small"
            sx={{
              color: "text.primary",
              borderColor: "rgba(255,255,255,0.2)",
              textTransform: "none",
            }}
          >
            Edit
          </Button>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </Stack>

      <DialogContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={4} flexWrap="wrap" useFlexGap>
          <Box sx={{ width: { xs: "100%", md: "calc(50% - 16px)" } }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              gutterBottom
              sx={{
                textTransform: "uppercase",
                fontSize: "0.75rem",
                letterSpacing: 1,
                mb: 2,
              }}
            >
              General Information
            </Typography>

            <Stack spacing={3}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <LocationOnIcon
                  color="action"
                  fontSize="medium"
                  sx={{ mt: 0 }}
                />
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Address
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5, lineHeight: 1.6 }}
                  >
                    {warehouseData.address.line1},{" "}
                    {warehouseData.address.district}
                    <br />
                    {warehouseData.address.city},{" "}
                    {warehouseData.address.country}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="flex-start">
                <AccessTimeIcon
                  color="action"
                  fontSize="medium"
                  sx={{ mt: 0 }}
                />
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Opening Hours
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5, lineHeight: 1.6 }}
                  >
                    Mon - Sat: {warehouseData.operatingHours.monFri}
                    <br />
                    Sunday: Closed
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>

          <Box sx={{ width: { xs: "100%", md: "calc(50% - 16px)" } }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              gutterBottom
              sx={{
                textTransform: "uppercase",
                fontSize: "0.75rem",
                letterSpacing: 1,
                mb: 2,
              }}
            >
              Live Capacity Utilization
            </Typography>

            <Paper
              variant="outlined"
              sx={{
                p: 3,
                backgroundColor: "rgba(255,255,255,0.02)",
                borderRadius: 2,
              }}
            >
              <Stack
                direction="row"
                spacing={4}
                justifyContent="space-around"
                alignItems="center"
              >
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Box sx={{ width: 100, height: 100, mb: 2 }}>
                    <Gauge
                      value={palletPct}
                      startAngle={0}
                      endAngle={360}
                      innerRadius="80%"
                      outerRadius="100%"
                      cornerRadius="50%"
                      sx={{
                        [`& .${gaugeClasses.valueText}`]: {
                          fontSize: 24,
                          fontWeight: "bold",
                          transform: "translate(0px, 0px)",
                        },
                        [`& .${gaugeClasses.valueArc}`]: {
                          fill: "#3b82f6",
                        },
                      }}
                      text={`${palletPct}%`}
                    />
                  </Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    PALLETS
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {warehouseData.capacity.usedPallets.toLocaleString()} /{" "}
                    {warehouseData.capacity.maxPallets.toLocaleString()}
                  </Typography>
                </Box>

                <Box display="flex" flexDirection="column" alignItems="center">
                  <Box sx={{ width: 100, height: 100, mb: 2 }}>
                    <Gauge
                      value={volumePct}
                      startAngle={0}
                      endAngle={360}
                      innerRadius="80%"
                      outerRadius="100%"
                      cornerRadius="50%"
                      sx={{
                        [`& .${gaugeClasses.valueText}`]: {
                          fontSize: 24,
                          fontWeight: "bold",
                          transform: "translate(0px, 0px)",
                        },
                        [`& .${gaugeClasses.valueArc}`]: {
                          fill: "#10b981",
                        },
                      }}
                      text={`${volumePct}%`}
                    />
                  </Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    VOLUME
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {warehouseData.capacity.usedVolumeM3.toLocaleString()} /{" "}
                    {warehouseData.capacity.maxVolumeM3.toLocaleString()} m³
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>

          {/* Contact Details */}
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              gutterBottom
              sx={{
                textTransform: "uppercase",
                fontSize: "0.75rem",
                letterSpacing: 1,
                mb: 2,
              }}
            >
              Contact Details
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                backgroundColor: "rgba(255,255,255,0.02)",
                borderRadius: 2,
              }}
            >
              <Stack spacing={2}>
                {warehouseData.contacts.map((contact, idx) => (
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    flexWrap="wrap"
                    useFlexGap
                    key={idx}
                  >
                    <Box
                      sx={{ width: { xs: "100%", sm: "calc(33.33% - 11px)" } }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <PersonIcon sx={{ color: "text.secondary" }} />
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {contact.name}
                          </Typography>
                          {contact.role && (
                            <Chip
                              label={contact.role}
                              size="small"
                              variant="outlined"
                              sx={{ height: 20, fontSize: "0.65rem", mt: 0.5 }}
                            />
                          )}
                        </Box>
                      </Stack>
                    </Box>
                    <Box
                      sx={{ width: { xs: "100%", sm: "calc(33.33% - 11px)" } }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <PhoneIcon sx={{ color: "text.secondary" }} />
                        <Typography variant="body2">{contact.phone}</Typography>
                      </Stack>
                    </Box>
                    <Box
                      sx={{ width: { xs: "100%", sm: "calc(33.33% - 11px)" } }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <EmailIcon sx={{ color: "text.secondary" }} />
                        <Typography variant="body2">{contact.email}</Typography>
                      </Stack>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Box>

          {/* Current Inventory */}
          <Box sx={{ width: "100%" }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  letterSpacing: 1,
                }}
              >
                Current Inventory
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Showing top {inventoryItems.length} items
              </Typography>
            </Stack>

            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{
                backgroundColor: "rgba(255,255,255,0.02)",
                borderRadius: 2,
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                    <TableCell
                      sx={{
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        py: 1.5,
                      }}
                    >
                      SKU
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        py: 1.5,
                      }}
                    >
                      NAME
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        py: 1.5,
                      }}
                    >
                      ON HAND
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        py: 1.5,
                      }}
                    >
                      RESERVED
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        py: 1.5,
                      }}
                    >
                      AVAILABLE
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inventoryItems.map((item) => (
                    <TableRow
                      key={item.code}
                      hover
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ fontSize: "0.85rem", fontWeight: 500 }}
                      >
                        {item.details?.code || item.code}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.85rem" }}>
                        {item.details?.name}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ fontSize: "0.85rem", color: "text.secondary" }}
                      >
                        {item.onHand}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ fontSize: "0.85rem", color: "#fbbf24" }}
                      >
                        {item.reserved}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontSize: "0.85rem",
                          color: "#10b981",
                          fontWeight: "bold",
                        }}
                      >
                        {item.available}
                      </TableCell>
                    </TableRow>
                  ))}
                  {inventoryItems.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        align="center"
                        sx={{ py: 3, color: "text.secondary" }}
                      >
                        No inventory data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Stack>
      </DialogContent>

      <Divider />

      <Stack
        direction="row"
        justifyContent="flex-end"
        spacing={2}
        sx={{ p: 3 }}
      >
        <Button onClick={onClose} sx={{ color: "text.secondary" }}>
          Close
        </Button>
        <Button variant="contained" color="primary" sx={{ px: 3 }}>
          View Detailed Reports
        </Button>
      </Stack>
    </Dialog>
  );
};

export default WarehouseDialog;
