"use client";

import { useState, useCallback, useEffect } from "react";
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
import {
  AddMemberState,
  AddMemberActions,
  AddMemberDialogProps,
  DriverStateData,
} from "@/app/lib/type/add-company-member";
import { toast } from "sonner";
import { searchPlatformUsers } from "@/app/lib/controllers/users";
import { addMemberToMyCompany } from "@/app/lib/controllers/company";

// Removed mock data

const roles = [
  { id: "role_admin", label: "ADMIN - Full organizational access" },
  { id: "role_manager", label: "MANAGER - Manage department operations" },
  { id: "role_dispatcher", label: "DISPATCHER - Manage routes and fleet" },
  { id: "role_driver", label: "DRIVER - Execute shipments and trips" },
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
  const [state, setState] = useState<AddMemberState>({
    searchQuery: "",
    results: [],
    selectedUserId: null,
    selectedRole: "role_dispatcher",
    driverData: initialDriverData,
    loading: false,
    error: null,
  });

  /* --------------------------------- Actions -------------------------------- */
  const actions: AddMemberActions = {
    setSearchQuery: useCallback((query: string) => {
      setState((prev) => ({
        ...prev,
        searchQuery: query,
      }));
    }, []),

    selectUser: useCallback((id: string | null) => {
      setState((prev) => ({ ...prev, selectedUserId: id }));
    }, []),

    setRole: useCallback((role: string) => {
      setState((prev) => ({ ...prev, selectedRole: role }));
    }, []),

    setDriverData: useCallback(
      (field: keyof DriverStateData, value: string) => {
        setState((prev) => ({
          ...prev,
          driverData: {
            ...prev.driverData,
            [field]: value,
          },
        }));
      },
      []
    ),

    submit: useCallback(async () => {
      if (!state.selectedUserId) return;

      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        // Note: we'll update the `addMemberToMyCompany` action later to accept driverData
        await addMemberToMyCompany(
          state.selectedUserId,
          state.selectedRole,
          state.selectedRole === "role_driver" ? state.driverData : undefined
        );
        toast.success("Member added successfully!");
        onSuccess?.();
        onClose();
        setState({
          searchQuery: "",
          results: [],
          selectedUserId: null,
          selectedRole: "role_dispatcher",
          driverData: initialDriverData,
          loading: false,
          error: null,
        });
      } catch (err: unknown) {
        setState((prev) => ({ ...prev, error: "Failed to add member" }));
        const message =
          err instanceof Error ? err.message : "An error occurred";
        toast.error(message);
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    }, [
      state.selectedUserId,
      state.selectedRole,
      state.driverData,
      onClose,
      onSuccess,
    ]),

    reset: useCallback(() => {
      setState({
        searchQuery: "",
        results: [],
        selectedUserId: null,
        selectedRole: "role_dispatcher",
        driverData: initialDriverData,
        loading: false,
        error: null,
      });
    }, []),
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (state.searchQuery.length >= 2) {
        setState((prev) => ({ ...prev, loading: true }));
        try {
          const results = await searchPlatformUsers(state.searchQuery);
          setState((prev) => ({ ...prev, results, loading: false }));
        } catch (error) {
          console.error("Search error:", error);
          setState((prev) => ({ ...prev, results: [], loading: false }));
        }
      } else if (state.searchQuery.length === 0) {
        setState((prev) => ({ ...prev, results: [], loading: false }));
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [state.searchQuery]);

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
            value={state.searchQuery}
            onChange={(e) => actions.setSearchQuery(e.target.value)}
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
              {state.results.map((user) => {
                const isSelected = state.selectedUserId === user.id;
                return (
                  <Box
                    key={user.id}
                    onClick={() =>
                      actions.selectUser(isSelected ? null : user.id)
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

          {/* Role Selection */}
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
                value={state.selectedRole}
                onChange={(e) => actions.setRole(e.target.value)}
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
          {state.selectedRole === "role_driver" && (
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
                  value={state.driverData.employeeId}
                  onChange={(e) =>
                    actions.setDriverData("employeeId", e.target.value)
                  }
                  required
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Phone Number *"
                  value={state.driverData.phone}
                  onChange={(e) =>
                    actions.setDriverData("phone", e.target.value)
                  }
                  required
                />
                <TextField
                  fullWidth
                  size="small"
                  label="License Type"
                  placeholder="e.g. CDL-A"
                  value={state.driverData.licenseType}
                  onChange={(e) =>
                    actions.setDriverData("licenseType", e.target.value)
                  }
                />
                <TextField
                  fullWidth
                  size="small"
                  label="License Number"
                  value={state.driverData.licenseNumber}
                  onChange={(e) =>
                    actions.setDriverData("licenseNumber", e.target.value)
                  }
                />
                <TextField
                  fullWidth
                  size="small"
                  label="License Expiry"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={state.driverData.licenseExpiry}
                  onChange={(e) =>
                    actions.setDriverData("licenseExpiry", e.target.value)
                  }
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
          onClick={actions.submit}
          disabled={
            !state.selectedUserId ||
            state.loading ||
            (state.selectedRole === "role_driver" &&
              (!state.driverData.employeeId || !state.driverData.phone))
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
          {state.loading ? "Adding..." : "Add to Company"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
