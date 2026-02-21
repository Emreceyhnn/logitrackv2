"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
  Divider,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createCustomer } from "@/app/lib/controllers/customer";
import { useTransition } from "react";
import { toast } from "sonner";
import { useUser } from "@/app/lib/hooks/useUser";
import * as Yup from "yup";

const addCustomerSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  code: Yup.string().required("Code is required"),
  email: Yup.string().email("Invalid email").nullable(),
  phone: Yup.string().nullable(),
  address: Yup.string().nullable(),
  taxId: Yup.string().nullable(),
  industry: Yup.string().nullable(),
});

interface AddCustomerDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddCustomerDialog({
  open,
  onClose,
  onSuccess,
}: AddCustomerDialogProps) {
  const { user } = useUser();
  const [isPending, startTransition] = useTransition();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addCustomerSchema) as any,
    defaultValues: {
      name: "",
      code: "",
      email: "",
      phone: "",
      address: "",
      taxId: "",
      industry: "",
    },
  });

  const onSubmit = (data: any) => {
    if (!user) return;
    const COMPANY_ID = "cmlgt985b0003x0cuhtyxoihd";

    startTransition(async () => {
      try {
        await createCustomer(
          user.id,
          COMPANY_ID,
          data.name,
          data.code,
          data.industry || undefined,
          data.taxId || undefined,
          data.email || undefined,
          data.phone || undefined,
          data.address || undefined
        );
        toast.success("Customer created successfully");
        reset();
        onSuccess();
        onClose();
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || "Failed to create customer");
      }
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Customer</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                General Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Customer Name *"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message as string}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="code"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Customer Code *"
                    fullWidth
                    error={!!errors.code}
                    helperText={errors.code?.message as string}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, mb: 1, mt: 2 }}
              >
                Contact & Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message as string}
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
                    label="Phone"
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone?.message as string}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="industry"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Industry" fullWidth />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="taxId"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Tax ID" fullWidth />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Address"
                    fullWidth
                    multiline
                    rows={3}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isPending}>
            {isPending ? "Creating..." : "Create Customer"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
