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
import MapRoutesDialogCard from "./map";
import AddressAutocomplete from "../../inputs/AddressAutocomplete";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlaceIcon from "@mui/icons-material/Place";
import { useState, useEffect } from "react";
import { updateRoute } from "@/app/lib/controllers/routes";
import { useUser } from "@/app/lib/hooks/useUser";
import { getDrivers } from "@/app/lib/controllers/driver";
import { getVehicles } from "@/app/lib/controllers/vehicle";
import { getWarehouses } from "@/app/lib/controllers/warehouse";
import { getCustomers } from "@/app/lib/controllers/customer";
import { RouteWithRelations } from "@/app/lib/type/routes";

interface EditRouteDialogParams {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  route: RouteWithRelations | null;
}

const EditRouteDialog = (params: EditRouteDialogParams) => {
  const { open, onClose, onSuccess, route } = params;
  const theme = useTheme();
  const { user } = useUser();

  // Mode States
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

          // Fetch Drivers
          const driversData = await getDrivers(1, 100);
          setDrivers(driversData.data);

          // Fetch Vehicles
          const vehiclesData = await getVehicles({
            status: ["IDLE", "AVAILABLE", "ON_TRIP"], // Allow current vehicle too
          });
          setVehicles(vehiclesData);
        } catch (error) {
          console.error("Failed to fetch form data for route:", error);
        }
      };

      fetchData();
    }
  }, [open, user]);

  // Pre-populate data
  useEffect(() => {
    if (route && open) {
      // Determine origin/dest types based on ID matches or lat/lng
      // This part is tricky if we don't store "originType" in DB explicitly.
      // We'll try to guess or just default to Warehouse/Customer if IDs match.
      // For MVP, we might need to rely on what we have.

      // Since schema stores Address strings largely, we might just set types to "ADDRESS" if ID is not found in lists?
      // But lists are async fetched...

      // Let's simplified assumption:
      // If we have an ID that looks like a UUID, we check lists.
      // For now, let's just populate what we can (Name, Dates, Driver, Vehicle)

      const toDateTimeString = (date: Date | null) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toISOString().slice(0, 16); // format: YYYY-MM-DDTHH:mm
      };

      setFormData({
        name: route.name || "",
        driverId: route.driverId || "",
        vehicleId: route.vehicleId || "",
        startTime: toDateTimeString(route.startTime),
        endTime: toDateTimeString(route.endTime),
        // We might not be able to easy-edit origin/dest if they were generic addresses
        // Keeping them as is or simple default
        originType: "WAREHOUSE",
        originId: "", // We'd need to reverse lookup. Skipping for safety to not overwrite with wrong data easily
        destinationType: "CUSTOMER",
        destinationId: "",
      });

      // If we wanted to fully support editing origin/dest, we'd need to store their types/IDs explicitly in Route model
      // or infer them complexly here.
      // For this refactor, let's allow editing Name, Driver, Vehicle, Time.
    }
  }, [route, open]);

  const handleUpdate = async () => {
    if (!user || !route) return;
    try {
      // Only update fields that are safe to update without breaking origin/dest if they weren't touched
      // But our formData requires them to be set if we were creating.
      // Since we can't easily pre-fill origin/dest ID, we should make them optional or intelligent.
      // For this UI, let's strict it: You can update Name, Driver, Vehicle, Times.
      // Origin/Dest updates are disabled in this simplified Edit dialog to avoid data loss/corruption
      // until we have better persistent state for them.

      const payload: any = {
        name: formData.name,
        driverId: formData.driverId,
        vehicleId: formData.vehicleId,
        startTime: new Date(formData.startTime),
        endTime: new Date(formData.endTime),
      };

      await updateRoute(route.id, user.id, payload);
      if (onSuccess) onSuccess();
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  const statusColor = theme.palette.warning.main;

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
              <EditIcon fontSize="large" />
            </Avatar>
            <Stack spacing={0.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{ color: theme.palette.text.primary }}
                >
                  Edit Route
                </Typography>
              </Stack>
              <Stack spacing={1}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                >
                  <PlaceIcon fontSize="small" sx={{ fontSize: "1rem" }} />
                  Update route details and assignment
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

          {/* 
            Origin/Dest editing disabled for now as resolving types 
            from flat address strings is complex without ID persistence 
         */}
          <Typography variant="caption" color="text.secondary">
            * Origin and Destination cannot be changed in this view. Please
            recreate the route if location changes are needed.
          </Typography>

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

          <Button
            variant="contained"
            color="warning"
            onClick={handleUpdate}
            disabled={!formData.name || !formData.startTime}
          >
            Save Changes
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default EditRouteDialog;
