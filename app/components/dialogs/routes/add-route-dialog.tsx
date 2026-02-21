"use client";

import {
  alpha,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Stack,
  Typography,
  useTheme,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
// Removed mockData
import MapRoutesDialogCard from "./map";
import AddressAutocomplete from "../../inputs/AddressAutocomplete";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlaceIcon from "@mui/icons-material/Place";
import { useState, useEffect } from "react";
import { createRoute } from "@/app/lib/controllers/routes";
import { useUser } from "@/app/lib/hooks/useUser";
import { getDrivers } from "@/app/lib/controllers/driver";
import { getVehicles } from "@/app/lib/controllers/vehicle";
import { getWarehouses } from "@/app/lib/controllers/warehouse";
import { getCustomers } from "@/app/lib/controllers/customer";

interface AddRouteDialogParams {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddRouteDialog = (params: AddRouteDialogParams) => {
  const { open, onClose, onSuccess } = params;
  const theme = useTheme();
  const { user } = useUser();

  // Create Mode States
  const [formData, setFormData] = useState({
    name: "",
    driverId: "",
    vehicleId: "",
    originType: "WAREHOUSE",
    originId: "",
    destinationType: "CUSTOMER",
    destinationId: "",
    startTime: "",
    endTime: "",
  });

  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [customDestination, setCustomDestination] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Fetch helpers
  useEffect(() => {
    if (open && user?.companyId) {
      const fetchData = async () => {
        try {
          // Fetch Warehouses
          const fetchedWarehouses = await getWarehouses(
            user.companyId,
            user.id
          );
          setWarehouses(fetchedWarehouses);

          // Fetch Customers
          const fetchedCustomers = await getCustomers(user.companyId, user.id);
          setCustomers(fetchedCustomers);

          // Fetch Drivers (Page 1, 100 items to cover most)
          // Note: getDrivers is authenticatedAction, user is injected on server, we pass args
          const driversData = await getDrivers(1, 100);
          setDrivers(driversData.data);

          // Fetch Vehicles (Available only)
          const vehiclesData = await getVehicles({
            status: ["IDLE", "AVAILABLE"],
          });
          setVehicles(vehiclesData);
        } catch (error) {
          console.error("Failed to fetch form data for route:", error);
        }
      };

      fetchData();
    }
  }, [open, user]);

  const handleCreate = async () => {
    if (!user) return;
    try {
      const origin = {
        type: formData.originType,
        id: formData.originId,
      } as any;
      const destination = {
        type: formData.destinationType,
        id:
          formData.destinationType === "ADDRESS"
            ? undefined
            : formData.destinationId,
        address:
          formData.destinationType === "ADDRESS"
            ? "Custom Map Location"
            : undefined,
        lat:
          formData.destinationType === "ADDRESS" && customDestination
            ? customDestination.lat
            : undefined,
        lng:
          formData.destinationType === "ADDRESS" && customDestination
            ? customDestination.lng
            : undefined,
      } as any;

      await createRoute(
        user.id,
        formData.name,
        new Date(), // Date
        new Date(formData.startTime),
        new Date(formData.endTime),
        0, // distance (calc later)
        0, // duration
        formData.driverId,
        formData.vehicleId,
        user.companyId,
        origin,
        destination
      );
      if (onSuccess) onSuccess();
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  // Selected Origin/Dest handling for map preview
  const selectedOrigin =
    formData.originType === "WAREHOUSE"
      ? warehouses.find((w) => w.id === formData.originId)
      : customers.find((c) => c.id === formData.originId);

  const selectedDestination =
    formData.destinationType === "WAREHOUSE"
      ? warehouses.find((w) => w.id === formData.destinationId)
      : customers.find((c) => c.id === formData.destinationId);

  let mapOrigin = undefined;
  let mapDestination = undefined;

  if (selectedOrigin) {
    // Check for different address structures if needed, but assuming schema match or existence of lat/lng
    mapOrigin = {
      lat: selectedOrigin.lat || 0,
      lng: selectedOrigin.lng || 0,
    };
  }
  if (formData.destinationType === "ADDRESS" && customDestination) {
    mapDestination = customDestination;
  } else if (selectedDestination) {
    // Customers might not have lat/lng directly on root if address is string,
    // but assuming the fetched object has them or we handle them.
    // For now using what was there, or adding safe fallback
    mapDestination = {
      lat: selectedDestination.lat || 0,
      lng: selectedDestination.lng || 0,
    };
  }

  const statusColor = theme.palette.primary.main;

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
          background: `linear-gradient(135deg, ${alpha(
            statusColor,
            0.05
          )} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar
              variant="rounded"
              sx={{
                bgcolor: alpha(statusColor, 0.1),
                color: statusColor,
                width: 72,
                height: 72,
                fontSize: "2rem",
                fontWeight: 800,
                borderRadius: 2,
              }}
            >
              <AddIcon fontSize="large" />
            </Avatar>
            <Stack spacing={0.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{ color: theme.palette.text.primary }}
                >
                  Create New Route
                </Typography>
              </Stack>
              <Stack spacing={1}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                >
                  <PlaceIcon fontSize="small" sx={{ fontSize: "1rem" }} />
                  Plan a new delivery route
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1}>
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
        <Stack p={2} spacing={2}>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Route Name"
              fullWidth
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <TextField
              label="Start Time"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.startTime}
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
            />
            <TextField
              label="End Time"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.endTime}
              onChange={(e) =>
                setFormData({ ...formData, endTime: e.target.value })
              }
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Origin Type</InputLabel>
              <Select
                value={formData.originType}
                label="Origin Type"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    originType: e.target.value,
                    originId: "",
                  })
                }
              >
                <MenuItem value="WAREHOUSE">Warehouse</MenuItem>
                <MenuItem value="CUSTOMER">Customer</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Origin</InputLabel>
              <Select
                value={formData.originId}
                label="Origin"
                onChange={(e) =>
                  setFormData({ ...formData, originId: e.target.value })
                }
              >
                {(formData.originType === "WAREHOUSE"
                  ? warehouses
                  : customers
                ).map((i) => (
                  <MenuItem key={i.id} value={i.id}>
                    {i.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Destination Type</InputLabel>
              <Select
                value={formData.destinationType}
                label="Destination Type"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    destinationType: e.target.value,
                    destinationId: "",
                  })
                }
              >
                <MenuItem value="WAREHOUSE">Warehouse</MenuItem>
                <MenuItem value="CUSTOMER">Customer</MenuItem>
                <MenuItem value="ADDRESS">Select on Map</MenuItem>
              </Select>
            </FormControl>
            {formData.destinationType !== "ADDRESS" ? (
              <FormControl fullWidth>
                <InputLabel>Destination</InputLabel>
                <Select
                  value={formData.destinationId}
                  label="Destination"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      destinationId: e.target.value,
                    })
                  }
                >
                  {(formData.destinationType === "WAREHOUSE"
                    ? warehouses
                    : customers
                  ).map((i) => (
                    <MenuItem key={i.id} value={i.id}>
                      {i.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Stack direction="column" spacing={1} width="100%">
                <AddressAutocomplete
                  onPlaceSelect={(place) => {
                    if (place.geometry?.location) {
                      const lat = place.geometry.location.lat();
                      const lng = place.geometry.location.lng();
                      setCustomDestination({ lat, lng });
                      setFormData({
                        ...formData,
                        destinationId: `LAT:${lat},LNG:${lng}`, // Or use place.formatted_address
                        // You might want to save the address name too?
                      });
                    }
                  }}
                />
                {formData.destinationId && (
                  <Typography
                    variant="caption"
                    color="success.main"
                    sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                  >
                    <CheckCircleIcon fontSize="small" /> Location Selected
                  </Typography>
                )}
              </Stack>
            )}
          </Stack>

          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Driver</InputLabel>
              <Select
                value={formData.driverId}
                label="Driver"
                onChange={(e) =>
                  setFormData({ ...formData, driverId: e.target.value })
                }
              >
                {drivers.map((d) => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.user?.name} {d.user?.surname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Vehicle</InputLabel>
              <Select
                value={formData.vehicleId}
                label="Vehicle"
                onChange={(e) =>
                  setFormData({ ...formData, vehicleId: e.target.value })
                }
              >
                {vehicles.map((v) => (
                  <MenuItem key={v.id} value={v.id}>
                    {v.plate} ({v.model})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Divider />
          {formData.destinationType === "ADDRESS" && (
            <Typography
              variant="caption"
              color="info.main"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <PlaceIcon fontSize="small" /> Click on the map to select the
              destination
            </Typography>
          )}
          <MapRoutesDialogCard
            origin={mapOrigin}
            destination={mapDestination}
            onMapClick={(e) => {
              if (formData.destinationType === "ADDRESS" && e.latLng) {
                const lat = e.latLng.lat();
                const lng = e.latLng.lng();
                setCustomDestination({ lat, lng });
                // We can store the lat,lng as string in ID or keep separate.
                // For now, let's just mark ID as "custom" to satisfy form check
                setFormData({
                  ...formData,
                  destinationId: `LAT:${lat},LNG:${lng}`,
                });
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={
              !formData.name ||
              !formData.startTime ||
              !formData.originId ||
              !formData.destinationId
            }
          >
            Create Route
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default AddRouteDialog;
