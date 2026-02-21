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
import { CustomerWithRelations } from "@/app/lib/type/customer";
import { updateCustomer } from "@/app/lib/controllers/customer";
import { useTransition, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { editCustomerValidationSchema } from "@/app/lib/validationSchema";
import { useUser } from "@/app/lib/hooks/useUser";

interface EditCustomerDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customer: CustomerWithRelations | null;
}

export default function EditCustomerDialog({
  open,
  onClose,
  onSuccess,
  customer,
}: EditCustomerDialogProps) {
  const { user } = useUser();
  const [isPending, startTransition] = useTransition();

  const defaultValues = useMemo(
    () => ({
      name: "",
      code: "",
      email: "",
      phone: "",
      address: "",
      taxId: "",
      industry: "",
    }),
    []
  );

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editCustomerValidationSchema) as any,
    defaultValues,
  });

  useEffect(() => {
    if (customer && open) {
      setValue("name", customer.name);
      setValue("code", customer.code);
      setValue("email", customer.email || "");
      setValue("phone", customer.phone || "");
      setValue("address", customer.address || "");
      setValue("taxId", customer.taxId || "");
      setValue("industry", customer.industry || "");
    } else {
      reset(defaultValues);
    }
  }, [customer, open, setValue, reset, defaultValues]);

  const onSubmit = (data: any) => {
    if (!customer || !user) return;

    startTransition(async () => {
      try {
        await updateCustomer(customer.id, user.id, data);
        toast.success("Customer updated successfully");
        onSuccess();
        onClose();
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || "Failed to update customer");
      }
    });
  };

  if (!customer) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Customer: {customer.name}</DialogTitle>
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
                    label="Customer Name"
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
                    label="Customer Code"
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
                  <TextField
                    {...field}
                    label="Industry"
                    fullWidth
                    error={!!errors.industry}
                    helperText={errors.industry?.message as string}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="taxId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Tax ID"
                    fullWidth
                    error={!!errors.taxId}
                    helperText={errors.taxId?.message as string}
                  />
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
                    error={!!errors.address}
                    helperText={errors.address?.message as string}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isPending}>
            {isPending ? "Updating..." : "Update Customer"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
