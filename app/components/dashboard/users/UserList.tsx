"use client";

import { useMemo, useState } from "react";
import { Chip, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { UserListProps, UserWithRelations } from "@/app/lib/type/users";
import CustomCard from "../../cards/card";
import DataTable from "@/app/components/ui/DataTable";
import type { DataTableColumn, DataTableRowAction } from "@/app/lib/type/dataTable";

const UserList = ({ users, loading, onSelect }: UserListProps) => {
  const [localPage, setLocalPage] = useState(1);
  const [localLimit, setLocalLimit] = useState(10);

  const paginatedUsers = users.slice(
    (localPage - 1) * localLimit,
    localPage * localLimit
  );

  const meta = {
    page: localPage,
    limit: localLimit,
    total: users.length,
  };

  const columns: DataTableColumn<UserWithRelations>[] = useMemo(() => [
    {
      key: "fullName",
      label: "Full Name",
      sortable: true,
      sortKey: "name",
      render: (row) => `${row.name || ""} ${row.surname || ""}`.trim(),
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      render: (row) => row.email,
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      sortKey: "roleId",
      render: (row) => {
        const roleName = row.role?.name || "User";
        let color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" = "default";

        if (roleName.toLowerCase().includes("admin")) color = "error";
        else if (roleName.toLowerCase().includes("manager")) color = "warning";
        else if (roleName.toLowerCase().includes("driver")) color = "info";

        return (
          <Chip
            label={roleName}
            size="small"
            variant="outlined"
            color={color}
            sx={{ fontWeight: 600 }}
          />
        );
      },
    },
  ], []);

  const rowActions: DataTableRowAction<UserWithRelations>[] = useMemo(() => [
    {
      label: "Edit",
      icon: <EditIcon fontSize="small" />,
      onClick: (row) => onSelect(row.id),
    },
  ], [onSelect]);

  return (
    <CustomCard sx={{ p: 0, overflow: "hidden" }}>
      <Box sx={{ p: 0 }}>
        <DataTable<UserWithRelations>
          rows={paginatedUsers}
          columns={columns}
          loading={loading}
          emptyMessage="No users found."
          meta={meta}
          onPageChange={setLocalPage}
          onLimitChange={(lim) => { setLocalLimit(lim); setLocalPage(1); }}
          rowActions={rowActions}
        />
      </Box>
    </CustomCard>
  );
};

export default UserList;
