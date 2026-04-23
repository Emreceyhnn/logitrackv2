import {
  Dialog,
  DialogContent,
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
  IconButton,
  useTheme,
  
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import StarIcon from "@mui/icons-material/Star";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import { useEffect, useState, useCallback } from "react";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
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
  const dict = useDictionary();
  /* --------------------------------- states --------------------------------- */
  const [drivers, setDrivers] = useState<DriverWithUser[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* --------------------------------- actions -------------------------------- */
  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAvailableDrivers();
      setDrivers(data);
    } catch (err) {
      console.error(err);
      setError(dict.vehicles.dialogs.failedToLoadDrivers);
    } finally {
      setLoading(false);
    }
  }, [dict.vehicles.dialogs.failedToLoadDrivers]);

  /* -------------------------------- lifecycle ------------------------------- */
  useEffect(() => {
    if (open) {
      fetchDrivers();
      setSelectedDriverId("");
      setError(null);
    }
  }, [open, fetchDrivers]);

  /* -------------------------------- handlers -------------------------------- */
  const handleAssign = async () => {
    if (!selectedDriverId) return;
    setActionLoading(true);
    try {
      await assignDriverToVehicle(vehicleId, selectedDriverId);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(dict.vehicles.dialogs.failedToAssign);
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
      setError(dict.vehicles.dialogs.failedToUnassign);
    } finally {
      setActionLoading(false);
    }
  };

  /* ---------------------------------- styles --------------------------------- */
  const theme = useTheme();

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      height: 48,
      "& fieldset": {
        borderColor: "divider",
      },
      "&:hover fieldset": {
        borderColor: "primary.main",
      },
    },
    "& .MuiInputLabel-root": {
      fontSize: "0.85rem",
    },
    "& .MuiOutlinedInput-input": {
      fontSize: "0.9rem",
    },
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="xs"
      PaperProps={{
        sx: {
          overflow: "hidden",
        },
      }}
    >
      <Box sx={{ p: 3, pb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={800} color="text.primary">
            {dict.vehicles.dialogs.manageDriver}
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: "text.secondary" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block", fontWeight: 500 }}>
          {dict.vehicles.fields.plate}: <span style={{ color: theme.palette.primary.main, fontWeight: 700 }}>{vehiclePlate}</span>
        </Typography>
      </Box>

      <DialogContent sx={{ p: 3, pt: 1 }}>
        {error && (
          <Alert 
            severity="error" 
            variant="filled"
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              bgcolor: (theme) => theme.palette.mode === "dark" ? "error._alpha.main_10" : "error._alpha.main_05",
              color: "error.light",
              border: (theme) => `1px solid ${theme.palette.error._alpha.main_20}`,
            }}
          >
            {error}
          </Alert>
        )}

        <Stack spacing={4}>
          <Box>
            <Typography 
              variant="caption" 
              sx={{ color: "text.secondary", fontWeight: 700, mb: 1.5, display: "block", textTransform: "uppercase", letterSpacing: 1 }}
            >
              {dict.vehicles.dialogs.currentAssignment}
            </Typography>
            {currentDriver && currentDriver.user ? (
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                  border: `1px solid ${theme.palette.divider}`,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: (theme) => theme.palette.mode === "dark" 
                    ? `linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.05) 100%)`
                    : `linear-gradient(135deg, rgba(0,0,0,0.01) 0%, rgba(0,0,0,0.03) 100%)`,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2.5}>
                  <Box sx={{ position: "relative" }}>
                    <Avatar
                      src={currentDriver.user.avatarUrl || ""}
                      sx={{ 
                        width: 56, 
                        height: 56,
                        border: (theme) => `2px solid ${theme.palette.primary._alpha.main_30}`,
                      }}
                    >
                      <PersonIcon />
                    </Avatar>
                    <Box 
                      sx={{ 
                        position: "absolute", 
                        bottom: -4, 
                        right: -4, 
                        bgcolor: theme.palette.success.main,
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        border: (theme) => `2px solid ${theme.palette.background.paper}`,
                      }} 
                    />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" fontWeight={800} color="text.primary" noWrap>
                      {currentDriver.user.name} {currentDriver.user.surname}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <StarIcon sx={{ fontSize: 14, color: "#FFB400" }} />
                      <Typography variant="caption" color="text.secondary">
                        {currentDriver.rating || dict.common.na}/5 {dict.vehicles.dialogs.rating}
                      </Typography>
                    </Stack>
                  </Box>
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={handleUnassign}
                    disabled={actionLoading}
                    sx={{ 
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      px: 2,
                      borderColor: (theme) => theme.palette.error._alpha.main_30,
                      "&:hover": {
                        bgcolor: (theme) => theme.palette.error._alpha.main_10,
                        borderColor: (theme) => theme.palette.error.main,
                      }
                    }}
                  >
                    {dict.vehicles.dialogs.unassign}
                  </Button>
                </Stack>
              </Box>
            ) : (
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: (theme) => `1px dashed ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"}`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                    bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
                  }}
                >
                <EmojiPeopleIcon sx={{ color: "text.disabled", fontSize: 32, opacity: 0.5 }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {dict.vehicles.dialogs.noDriverAssigned}
                </Typography>
              </Box>
            )}
          </Box>

          <Box>
            <Typography 
              variant="caption" 
              sx={{ color: "text.secondary", fontWeight: 700, mb: 1.5, display: "block", textTransform: "uppercase", letterSpacing: 1 }}
            >
              {dict.vehicles.dialogs.assignNewDriver}
            </Typography>
            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress size={28} />
              </Box>
            ) : (
              <FormControl fullWidth sx={textFieldSx}>
                <InputLabel sx={{ color: "text.secondary" }}>{dict.vehicles.dialogs.selectDriver}</InputLabel>
                <Select
                  value={selectedDriverId}
                  label={dict.vehicles.dialogs.selectDriver}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundImage: "none",
                        mt: 1,
                        "& .MuiMenuItem-root": {
                          py: 1.5,
                        }
                      }
                    }
                  }}
                >
                  {drivers.length === 0 ? (
                    <MenuItem disabled value="" sx={{ color: "text.secondary" }}>
                      {dict.vehicles.dialogs.noDriversFound}
                    </MenuItem>
                  ) : (
                    drivers.map((driver) => (
                      <MenuItem key={driver.id} value={driver.id}>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
                          <Avatar
                            src={driver.user?.avatarUrl || ""}
                            sx={{ width: 32, height: 32, border: (theme) => `1px solid ${theme.palette.divider}` }}
                          >
                            <PersonIcon sx={{ fontSize: 18 }} />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" fontWeight={700} color="text.primary">
                              {driver.user?.name} {driver.user?.surname}
                            </Typography>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <StarIcon sx={{ fontSize: 10, color: "#FFB400" }} />
                              <Typography variant="caption" color="text.secondary">
                                {driver.rating}/{dict.vehicles.dialogs.rating}
                              </Typography>
                            </Stack>
                          </Box>
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

      <Box sx={{ p: 3, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button 
            onClick={onClose} 
            disabled={actionLoading}
            sx={{ 
              color: "text.secondary", 
              textTransform: "none", 
              fontWeight: 600 
            }}
          >
            {dict.common.cancel}
          </Button>
          <Button
            variant="contained"
            onClick={handleAssign}
            disabled={!selectedDriverId || actionLoading}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 4,
              boxShadow: `0 8px 24px ${theme.palette.primary._alpha.main_20}`,
              fontWeight: 700,
              minWidth: 140,
            }}
          >
            {actionLoading ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={16} color="inherit" />
                <span>{dict.vehicles.dialogs.assigning}</span>
              </Stack>
            ) : dict.vehicles.dialogs.assignDriver}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}
