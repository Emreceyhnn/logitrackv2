"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Typography,
  Box,
  IconButton,
  Stack,
  alpha,
  useTheme,
  Divider,
  MenuItem,
} from "@mui/material";
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CompanyMember } from "@/app/lib/type/company";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  surname: yup.string().required("Surname is required"),
  roleName: yup.string().required("Role is required"),
  status: yup.string().required("Status is required"),
}).required();

interface EditCompanyMemberDialogProps {
  open: boolean;
  onClose: () => void;
  member: CompanyMember | null;
  onSuccess: () => void;
}

type FormData = {
  name: string;
  surname: string;
  roleName: string;
  status: string;
};

export default function EditCompanyMemberDialog({
  open,
  onClose,
  member,
  onSuccess,
}: EditCompanyMemberDialogProps) {
  const theme = useTheme();
  
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: "",
      surname: "",
      roleName: "",
      status: "",
    },
  });

  useEffect(() => {
    if (member && open) {
      reset({
        name: member.name,
        surname: member.surname,
        roleName: member.roleName || "USER",
        status: member.status,
      });
    }
  }, [member, open, reset]);

  const onSubmit = async (data: FormData) => {
    if (!member) return;
    try {
      // Logic for updating member would go here
      // For now, we simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update member", error);
    }
  };

  if (!member) return null;

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      bgcolor: alpha(theme.palette.background.paper, 0.05),
      borderRadius: 2.5,
      color: "white",
      "& fieldset": { borderColor: alpha(theme.palette.divider, 0.1) },
      "&:hover fieldset": { borderColor: alpha(theme.palette.primary.main, 0.3) },
      "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
    },
    "& .MuiInputLabel-root": { color: alpha("#fff", 0.5) },
    "& .MuiInputLabel-root.Mui-focused": { color: theme.palette.primary.main },
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        sx: { 
          bgcolor: "#0B0F19",
          backgroundImage: "none",
          borderRadius: 4, 
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          overflow: "hidden",
        }
      }}
    >
      <Box sx={{ p: 3, pb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
              }}
            >
              <EditIcon />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700} color="white">
                Edit Member
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Modify permissions and profile for {member.name}
              </Typography>
            </Box>
          </Stack>
          <IconButton onClick={onClose} size="small" sx={{ color: "text.secondary" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.1) }} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="First Name"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      sx={textFieldSx}
                    />
                  )}
                />
              </Grid>
              <Grid size={6}>
                <Controller
                  name="surname"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Last Name"
                      fullWidth
                      error={!!errors.surname}
                      helperText={errors.surname?.message}
                      sx={textFieldSx}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Controller
              name="roleName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="System Role"
                  fullWidth
                  error={!!errors.roleName}
                  helperText={errors.roleName?.message}
                  sx={textFieldSx}
                >
                  <MenuItem value="ADMIN">Administrator</MenuItem>
                  <MenuItem value="MANAGER">Manager</MenuItem>
                  <MenuItem value="OPERATOR">Operator</MenuItem>
                  <MenuItem value="USER">Standard User</MenuItem>
                </TextField>
              )}
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Account Status"
                  fullWidth
                  error={!!errors.status}
                  helperText={errors.status?.message}
                  sx={textFieldSx}
                >
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="INACTIVE">Inactive</MenuItem>
                  <MenuItem value="SUSPENDED">Suspended</MenuItem>
                </TextField>
              )}
            />
          </Stack>
        </DialogContent>

        <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.1) }} />

        <Box sx={{ p: 3, px: 4, bgcolor: alpha(theme.palette.background.default, 0.1) }}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button 
              onClick={onClose}
              sx={{ px: 3, fontWeight: 600, color: "text.secondary", textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={<SaveIcon />}
              sx={{ 
                minWidth: 160,
                borderRadius: 2, 
                fontWeight: 700,
                textTransform: "none",
                boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </Stack>
        </Box>
      </form>
    </Dialog>
  );
}
