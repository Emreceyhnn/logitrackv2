"use client";

import { useMemo, useState } from "react";
import {
  Avatar,
  Chip,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DataTable from "@/app/components/ui/DataTable";
import type { DataTableColumn, DataTableRowAction } from "@/app/lib/type/dataTable";
import { CompanyPageProps, CompanyMember } from "@/app/lib/type/company";
import CompanyMemberDetailsDialog from "../../dialogs/company/CompanyMemberDetailsDialog";
import EditCompanyMemberDialog from "../../dialogs/company/EditCompanyMemberDialog";
import DeleteConfirmationDialog from "../../dialogs/deleteConfirmationDialog";

function StatusChip({ status }: { status: string }) {
  const normalized = status.toUpperCase();
  const colorMap: Record<string, "success" | "error" | "warning" | "default"> = {
    ACTIVE: "success",
    INACTIVE: "error",
    SUSPENDED: "warning",
  };
  return (
    <Chip
      label={normalized}
      color={colorMap[normalized] ?? "default"}
      size="small"
      sx={{ fontWeight: 600, fontSize: 11 }}
    />
  );
}

interface CompanyMembersTableProps {
  props: CompanyPageProps;
}

export default function CompanyMembersTable({
  props,
}: CompanyMembersTableProps) {
  const { state, actions } = props;
  const theme = useTheme();
  const members = state.data?.members ?? [];
  const loading = state.loading;
  
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<CompanyMember | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Local pagination
  const [localPage, setLocalPage] = useState(1);
  const [localLimit, setLocalLimit] = useState(10);

  const paginatedMembers = members.slice(
    (localPage - 1) * localLimit,
    localPage * localLimit
  );

  const meta = {
    page: localPage,
    limit: localLimit,
    total: members.length,
  };

  const handleAction = (action: "details" | "edit" | "delete", member: CompanyMember) => {
    setSelectedMember(member);
    if (action === "details") setDetailsOpen(true);
    if (action === "edit") setEditOpen(true);
    if (action === "delete") setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMember) return;
    setDeleteLoading(true);
    try {
      await actions.deleteMember(selectedMember.id);
      setDeleteOpen(false);
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns: DataTableColumn<CompanyMember>[] = useMemo(() => [
    {
      key: "member",
      label: "Member",
      render: (row) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            src={row.avatarUrl ?? undefined}
            sx={{ width: 32, height: 32, fontSize: 13, bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}
          >
            {!row.avatarUrl && `${row.name[0]}${row.surname[0]}`}
          </Avatar>
          <Typography fontSize={13} fontWeight={600}>
            {row.name} {row.surname}
          </Typography>
        </Stack>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (row) => (
        <Typography fontSize={13} color="text.secondary">
          {row.email}
        </Typography>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (row) => (
        row.roleName ? (
          <Chip
            label={row.roleName}
            size="small"
            variant="outlined"
            sx={{ fontSize: 11, fontWeight: 600 }}
          />
        ) : (
          <Typography fontSize={13} color="text.disabled">—</Typography>
        )
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusChip status={row.status} />,
    },
    {
      key: "joined",
      label: "Joined",
      render: (row) => (
        <Typography fontSize={13} color="text.secondary">
          {new Date(row.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </Typography>
      ),
    },
  ], [theme]);

  const rowActions: DataTableRowAction<CompanyMember>[] = useMemo(() => [
    {
      label: "Details",
      icon: <InfoIcon fontSize="small" color="info" />,
      onClick: (row) => handleAction("details", row),
    },
    {
      label: "Edit",
      icon: <EditIcon fontSize="small" />,
      onClick: (row) => handleAction("edit", row),
    },
    {
      label: "Delete",
      icon: <DeleteIcon fontSize="small" />,
      onClick: (row) => handleAction("delete", row),
      color: "error",
    },
  ], []);

  return (
    <>
      <DataTable<CompanyMember>
        rows={paginatedMembers}
        columns={columns}
        loading={loading}
        emptyMessage="No members found"
        meta={meta}
        onPageChange={setLocalPage}
        onLimitChange={(lim) => { setLocalLimit(lim); setLocalPage(1); }}
        rowActions={rowActions}
        wrapCard={true}
        tableTitle="Team Members"
      />
      
      <CompanyMemberDetailsDialog 
        open={detailsOpen} 
        onClose={() => setDetailsOpen(false)} 
        member={selectedMember} 
      />

      <EditCompanyMemberDialog 
        open={editOpen} 
        onClose={() => setEditOpen(false)} 
        member={selectedMember}
        onSuccess={actions.refreshAll}
      />

      <DeleteConfirmationDialog 
        open={deleteOpen} 
        onClose={() => setDeleteOpen(false)} 
        onConfirm={handleDeleteConfirm}
        title="Remove Member?"
        description={`Are you sure you want to remove ${selectedMember?.name} from the company? This will revoke their access immediately.`}
        loading={deleteLoading}
      />
    </>
  );
}
