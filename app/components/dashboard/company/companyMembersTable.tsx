"use client";

import {
  Avatar,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  alpha,
  useTheme,
} from "@mui/material";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { CompanyPageProps, CompanyMember } from "@/app/lib/type/company";
import { useState } from "react";
import CompanyMemberDetailsDialog from "../../dialogs/company/CompanyMemberDetailsDialog";
import EditCompanyMemberDialog from "../../dialogs/company/EditCompanyMemberDialog";
import DeleteConfirmationDialog from "../../dialogs/deleteConfirmationDialog";
import TableSkeleton from "@/app/components/skeletons/TableSkeleton";

function StatusChip({ status }: { status: string }) {
  const normalized = status.toUpperCase();
  const colorMap: Record<string, "success" | "error" | "warning" | "default"> =
  {
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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (loading) {
     return <TableSkeleton title="Team Members" rows={5} columns={6} />;
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, member: CompanyMember) => {
    setAnchorEl(event.currentTarget);
    setSelectedMember(member);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action: "details" | "edit" | "delete") => {
    handleMenuClose();
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

  return (
    <>
      <TableContainer sx={{ p: 0 }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, borderColor: alpha(theme.palette.divider, 0.1) }}>Member</TableCell>
              <TableCell sx={{ fontWeight: 600, borderColor: alpha(theme.palette.divider, 0.1) }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600, borderColor: alpha(theme.palette.divider, 0.1) }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 600, borderColor: alpha(theme.palette.divider, 0.1) }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, borderColor: alpha(theme.palette.divider, 0.1) }}>Joined</TableCell>
              <TableCell sx={{ fontWeight: 600, borderColor: alpha(theme.palette.divider, 0.1) }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ "& tr:last-child td": { border: 0 } }}>
            {members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}>
                  <Stack py={4} alignItems="center" spacing={1}>
                    <PeopleOutlineIcon
                      sx={{ fontSize: 36, color: "text.disabled" }}
                    />
                    <Typography color="text.secondary" fontSize={14}>
                      No members found
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow
                  key={member.id}
                  hover
                  sx={{ "& td": { borderColor: alpha(theme.palette.divider, 0.1) } }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        src={member.avatarUrl ?? undefined}
                        sx={{ width: 32, height: 32, fontSize: 13, bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}
                      >
                        {!member.avatarUrl &&
                          `${member.name[0]}${member.surname[0]}`}
                      </Avatar>
                      <Typography fontSize={13} fontWeight={600}>
                        {member.name} {member.surname}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize={13} color="text.secondary">
                      {member.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {member.roleName ? (
                      <Chip
                        label={member.roleName}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: 11, fontWeight: 600 }}
                      />
                    ) : (
                      <Typography fontSize={13} color="text.disabled">
                        —
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusChip status={member.status} />
                  </TableCell>
                  <TableCell>
                    <Typography fontSize={13} color="text.secondary">
                      {new Date(member.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, member)}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          sx: {
            minWidth: 150,
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            bgcolor: "#0B0F19",
          },
        }}
      >
        <MenuItem onClick={() => handleAction("details")}>
          <ListItemIcon><InfoIcon fontSize="small" color="info" /></ListItemIcon>
          <ListItemText primary="Details" primaryTypographyProps={{ variant: "body2", fontWeight: 600 }} />
        </MenuItem>
        <MenuItem onClick={() => handleAction("edit")}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: "body2", fontWeight: 600 }} />
        </MenuItem>
        <Divider sx={{ my: 0.5, borderColor: alpha(theme.palette.divider, 0.1) }} />
        <MenuItem onClick={() => handleAction("delete")} sx={{ color: "error.main" }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: "body2", fontWeight: 600 }} />
        </MenuItem>
      </Menu>

      {/* Dialogs */}
      
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
