import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Stack,
  Avatar,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  assignDriverToVehicle,
  getAvailableDrivers,
  unassignDriverFromVehicle,
} from "@/app/lib/controllers/vehicle";
import { DriverWithUser } from "@/app/lib/type/vehicle";

interface AssignDriverDialogProps {
  open: boolean;
  onClose: () => void;
  vehicleId: string;
  vehiclePlate: string;
  currentDriver?: DriverWithUser | null;
  onSuccess: () => void;
}

export default function AssignDriverDialog({
  open,
  onClose,
  vehicleId,
  vehiclePlate,
  currentDriver,
  onSuccess,
}: AssignDriverDialogProps) {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchDrivers();
      setSelectedDriverId("");
      setError(null);
    }
  }, [open]);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const data = await getAvailableDrivers();
      setDrivers(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load available drivers");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedDriverId) return;
    setActionLoading(true);
    try {
      await assignDriverToVehicle(vehicleId, selectedDriverId);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to assign driver");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnassign = async () => {
    setActionLoading(true);
    try {
      await unassignDriverFromVehicle(vehicleId);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to unassign driver");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>manage Driver - {vehiclePlate}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={3} mt={1}>
          {/* Current Driver Section */}
          <Box
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              bgcolor: "background.default",
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Current Driver
            </Typography>
            {currentDriver && currentDriver.user ? (
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  src={currentDriver.user.avatarUrl || ""}
                  sx={{ width: 48, height: 48 }}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {currentDriver.user.name} {currentDriver.user.surname}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rating: {currentDriver.rating}/5
                  </Typography>
                </Box>
                <Box flexGrow={1} />
                <Button
                  color="error"
                  variant="outlined"
                  onClick={handleUnassign}
                  disabled={actionLoading}
                >
                  Unassign
                </Button>
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No driver currently assigned to this vehicle.
              </Typography>
            )}
          </Box>

          {/* Assign New Driver Section */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Assign New Driver
            </Typography>
            {loading ? (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <FormControl fullWidth>
                <InputLabel>Select Driver</InputLabel>
                <Select
                  value={selectedDriverId}
                  label="Select Driver"
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                >
                  {drivers.length === 0 ? (
                    <MenuItem disabled value="">
                      No available drivers found
                    </MenuItem>
                  ) : (
                    drivers.map((driver) => (
                      <MenuItem key={driver.id} value={driver.id}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar
                            src={driver.user?.avatarUrl || ""}
                            sx={{ width: 24, height: 24 }}
                          />
                          <Typography>
                            {driver.user?.name} {driver.user?.surname}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            ml={1}
                          >
                            (Rating: {driver.rating})
                          </Typography>
                        </Stack>
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            )}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={actionLoading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleAssign}
          disabled={!selectedDriverId || actionLoading}
          startIcon={
            actionLoading && <CircularProgress size={20} color="inherit" />
          }
        >
          {actionLoading ? "Assigning..." : "Assign Driver"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
