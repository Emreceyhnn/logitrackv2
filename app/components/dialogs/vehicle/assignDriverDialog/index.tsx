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
  alpha,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import StarIcon from "@mui/icons-material/Star";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
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
  /* --------------------------------- states --------------------------------- */
  const [drivers, setDrivers] = useState<any[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* -------------------------------- lifecycle ------------------------------- */
  useEffect(() => {
    if (open) {
      fetchDrivers();
      setSelectedDriverId("");
      setError(null);
    }
  }, [open]);

  /* --------------------------------- actions -------------------------------- */
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

  /* ---------------------------------- styles --------------------------------- */
  const theme = useTheme();

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: alpha("#1A202C", 0.5),
      borderRadius: 2,
      height: 48,
      "& fieldset": {
        borderColor: alpha(theme.palette.divider, 0.1),
      },
      "&:hover fieldset": {
        borderColor: alpha(theme.palette.primary.main, 0.3),
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
      },
    },
    "& .MuiInputLabel-root": {
      fontSize: "0.85rem",
      color: "text.secondary",
    },
    "& .MuiOutlinedInput-input": {
      color: "white",
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
          borderRadius: 4,
          bgcolor: "#0B1019",
          backgroundImage: "none",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        },
      }}
    >
      <Box sx={{ p: 3, pb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700} color="white">
            Manage Driver
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: "text.secondary" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Typography variant="caption" sx={{ color: alpha("#fff", 0.4), mt: 0.5, display: "block" }}>
          Vehicle: <span style={{ color: theme.palette.primary.main, fontWeight: 600 }}>{vehiclePlate}</span>
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
              bgcolor: alpha(theme.palette.error.main, 0.1),
              color: theme.palette.error.light,
              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
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
              Current Assignment
            </Typography>
            {currentDriver && currentDriver.user ? (
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.divider, 0.02),
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: `linear-gradient(135deg, ${alpha(theme.palette.divider, 0.02)} 0%, ${alpha(theme.palette.divider, 0.05)} 100%)`,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2.5}>
                  <Box sx={{ position: "relative" }}>
                    <Avatar
                      src={currentDriver.user.avatarUrl || ""}
                      sx={{ 
                        width: 56, 
                        height: 56,
                        border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
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
                        border: "2px solid #0B1019"
                      }} 
                    />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" fontWeight={700} color="white" noWrap>
                      {currentDriver.user.name} {currentDriver.user.surname}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <StarIcon sx={{ fontSize: 14, color: "#FFB400" }} />
                      <Typography variant="caption" color="text.secondary">
                        {currentDriver.rating || "N/A"}/5 Rating
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
                      borderColor: alpha(theme.palette.error.main, 0.3),
                      "&:hover": {
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                        borderColor: theme.palette.error.main,
                      }
                    }}
                  >
                    Unassign
                  </Button>
                </Stack>
              </Box>
            ) : (
              <Box
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: `1px dashed ${alpha(theme.palette.divider, 0.2)}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: alpha(theme.palette.divider, 0.01),
                }}
              >
                <EmojiPeopleIcon sx={{ color: alpha("#fff", 0.2), fontSize: 32 }} />
                <Typography variant="body2" sx={{ color: alpha("#fff", 0.4), fontWeight: 500 }}>
                  No driver currently assigned.
                </Typography>
              </Box>
            )}
          </Box>

          <Box>
            <Typography 
              variant="caption" 
              sx={{ color: "text.secondary", fontWeight: 700, mb: 1.5, display: "block", textTransform: "uppercase", letterSpacing: 1 }}
            >
              Assign New Driver
            </Typography>
            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress size={28} />
              </Box>
            ) : (
              <FormControl fullWidth sx={textFieldSx}>
                <InputLabel sx={{ color: alpha("#fff", 0.4) }}>Select an available driver</InputLabel>
                <Select
                  value={selectedDriverId}
                  label="Select an available driver"
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: "#1A202C",
                        backgroundImage: "none",
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
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
                      No available drivers found
                    </MenuItem>
                  ) : (
                    drivers.map((driver) => (
                      <MenuItem key={driver.id} value={driver.id}>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
                          <Avatar
                            src={driver.user?.avatarUrl || ""}
                            sx={{ width: 32, height: 32, border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}
                          >
                            <PersonIcon sx={{ fontSize: 18 }} />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" fontWeight={600} color="white">
                              {driver.user?.name} {driver.user?.surname}
                            </Typography>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <StarIcon sx={{ fontSize: 10, color: "#FFB400" }} />
                              <Typography variant="caption" color="text.secondary">
                                {driver.rating}/5
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

      <Box sx={{ p: 3, pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.05)}` }}>
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
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAssign}
            disabled={!selectedDriverId || actionLoading}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 4,
              boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
              fontWeight: 700,
              minWidth: 140,
            }}
          >
            {actionLoading ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={16} color="inherit" />
                <span>Assigning...</span>
              </Stack>
            ) : "Assign Driver"}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}
