"use client";

import { useMemo, useState } from "react";
import {
  Avatar,
  Stack,
  Typography,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Select,
  MenuItem,
  FormControl,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { toast } from "sonner";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import DataTable from "@/app/components/ui/DataTable";
import type { DataTableColumn, DataTableRowAction } from "@/app/lib/type/dataTable";
import DeleteConfirmationDialog from "@/app/components/dialogs/deleteConfirmationDialog";
import DriverDetailsForm from "@/app/components/dialogs/company/sections/DriverDetailsForm";
import { addCompanyMemberDriverValidationSchema } from "@/app/lib/validationSchema";
import { ValidationError } from "yup";
import { useDateSettings } from "@/app/hooks/useDateSettings";
import { formatDisplayDate } from "@/app/lib/utils/date";
import type { DriverStateData } from "@/app/lib/type/add-company-member";
import {
  usePendingJoinRequests,
  useJoinRequestMutations,
} from "@/app/hooks/useCompany";

interface JoinRequestRow {
  id: string;
  createdAt: string | Date;
  user: { name: string; surname: string; email: string; avatarUrl: string | null };
}

const initialDriverData: DriverStateData = {
  employeeId: "",
  phone: "",
  licenseNumber: "",
  licenseType: "",
  licenseExpiry: "",
};

export default function PendingJoinRequestsTable() {
  const dict = useDictionary();
  const theme = useTheme();
  const dateSettings = useDateSettings();
  const { data, isLoading, refetch } = usePendingJoinRequests();
  const { accept, reject } = useJoinRequestMutations();

  const rows: JoinRequestRow[] = data ?? [];

  const [acceptTarget, setAcceptTarget] = useState<JoinRequestRow | null>(null);
  const [rejectTarget, setRejectTarget] = useState<JoinRequestRow | null>(null);
  const [selectedRole, setSelectedRole] = useState("role_default");
  const [driverData, setDriverData] = useState<DriverStateData>(initialDriverData);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [rejectLoading, setRejectLoading] = useState(false);

  const roles = useMemo(
    () => [
      { id: "role_admin", label: dict.company.roles.Administrator || "Admin" },
      { id: "role_manager", label: dict.company.roles["Warehouse Manager"] || "Manager" },
      { id: "role_dispatcher", label: dict.company.roles.Dispatcher || "Dispatcher" },
      { id: "role_warehouse", label: dict.company.roles["Warehouse Operator"] || "Warehouse Worker" },
      { id: "role_default", label: dict.company.roles.Customer || "User" },
      { id: "role_driver", label: dict.company.roles.Driver || "Driver" },
    ],
    [dict]
  );

  const handleDriverDataChange = (field: keyof DriverStateData, value: string) =>
    setDriverData((prev) => ({ ...prev, [field]: value }));

  const openAccept = (row: JoinRequestRow) => {
    setAcceptTarget(row);
    setSelectedRole("role_default");
    setDriverData(initialDriverData);
    setValidationErrors({});
  };

  const closeAccept = () => setAcceptTarget(null);

  const handleAccept = async () => {
    if (!acceptTarget) return;
    try {
      if (selectedRole === "role_driver") {
        const schema = addCompanyMemberDriverValidationSchema(dict);
        await schema.validate(driverData, { abortEarly: false });
      }
      const id = acceptTarget.id;
      closeAccept();
      await toast.promise(
        accept.mutateAsync(
          selectedRole === "role_driver"
            ? { id, roleName: selectedRole, driverData }
            : { id, roleName: selectedRole }
        ),
        {
          loading: dict.toasts?.loading || "Accepting...",
          success: dict.toasts.successJoinRequestAccepted,
          error: (err: unknown) => (err instanceof Error ? err.message : dict.toasts.errorGeneric),
        }
      );
      await refetch();
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        const errors: Record<string, string> = {};
        err.inner.forEach((e) => {
          if (e.path) errors[e.path] = e.message;
        });
        setValidationErrors(errors);
        toast.error(dict.validation.genericFormError);
      } else {
        toast.error(err instanceof Error ? err.message : dict.toasts.errorGeneric);
      }
    }
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    setRejectLoading(true);
    try {
      await reject.mutateAsync(rejectTarget.id);
      toast.success(dict.toasts.successJoinRequestRejected);
      setRejectTarget(null);
      await refetch();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : dict.toasts.errorGeneric);
    } finally {
      setRejectLoading(false);
    }
  };

  const columns: DataTableColumn<JoinRequestRow>[] = useMemo(
    () => [
      {
        key: "requester",
        label: dict.company.joinRequests.columns.requester,
        render: (row) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              src={row.user.avatarUrl ?? undefined}
              sx={{ width: 32, height: 32, fontSize: 13 }}
            >
              {!row.user.avatarUrl && `${row.user.name[0]}${row.user.surname[0]}`}
            </Avatar>
            <Typography fontSize={13} fontWeight={600}>
              {row.user.name} {row.user.surname}
            </Typography>
          </Stack>
        ),
      },
      {
        key: "email",
        label: dict.company.joinRequests.columns.email,
        render: (row) => (
          <Typography fontSize={13} color="text.secondary">
            {row.user.email}
          </Typography>
        ),
      },
      {
        key: "requestedAt",
        label: dict.company.joinRequests.columns.requestedAt,
        render: (row) => (
          <Typography fontSize={13} color="text.secondary">
            {formatDisplayDate(row.createdAt, dateSettings)}
          </Typography>
        ),
      },
    ],
    [dict, dateSettings]
  );

  const rowActions: DataTableRowAction<JoinRequestRow>[] = useMemo(
    () => [
      {
        label: dict.company.joinRequests.actions.accept,
        icon: <CheckIcon fontSize="small" color="success" />,
        onClick: openAccept,
      },
      {
        label: dict.company.joinRequests.actions.reject,
        icon: <ClearIcon fontSize="small" />,
        onClick: (row) => setRejectTarget(row),
        color: "error",
      },
    ],
    [dict]
  );

  return (
    <>
      <DataTable<JoinRequestRow>
        rows={rows}
        columns={columns}
        loading={isLoading}
        emptyMessage={dict.company.joinRequests.empty}
        rowActions={rowActions}
        wrapCard={true}
        tableTitle={dict.company.joinRequests.title}
      />

      <Dialog open={!!acceptTarget} onClose={closeAccept} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {dict.company.dialogs.acceptJoinRequestTitle}
          <IconButton onClick={closeAccept} aria-label="close">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            <Box sx={{ p: 2, borderRadius: 3, bgcolor: theme.palette.primary._alpha?.main_02 }}>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, mb: 1, display: "block" }}>
                {dict.company.dialogs.assignRole}
              </Typography>
              <FormControl fullWidth>
                <Select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            {selectedRole === "role_driver" && (
              <DriverDetailsForm
                driverData={driverData}
                handleDriverDataChange={handleDriverDataChange}
                validationErrors={validationErrors}
                dict={dict}
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={closeAccept} sx={{ color: "text.secondary" }}>
            {dict.common.cancel}
          </Button>
          <Button
            variant="contained"
            onClick={handleAccept}
            disabled={selectedRole === "role_driver" && (!driverData.employeeId || !driverData.phone)}
          >
            {dict.company.joinRequests.actions.accept}
          </Button>
        </DialogActions>
      </Dialog>

      <DeleteConfirmationDialog
        open={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        onConfirm={handleReject}
        title={dict.company.dialogs.rejectJoinRequestTitle}
        description={dict.company.dialogs.rejectJoinRequestDescription}
        loading={rejectLoading}
      />
    </>
  );
}
