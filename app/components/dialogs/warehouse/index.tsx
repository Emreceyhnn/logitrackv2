import { WarehouseWithRelations } from "@/app/lib/type/warehouse";
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

interface WarehouseDialogParams {
  open: boolean;
  onClose: () => void;
  warehouseData?: WarehouseWithRelations;
}

const WarehouseDialog = ({
  open,
  onClose,
  warehouseData,
}: WarehouseDialogParams) => {
  if (!warehouseData) return null;

  // Safe defaults if capacity is missing (using Prisma defaults or 0)
  const capacity = {
    maxPallets: warehouseData.capacityPallets || 5000,
    usedPallets: 0, // Not yet tracked in backend
    maxVolumeM3: warehouseData.capacityVolumeM3 || 100000,
    usedVolumeM3: 0, // Not yet tracked in backend
  };

  const palletPct =
    Math.round((capacity.usedPallets / capacity.maxPallets) * 100) || 0;

  const volumePct =
    Math.round((capacity.usedVolumeM3 / capacity.maxVolumeM3) * 100) || 0;

  // Use inventory from props or empty
  const inventoryItems = warehouseData.inventory || [];

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
                    {warehouseData.address}, <br />
                    {warehouseData.city}, {warehouseData.country}
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
                    {warehouseData.operatingHours || "N/A"}
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
                    {capacity.usedPallets.toLocaleString()} /{" "}
                    {capacity.maxPallets.toLocaleString()}
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
                    {capacity.usedVolumeM3.toLocaleString()} /{" "}
                    {capacity.maxVolumeM3.toLocaleString()} m³
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>

          {/* Manager Details (Replaces Contacts) */}
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
              Warehouse Manager
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                backgroundColor: "rgba(255,255,255,0.02)",
                borderRadius: 2,
              }}
            >
              {warehouseData.manager ? (
                <Stack direction="row" spacing={2} alignItems="center">
                  <PersonIcon sx={{ color: "text.secondary", fontSize: 40 }} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {warehouseData.manager.name}{" "}
                      {warehouseData.manager.surname}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {warehouseData.manager.email}
                    </Typography>
                  </Box>
                </Stack>
              ) : (
                <Typography color="text.secondary">
                  No manager assigned.
                </Typography>
              )}
            </Paper>
          </Box>

          {/* Current Inventory - Simplified */}
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
                {/* Simplified */}
              </Typography>
            </Stack>

            <Paper
              variant="outlined"
              sx={{ p: 2, bgcolor: "rgba(255,255,255,0.02)" }}
            >
              <Typography variant="body2" color="text.secondary" align="center">
                Detailed inventory view requires SKU relation fetching.
                (Available in Inventory Module)
              </Typography>
            </Paper>
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
