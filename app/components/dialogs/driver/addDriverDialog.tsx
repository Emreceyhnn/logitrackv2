"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  Typography,
  Divider,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { CreateDriverFormData } from "@/app/lib/type/driver";
import {
  createDriver,
  getEligibleUsersForDriver,
} from "@/app/lib/controllers/driver";
import { useTransition, useEffect, useState } from "react";
import { toast } from "sonner";

interface AddDriverDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Validation Schema
const validationSchema = Yup.object({
  userId: Yup.string().required("Please select an employee"),
  phone: Yup.string().required("Phone is required"),
  licenseNumber: Yup.string().required("License Number is required"),
  licenseType: Yup.string().required("License Type is required"),
  licenseExpiry: Yup.date().nullable().required("License Expiry is required"),
  employeeId: Yup.string().required("Employee ID is required"),
  status: Yup.string().required("Status is required"),
});

export default function AddDriverDialog({
  open,
  onClose,
  onSuccess,
}: AddDriverDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateDriverFormData>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: {
      userId: "",
      phone: "",
      licenseNumber: "",
      licenseType: "Class B",
      licenseExpiry: null,
      employeeId: "",
      status: "OFF_DUTY",
    },
  });

  // Fetch company users when dialog opens
  useEffect(() => {
    if (open) {
      const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
          const res = await getEligibleUsersForDriver();
          setUsers(res);
        } catch (err) {
          console.error(err);
          toast.error("Failed to load employees");
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [open]);

  const onSubmit = (data: CreateDriverFormData) => {
    startTransition(async () => {
      try {
        await createDriver(data);
        toast.success("Driver assigned successfully");
        reset();
        onSuccess();
        onClose();
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || "Failed to assign driver");
      }
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Assign Driver</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            {/* User Selection Section */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Select Employee
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Choose an existing employee to assign as a driver.
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid size={{ xs: 12 }}>
              {/* We will implement Autocomplete here once we have data */}
              <Controller
                name="userId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Employee"
                    fullWidth
                    error={!!errors.userId}
                    helperText={errors.userId?.message}
                    disabled={loadingUsers}
                  >
                    {loadingUsers ? (
                      <MenuItem disabled>Loading...</MenuItem>
                    ) : (
                      users.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.name} {user.surname} ({user.email})
                        </MenuItem>
                      ))
                    )}
                    {!loadingUsers && users.length === 0 && (
                      <MenuItem disabled>No eligible employees found</MenuItem>
                    )}
                  </TextField>
                )}
              />
            </Grid>

            {/* Professional Information Section */}
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Professional Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="employeeId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Employee ID"
                    fullWidth
                    error={!!errors.employeeId}
                    helperText={errors.employeeId?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone Number"
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Controller
                name="licenseNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="License Number"
                    fullWidth
                    error={!!errors.licenseNumber}
                    helperText={errors.licenseNumber?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Controller
                name="licenseType"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="License Type"
                    fullWidth
                    error={!!errors.licenseType}
                    helperText={errors.licenseType?.message}
                  >
                    <MenuItem value="Class A">Class A</MenuItem>
                    <MenuItem value="Class B">Class B</MenuItem>
                    <MenuItem value="Class C">Class C</MenuItem>
                    <MenuItem value="Commercial">Commercial</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Controller
                name="licenseExpiry"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="License Expiry"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.licenseExpiry}
                    helperText={errors.licenseExpiry?.message}
                    value={
                      field.value
                        ? new Date(field.value).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? new Date(e.target.value) : null
                      )
                    }
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Initial Status"
                    fullWidth
                    error={!!errors.status}
                    helperText={errors.status?.message}
                  >
                    <MenuItem value="ON_JOB">On Job</MenuItem>
                    <MenuItem value="OFF_DUTY">Off Duty</MenuItem>
                    <MenuItem value="ON_LEAVE">On Leave</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isPending}>
            {isPending ? "Assign Driver" : "Assign Driver"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
