import {
  alpha,
  Avatar,
  Box,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Stack,
  Typography,
  useTheme,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BusinessIcon from "@mui/icons-material/Business";
import { ShipmentWithRelations } from "@/app/lib/type/shipment";
import { StatusChip } from "@/app/components/chips/statusChips";
import DriverCard from "../../cards/driverCard";
import MapRoutesDialogCard from "../routes/map";
import { DriverWithRelations } from "@/app/lib/type/driver";

interface ShipmentDetailDialogProps {
  // Renamed interface
  open: boolean;
  onClose: () => void;
  shipment: ShipmentWithRelations | null; // Changed type and name
}

export default function ShipmentDetailDialog({
  open,
  onClose,
  shipment,
}: ShipmentDetailDialogProps) {
  const theme = useTheme();

  if (!shipment) return null;

  const mapOrigin =
    shipment.originLat && shipment.originLng
      ? {
          lat: Number(shipment.originLat),
          lng: Number(shipment.originLng),
        }
      : shipment.route?.startLat && shipment.route?.startLng
        ? {
            lat: Number(shipment.route.startLat),
            lng: Number(shipment.route.startLng),
          }
        : undefined;

  const mapDestination =
    shipment.destinationLat && shipment.destinationLng
      ? {
          lat: Number(shipment.destinationLat),
          lng: Number(shipment.destinationLng),
        }
      : undefined;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: "#0B1019",
          backgroundImage: "none",
          overflow: "hidden",
          border: `1px solid ${alpha("#fff", 0.05)}`,
          maxHeight: "90vh",
        },
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          p: 3,
          background: `linear-gradient(to right, ${alpha(theme.palette.primary.main, 0.15)}, transparent)`,
          borderBottom: `1px solid ${alpha("#fff", 0.05)}`,
          position: "relative",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack spacing={0.5}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography variant="h5" fontWeight={800} color="white">
                {shipment.trackingId}
              </Typography>
              <StatusChip status={shipment.status} />
            </Stack>
            <Typography variant="caption" color="text.secondary">
              SYSTEM CONSIGNMENT ID: {shipment.id.substring(0, 8).toUpperCase()}
            </Typography>
          </Stack>
          <IconButton
            onClick={onClose}
            sx={{
              color: "text.secondary",
              bgcolor: alpha("#fff", 0.05),
              "&:hover": { bgcolor: alpha("#fff", 0.1) },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column" }}>
        <Stack direction={{ xs: "column", md: "row" }} sx={{ flex: 1 }}>
          {/* Left Column - Information */}
          <Box
            sx={{
              width: { xs: "100%", md: "400px" },
              borderRight: `1px solid ${alpha("#fff", 0.05)}`,
              bgcolor: alpha("#0B1019", 0.4),
              overflowY: "auto",
              p: 3,
            }}
          >
            <Stack spacing={4}>
              {/* Assignment Section */}
              <Box>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="text.secondary"
                  sx={{ textTransform: "uppercase", mb: 2, display: "block" }}
                >
                  Assignment Details
                </Typography>
                {shipment.driver ? (
                  <DriverCard
                    {...(shipment.driver as unknown as DriverWithRelations)}
                  />
                ) : (
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: alpha("#fff", 0.02),
                      border: `1px dashed ${alpha("#fff", 0.1)}`,
                      borderRadius: 2,
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      No Driver Assigned
                    </Typography>
                  </Paper>
                )}
              </Box>

              {/* Journey Timeline Section */}
              <Box>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="text.secondary"
                  sx={{ textTransform: "uppercase", mb: 2, display: "block" }}
                >
                  Mission Path
                </Typography>
                <Box sx={{ position: "relative", pl: 4 }}>
                  {/* Vertical Line */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: 11,
                      top: 10,
                      bottom: 10,
                      width: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundImage: `linear-gradient(to bottom, ${theme.palette.primary.main} 50%, transparent 50%)`,
                        backgroundSize: "1px 8px",
                      },
                    }}
                  />

                  <Stack spacing={4}>
                    <Box sx={{ position: "relative" }}>
                      <Box
                        sx={{
                          position: "absolute",
                          left: -33,
                          top: 4,
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: theme.palette.primary.main,
                          boxShadow: `0 0 10px ${theme.palette.primary.main}`,
                        }}
                      />
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        color="white"
                      >
                        Pickup Origin
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {shipment.origin || "Not specified"}
                      </Typography>
                    </Box>

                    <Box sx={{ position: "relative" }}>
                      <Box
                        sx={{
                          position: "absolute",
                          left: -33,
                          top: 4,
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: theme.palette.error.main,
                          boxShadow: `0 0 10px ${theme.palette.error.main}`,
                        }}
                      />
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        color="white"
                      >
                        Final Delivery
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {shipment.destination || "Not specified"}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Box>

              {/* Shipment Specs Section */}
              <Box>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="text.secondary"
                  sx={{ textTransform: "uppercase", mb: 2, display: "block" }}
                >
                  Consignment Specs
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha("#fff", 0.03),
                      border: `1px solid ${alpha("#fff", 0.05)}`,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Quantity
                    </Typography>
                    <Typography variant="h6" fontWeight={800} color="white">
                      {shipment.itemsCount || 0}
                      <Typography component="span" variant="caption" ml={0.5}>
                        units
                      </Typography>
                    </Typography>
                  </Box>
                  {shipment.weightKg && (
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: alpha("#fff", 0.03),
                        border: `1px solid ${alpha("#fff", 0.05)}`,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Gross Weight
                      </Typography>
                      <Typography variant="h6" fontWeight={800} color="white">
                        {shipment.weightKg}
                        <Typography component="span" variant="caption" ml={0.5}>
                          kg
                        </Typography>
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Customer Info Card */}
              {shipment.customer && (
                <Box>
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    color="text.secondary"
                    sx={{ textTransform: "uppercase", mb: 1, display: "block" }}
                  >
                    Customer Entity
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    }}
                  >
                    <Avatar
                      variant="rounded"
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        color: "white",
                        width: 40,
                        height: 40,
                      }}
                    >
                      <BusinessIcon />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        color="white"
                      >
                        {shipment.customer.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Client Partner
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              )}
            </Stack>
          </Box>

          {/* Right Column - Map Visualization */}
          <Box sx={{ flex: 1, position: "relative", minHeight: 400 }}>
            <MapRoutesDialogCard
              origin={mapOrigin}
              destination={mapDestination}
            />

            {/* Overlay Stats (Optional / Integrated into map styles usually) */}
            <Box
              sx={{
                position: "absolute",
                bottom: 24,
                left: 24,
                right: 24,
                bgcolor: alpha("#0B1019", 0.8),
                backdropFilter: "blur(12px)",
                borderRadius: 3,
                p: 2,
                border: `1px solid ${alpha("#fff", 0.1)}`,
                display: "flex",
                justifyContent: "space-around",
                zIndex: 1,
              }}
            >
              <Stack alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  MILEAGE
                </Typography>
                <Typography variant="subtitle1" fontWeight={800} color="white">
                  {shipment.route?.distanceKm
                    ? `${shipment.route.distanceKm} km`
                    : "TBD"}
                </Typography>
              </Stack>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ borderColor: alpha("#fff", 0.1) }}
              />
              <Stack alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  DURATION
                </Typography>
                <Typography variant="subtitle1" fontWeight={800} color="white">
                  {shipment.route?.durationMin
                    ? `${shipment.route.durationMin} min`
                    : "TBD"}
                </Typography>
              </Stack>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ borderColor: alpha("#fff", 0.1) }}
              />
              <Stack alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  FLEET ID
                </Typography>
                <Typography variant="subtitle1" fontWeight={800} color="white">
                  {shipment.route?.id
                    ? `RT-${shipment.route.id.substring(0, 4).toUpperCase()}`
                    : "NO UNIT"}
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
