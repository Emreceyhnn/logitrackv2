"use client";

import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { CompanyPageProps, CompanyMember } from "@/app/lib/type/company";
import { useState } from "react";
import AddCompanyMemberDialog from "../../dialogs/company/AddCompanyMemberDialog";
import CompanyMemberDetailsDialog from "../../dialogs/company/CompanyMemberDetailsDialog";
import EditCompanyMemberDialog from "../../dialogs/company/EditCompanyMemberDialog";
import DeleteConfirmationDialog from "../../dialogs/deleteConfirmationDialog";
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Divider as MuiDivider, alpha, useTheme } from "@mui/material";

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

const SKELETON_ROWS = 4;

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
  
  const [addOpen, setAddOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<CompanyMember | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
    <Card variant="outlined" sx={{ borderRadius: 3, bgcolor: "background.paper" }}>
      <Stack
        px={3}
        pt={2.5}
        pb={1.5}
        direction={"row"}
        justifyContent={"space-between"}
      >
        <Stack>
          <Typography fontWeight={700} fontSize={16}>
            Team Members
          </Typography>
          <Typography fontSize={13} color="text.secondary">
            All users belonging to this company
          </Typography>
        </Stack>
        <Button
          variant="contained"
          sx={{ borderRadius: "8px", fontWeight: 700, textTransform: "none" }}
          onClick={() => setAddOpen(true)}
        >
          Add Member
        </Button>
      </Stack>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Member</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Joined</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading &&
              Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Skeleton variant="circular" width={32} height={32} />
                      <Skeleton width={100} height={16} />
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Skeleton width={140} height={16} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={70} height={22} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={60} height={22} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={90} height={16} />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton variant="circular" width={24} height={24} sx={{ ml: "auto" }} />
                  </TableCell>
                </TableRow>
              ))}

            {!loading && members.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
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
            )}

            {!loading &&
              members.map((member) => (
                <TableRow
                  key={member.id}
                  hover
                  sx={{ "&:last-child td": { borderBottom: 0 } }}
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
                      <Typography fontSize={13} fontWeight={500}>
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
              ))}
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
        <MuiDivider sx={{ my: 0.5, borderColor: alpha(theme.palette.divider, 0.1) }} />
        <MenuItem onClick={() => handleAction("delete")} sx={{ color: "error.main" }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: "body2", fontWeight: 600 }} />
        </MenuItem>
      </Menu>

      {/* Dialogs */}
      <AddCompanyMemberDialog open={addOpen} onClose={() => setAddOpen(false)} />
      
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
    </Card>
  );
}
