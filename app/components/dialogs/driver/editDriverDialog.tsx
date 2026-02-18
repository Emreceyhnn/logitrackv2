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
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { DriverWithRelations } from "@/app/lib/type/driver";
import { updateDriver } from "@/app/lib/controllers/driver";
import { useTransition, useEffect } from "react";
import { toast } from "sonner";
import { editDriverValidationSchema } from "@/app/lib/validationSchema";

interface EditDriverDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  driver: DriverWithRelations | null;
}

export default function EditDriverDialog({
  open,
  onClose,
  onSuccess,
  driver,
}: EditDriverDialogProps) {
  /* --------------------------------- states --------------------------------- */
  const [isPending, startTransition] = useTransition();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editDriverValidationSchema) as any,
    defaultValues: {
      phone: "",
      licenseNumber: "",
      licenseType: "",
      licenseExpiry: null as Date | null,
      employeeId: "",
      status: "",
    },
  });

  /* -------------------------------- lifecycle ------------------------------- */
  useEffect(() => {
    if (driver && open) {
      setValue("phone", driver.phone);
      setValue("licenseNumber", driver.licenseNumber || "");
      setValue("licenseType", driver.licenseType || "");
      setValue(
        "licenseExpiry",
        driver.licenseExpiry ? new Date(driver.licenseExpiry) : null
      );
      setValue("employeeId", driver.employeeId || "");
      setValue("status", driver.status);
    }
  }, [driver, open, setValue]);

  /* -------------------------------- handlers -------------------------------- */
  const onSubmit = (data: any) => {
    if (!driver) return;

    startTransition(async () => {
      try {
        await updateDriver(driver.id, data);
        toast.success("Driver updated successfully");
        onSuccess();
        onClose();
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || "Failed to update driver");
      }
    });
  };

  if (!driver) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Edit Driver: {driver.user.name} {driver.user.surname}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
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
                    helperText={errors.employeeId?.message as string}
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
                    helperText={errors.phone?.message as string}
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
                    helperText={errors.licenseNumber?.message as string}
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
                    helperText={errors.licenseType?.message as string}
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
                    helperText={errors.licenseExpiry?.message as string}
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
                    label="Status"
                    fullWidth
                    error={!!errors.status}
                    helperText={errors.status?.message as string}
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
            {isPending ? "Updating..." : "Update Driver"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
