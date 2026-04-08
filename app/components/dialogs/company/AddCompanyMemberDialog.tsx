"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton,
  alpha,
  useTheme,
  Stack,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {
  AddMemberDialogProps,
  DriverStateData,
} from "@/app/lib/type/add-company-member";
import { toast } from "sonner";
import { searchPlatformUsers } from "@/app/lib/controllers/users";
import { addCompanyUser } from "@/app/lib/controllers/company";
import { addCompanyMemberValidationSchema } from "@/app/lib/validationSchema";
import { ValidationError } from "yup";

interface SearchedUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

const roles = [
  { id: "role_admin", label: "ADMIN - Full organizational access" },
  { id: "role_manager", label: "MANAGER - Manage department operations" },
  { id: "role_dispatcher", label: "DISPATCHER - Manage routes and fleet" },
  { id: "role_warehouse", label: "WAREHOUSE - Manage inventory" },
  { id: "role_default", label: "DEFAULT - Standard user access" },
];

const initialDriverData: DriverStateData = {
  employeeId: "",
  phone: "",
  licenseNumber: "",
  licenseType: "",
  licenseExpiry: "",
};

export default function AddCompanyMemberDialog({
  open,
  onClose,
  onSuccess,
}: AddMemberDialogProps) {
  const theme = useTheme();

  /* ---------------------------------- State --------------------------------- */
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchedUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState("role_default");
  const [driverData, setDriverData] =
    useState<DriverStateData>(initialDriverData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  /* ---------------------------------- Handlers ------------------------------- */
  const handleDriverDataChange = (
    field: keyof DriverStateData,
    value: string
  ) => {
    setDriverData((prev) => ({ ...prev, [field]: value }));
  };

  const resetDialog = () => {
    setSearchQuery("");
    setResults([]);
    setSelectedUserId(null);
    setSelectedRole("role_default");
    setDriverData(initialDriverData);
    setLoading(false);
    setError(null);
    setValidationErrors({});
  };

  const handleSubmit = async () => {
    if (!selectedUserId) return;

    setLoading(true);
    setError(null);
    setValidationErrors({});

    try {
      if (selectedRole === "role_driver") {
        await addCompanyMemberValidationSchema.validate(driverData, { abortEarly: false });
      }

      await addCompanyUser(selectedUserId, selectedRole);
      toast.success("Member added successfully!");
      onSuccess?.();
      onClose();
      resetDialog();
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        const errors: Record<string, string> = {};
        err.inner.forEach((e) => {
          if (e.path) errors[e.path] = e.message;
        });
        setValidationErrors(errors);
        toast.error("Please correct the validation errors.");
      } else {
        setError("Failed to add member");
        const message = err instanceof Error ? err.message : "An error occurred";
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------- Effects -------------------------------- */
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setLoading(true);
        try {
          const searchResults = await searchPlatformUsers(searchQuery);
          setResults(searchResults);
        } catch (err) {
          console.error("Search error:", err);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else if (searchQuery.length === 0) {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: alpha(theme.palette.background.default, 0.98),
          backdropFilter: "blur(20px)",
          backgroundImage: "none",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: theme.shadows[24],
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
            Add Member
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Search and add existing platform users to your organization.
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: "text.secondary",
            bgcolor: alpha(theme.palette.text.secondary, 0.05),
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, pt: 1 }}>
        <Stack spacing={3}>
          {/* Search Box */}
          <TextField
            fullWidth
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                </InputAdornment>
              ),
              sx: {
                bgcolor: alpha(theme.palette.background.paper, 0.4),
                borderRadius: 2,
              },
            }}
          />

          {/* Results List */}
          <Box>
            {error && (
              <Typography
                variant="caption"
                sx={{
                  color: "error.main",
                  bgcolor: alpha(theme.palette.error.main, 0.05),
                  p: 1.5,
                  borderRadius: 2,
                  mb: 2,
                  display: "block",
                  border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
                }}
              >
                {error}
              </Typography>
            )}
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: 700,
                textTransform: "uppercase",
                mt: 4,
                mb: 1,
                display: "block",
              }}
            >
              Search Results
            </Typography>
            <Stack spacing={1}>
              {results.map((user) => {
                const isSelected = selectedUserId === user.id;
                return (
                  <Box
                    key={user.id}
                    onClick={() =>
                      setSelectedUserId(isSelected ? null : user.id)
                    }
                    sx={{
                      p: 1.5,
                      borderRadius: 2.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      cursor: "pointer",
                      border: `1px solid ${isSelected ? theme.palette.primary.main : alpha(theme.palette.divider, 0.05)}`,
                      bgcolor: isSelected
                        ? alpha(theme.palette.primary.main, 0.05)
                        : "transparent",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: isSelected
                          ? alpha(theme.palette.primary.main, 0.08)
                          : alpha(theme.palette.text.primary, 0.02),
                      },
                    }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <Avatar
                        sx={{ width: 40, height: 40, bgcolor: "grey.800" }}
                      >
                        {user.name.charAt(0)}
                      </Avatar>
                      {isSelected && (
                        <CheckCircleIcon
                          sx={{
                            position: "absolute",
                            bottom: -2,
                            right: -2,
                            fontSize: 18,
                            color: "primary.main",
                            bgcolor: "background.paper",
                            borderRadius: "50%",
                          }}
                        />
                      )}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </Box>

          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.primary.main, 0.02),
              border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: 700,
                mb: 1,
                display: "block",
              }}
            >
              Assign Organization Role
            </Typography>
            <FormControl fullWidth>
              <Select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                IconComponent={KeyboardArrowDownIcon}
                sx={{
                  bgcolor: alpha(theme.palette.background.paper, 0.4),
                  borderRadius: 2,
                  "& .MuiSelect-select": {
                    py: 1.5,
                    px: 2,
                    fontSize: 13,
                    fontWeight: 600,
                  },
                }}
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id} sx={{ fontSize: 13 }}>
                    {role.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block", opacity: 0.7 }}
            >
              Selected user will receive an invitation to join your company.
            </Typography>
          </Box>

          {/* Conditional Driver Data Section */}
          {selectedRole === "role_driver" && (
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: alpha(theme.palette.warning.main, 0.05),
                border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "warning.main",
                  fontWeight: 700,
                  mb: 2,
                  display: "block",
                }}
              >
                Driver Details Required
              </Typography>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Employee ID *"
                  value={driverData.employeeId}
                  onChange={(e) =>
                    handleDriverDataChange("employeeId", e.target.value)
                  }
                  error={!!validationErrors.employeeId}
                  helperText={validationErrors.employeeId}
                  required
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Phone Number *"
                  value={driverData.phone}
                  onChange={(e) =>
                    handleDriverDataChange("phone", e.target.value)
                  }
                  error={!!validationErrors.phone}
                  helperText={validationErrors.phone}
                  required
                />
                <TextField
                  fullWidth
                  size="small"
                  label="License Type"
                  placeholder="e.g. CDL-A"
                  value={driverData.licenseType}
                  onChange={(e) =>
                    handleDriverDataChange("licenseType", e.target.value)
                  }
                />
                <TextField
                  fullWidth
                  size="small"
                  label="License Number"
                  value={driverData.licenseNumber}
                  onChange={(e) =>
                    handleDriverDataChange("licenseNumber", e.target.value)
                  }
                />
                <DatePicker
                  label="License Expiry"
                  value={driverData.licenseExpiry ? dayjs(driverData.licenseExpiry) : null}
                  onChange={(val) =>
                    handleDriverDataChange("licenseExpiry", val ? val.toISOString().split("T")[0] : "")
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                    },
                  }}
                />
              </Stack>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1, justifyContent: "flex-end", gap: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            color: "text.secondary",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            !selectedUserId ||
            loading ||
            (selectedRole === "role_driver" &&
              (!driverData.employeeId || !driverData.phone))
          }
          startIcon={<GroupAddIcon />}
          sx={{
            borderRadius: 2.5,
            textTransform: "none",
            px: 4,
            transition: "all 0.3s ease",
            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          {loading ? "Adding..." : "Add to Company"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
