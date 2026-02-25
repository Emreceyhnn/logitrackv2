"use client";

import {
  Avatar,
  Box,
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
import { CompanyMember } from "@/app/lib/type/company";

interface CompanyMembersTableProps {
  members: CompanyMember[];
  loading: boolean;
}

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

export default function CompanyMembersTable({
  members,
  loading,
}: CompanyMembersTableProps) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <Box px={3} pt={2.5} pb={1.5}>
        <Typography fontWeight={700} fontSize={16}>
          Team Members
        </Typography>
        <Typography fontSize={13} color="text.secondary">
          All users belonging to this company
        </Typography>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Member</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Joined</TableCell>
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
                </TableRow>
              ))}

            {!loading && members.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
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
                        sx={{ width: 32, height: 32, fontSize: 13 }}
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
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
