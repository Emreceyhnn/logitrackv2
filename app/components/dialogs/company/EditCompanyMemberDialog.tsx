"use client";

import React, { useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  Button,
  Grid,
  TextField,
  Typography,
  Box,
  IconButton,
  Stack,
  
  useTheme,
  Divider,
  MenuItem,
} from "@mui/material";
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { useForm, Controller, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CompanyMember } from "@/app/lib/type/company";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { updateCompanyMember } from "@/app/lib/controllers/company";
import { UserStatus } from "@/app/lib/type/enums";
import { editCompanyMemberValidationSchema } from "@/app/lib/validationSchema";


interface EditCompanyMemberDialogProps {
  open: boolean;
  onClose: () => void;
  member: CompanyMember | null;
  onSuccess: () => void;
}

type FormData = {
  name: string;
  surname: string;
  roleId: string;
  status: string;
};

export default function EditCompanyMemberDialog({
  open,
  onClose,
  member,
  onSuccess,
}: EditCompanyMemberDialogProps) {
  const theme = useTheme();
  const dict = useDictionary();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    resolver: yupResolver(useMemo(() => editCompanyMemberValidationSchema(dict), [dict])) as unknown as Resolver<FormData>,
    defaultValues: {
      name: "",
      surname: "",
      roleId: "",
      status: "",
    },
  });

  useEffect(() => {
    if (member && open) {
      reset({
        name: member.name,
        surname: member.surname,
        roleId: member.roleId || "role_default",
        status: member.status,
      });
    }
  }, [member, open, reset]);

  const onSubmit = async (data: FormData) => {
    if (!member) return;
    try {
      await updateCompanyMember(member.id, {
        name: data.name,
        surname: data.surname,
        roleId: data.roleId,
        status: data.status as UserStatus,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update member", error);
    }
  };

  if (!member) return null;

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      bgcolor: theme.palette.background.paper_alpha.main_05,
      borderRadius: 2.5,
      color: "white",
      "& fieldset": { borderColor: theme.palette.divider_alpha.main_10 },
      "&:hover fieldset": { borderColor: theme.palette.primary._alpha.main_30 },
      "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
    },
    "& .MuiInputLabel-root": { color: theme.palette.common.white_alpha.main_50 },
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
          borderRadius: 4,
          backgroundImage: "none",
          border: `1px solid ${theme.palette.divider_alpha.main_10}`,
          overflow: "hidden",
        },
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
                bgcolor: theme.palette.primary._alpha.main_10,
                color: theme.palette.primary.main,
              }}
            >
              <EditIcon />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700} color="white">
                {dict.company.editMember.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {dict.company.editMember.subtitle.replace("{name}", member.name)}
              </Typography>
            </Box>
          </Stack>
          <IconButton onClick={onClose} size="small" sx={{ color: "text.secondary" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>
 
       <Divider sx={{ borderColor: theme.palette.divider_alpha.main_10 }} />
 
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
                       label={dict.company.editMember.firstName}
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
                       label={dict.company.editMember.lastName}
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
               name="roleId"
               control={control}
               render={({ field }) => (
                 <TextField
                   {...field}
                   select
                   label={dict.company.editMember.systemRole}
                   fullWidth
                   error={!!errors.roleId}
                   helperText={errors.roleId?.message}
                   sx={textFieldSx}
                 >
                   <MenuItem value="role_default">{dict.company.roles.default}</MenuItem>
                   <MenuItem value="role_admin">{dict.company.roles.admin}</MenuItem>
                   <MenuItem value="role_manager">{dict.company.roles.manager}</MenuItem>
                   <MenuItem value="role_dispatcher">{dict.company.roles.dispatcher}</MenuItem>
                   <MenuItem value="role_warehouse">{dict.company.roles.warehouse}</MenuItem>
                   <MenuItem value="role_driver">{dict.company.roles.driver}</MenuItem>
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
                  label={dict.company.editMember.accountStatus}
                  fullWidth
                   error={!!errors.status}
                   helperText={errors.status?.message}
                  sx={textFieldSx}
                >
                   <MenuItem value="ACTIVE">{dict.company.editMember.statuses.ACTIVE}</MenuItem>
                   <MenuItem value="INACTIVE">{dict.company.editMember.statuses.INACTIVE}</MenuItem>
                   <MenuItem value="SUSPENDED">{dict.company.editMember.statuses.SUSPENDED}</MenuItem>
                </TextField>
              )}
            />
          </Stack>
        </DialogContent>
 
        <Divider sx={{ borderColor: theme.palette.divider_alpha.main_10 }} />
 
        <Box sx={{ p: 3, px: 4, bgcolor: theme.palette.background.default_alpha.main_10 }}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button 
              onClick={onClose}
              sx={{ px: 3, fontWeight: 600, color: "text.secondary", textTransform: "none" }}
            >
              {dict.common.cancel}
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
                boxShadow: `0 8px 24px ${theme.palette.primary._alpha.main_20}`,
              }}
            >
              {isSubmitting ? dict.company.editMember.saving : dict.common.save}
            </Button>
          </Stack>
        </Box>
      </form>
    </Dialog>
  );
}
