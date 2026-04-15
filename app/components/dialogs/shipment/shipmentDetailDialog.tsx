import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BusinessIcon from "@mui/icons-material/Business";
import { ShipmentWithRelations } from "@/app/lib/type/shipment";
import { StatusChip } from "@/app/components/chips/statusChips";
import DriverCard from "../../cards/driverCard";
import MapRoutesDialogCard from "../routes/map";
import { DriverWithRelations } from "@/app/lib/type/driver";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

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
  const dict = useDictionary();

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
          border: "1px solid theme.palette.common.white_alpha.main_05",
          maxHeight: "90vh",
        },
      }}
    >
      <Box
        sx={{
          p: 3,
          background: `linear-gradient(to right, theme.palette.primary._alpha.main_15, transparent)`,
          borderBottom: "1px solid theme.palette.common.white_alpha.main_05",
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
              {dict.shipments.details.systemConsignmentId}:{" "}
              {shipment.id.substring(0, 8).toUpperCase()}
            </Typography>
          </Stack>
          <IconButton
            onClick={onClose}
            sx={{
              color: "text.secondary",
              bgcolor: "theme.palette.common.white_alpha.main_05",
              "&:hover": {
                bgcolor: "theme.palette.common.white_alpha.main_10",
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column" }}>
        <Stack direction={{ xs: "column", md: "row" }} sx={{ flex: 1 }}>
          <Box
            sx={{
              width: { xs: "100%", md: "400px" },
              borderRight: "1px solid theme.palette.common.white_alpha.main_05",
              bgcolor: "theme.palette.background.midnight._alpha.main_40",
              overflowY: "auto",
              p: 3,
            }}
          >
            <Stack spacing={4}>
              <Box>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="text.secondary"
                  sx={{ textTransform: "uppercase", mb: 2, display: "block" }}
                >
                  {dict.shipments.details.assignmentDetails}
                </Typography>
                {shipment.driver ? (
                  <DriverCard
                    {...(shipment.driver as unknown as DriverWithRelations)}
                  />
                ) : (
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: "theme.palette.common.white_alpha.main_02",
                      border:
                        "1px dashed theme.palette.common.white_alpha.main_10",
                      borderRadius: 2,
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {dict.shipments.details.noDriverAssigned}
                    </Typography>
                  </Paper>
                )}
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="text.secondary"
                  sx={{ textTransform: "uppercase", mb: 2, display: "block" }}
                >
                  {dict.shipments.details.missionPath}
                </Typography>
                <Box sx={{ position: "relative", pl: 4 }}>
                  <Box
                    sx={{
                      position: "absolute",
                      left: 11,
                      top: 10,
                      bottom: 10,
                      width: 2,
                      bgcolor: "theme.palette.primary._alpha.main_20",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundImage: `linear-gradient(to bottom, theme.palette.primary.main 50%, transparent 50%)`,
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
                          bgcolor: "theme.palette.primary.main",
                          boxShadow: `0 0 10px theme.palette.primary.main`,
                        }}
                      />
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        color="white"
                      >
                        {dict.shipments.details.pickupOrigin}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {shipment.origin || dict.common.noData}
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
                          bgcolor: "theme.palette.error.main",
                          boxShadow: `0 0 10px theme.palette.error.main`,
                        }}
                      />
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        color="white"
                      >
                        {dict.shipments.details.finalDelivery}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {shipment.destination || dict.common.noData}
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
                  {dict.shipments.details.consignmentSpecs}
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
                      bgcolor: "theme.palette.common.white_alpha.main_03",
                      border:
                        "1px solid theme.palette.common.white_alpha.main_05",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {dict.shipments.details.quantity}
                    </Typography>
                    <Typography variant="h6" fontWeight={800} color="white">
                      {shipment.itemsCount || 0}
                      <Typography component="span" variant="caption" ml={0.5}>
                        {dict.shipments.details.units}
                      </Typography>
                    </Typography>
                  </Box>
                  {shipment.weightKg && (
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "theme.palette.common.white_alpha.main_03",
                        border:
                          "1px solid theme.palette.common.white_alpha.main_05",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {dict.shipments.details.grossWeight}
                      </Typography>
                      <Typography variant="h6" fontWeight={800} color="white">
                        {shipment.weightKg}
                        <Typography component="span" variant="caption" ml={0.5}>
                          {dict.shipments.details.kg}
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
                    {dict.shipments.details.customerEntity}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "theme.palette.primary._alpha.main_05",
                      border: "1px solid theme.palette.primary._alpha.main_10",
                    }}
                  >
                    <Avatar
                      variant="rounded"
                      sx={{
                        bgcolor: "theme.palette.primary.main",
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
                        {dict.shipments.details.clientPartner}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              )}
            </Stack>
          </Box>

          <Box sx={{ flex: 1, position: "relative", minHeight: 400 }}>
            <MapRoutesDialogCard
              origin={mapOrigin}
              destination={mapDestination}
            />

            <Box
              sx={{
                position: "absolute",
                bottom: 24,
                left: 24,
                right: 24,
                bgcolor: "theme.palette.background.midnight._alpha.main_80",
                backdropFilter: "blur(12px)",
                borderRadius: 3,
                p: 2,
                border: "1px solid theme.palette.common.white_alpha.main_10",
                display: "flex",
                justifyContent: "space-around",
                zIndex: 1,
              }}
            >
              <Stack alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  {dict.shipments.details.mileage}
                </Typography>
                <Typography variant="subtitle1" fontWeight={800} color="white">
                  {shipment.route?.distanceKm
                    ? `${shipment.route.distanceKm} km`
                    : dict.shipments.details.tbd}
                </Typography>
              </Stack>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ borderColor: "theme.palette.common.white_alpha.main_10" }}
              />
              <Stack alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  {dict.shipments.details.duration}
                </Typography>
                <Typography variant="subtitle1" fontWeight={800} color="white">
                  {shipment.route?.durationMin
                    ? `${shipment.route.durationMin} min`
                    : dict.shipments.details.tbd}
                </Typography>
              </Stack>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ borderColor: "theme.palette.common.white_alpha.main_10" }}
              />
              <Stack alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  {dict.shipments.details.fleetId}
                </Typography>
                <Typography variant="subtitle1" fontWeight={800} color="white">
                  {shipment.route?.id
                    ? `RT-${shipment.route.id.substring(0, 4).toUpperCase()}`
                    : dict.shipments.details.noUnit}
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
