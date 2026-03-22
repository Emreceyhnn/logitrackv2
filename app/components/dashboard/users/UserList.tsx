"use client";

import {
  IconButton,
  Chip,
  Box,
  alpha,
  useTheme,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { UserListProps } from "@/app/lib/type/users";
import EditIcon from "@mui/icons-material/Edit";
import CustomCard from "../../cards/card";
import TableSkeleton from "@/app/components/skeletons/TableSkeleton";

const UserList = ({ users, loading, onSelect }: UserListProps) => {
  const theme = useTheme();
  
  const columns: GridColDef[] = [
    {
      field: "username",
      headerName: "Username",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "fullName",
      headerName: "Full Name",
      flex: 1.5,
      minWidth: 150,
      valueGetter: (value, row) =>
        `${row.name || ""} ${row.surname || ""}`.trim(),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.5,
      minWidth: 180,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        const roleName = params.row.role?.name || "User";
        let color:
          | "default"
          | "primary"
          | "secondary"
          | "error"
          | "info"
          | "success"
          | "warning" = "default";

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
    {
      field: "actions",
      headerName: "Actions",
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(params.row.id);
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  if (loading) {
    return <TableSkeleton title="Users List" rows={10} columns={5} />;
  }

  return (
    <CustomCard sx={{ p: 0, overflow: "hidden", height: 600 }}>
      <Box sx={{ p: 0, height: "100%" }}>
        <DataGrid
          rows={users}
          columns={columns}
          getRowId={(row) => row.id}
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              bgcolor: alpha(theme.palette.primary.main, 0.03),
            },
            "& .MuiDataGrid-row:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              cursor: "pointer",
            },
            "& .MuiDataGrid-cell": {
              borderColor: alpha(theme.palette.divider, 0.1),
            },
            "& .MuiDataGrid-columnSeparator": {
              display: "none",
            },
          }}
          onRowClick={(params) => onSelect(params.row.id)}
        />
      </Box>
    </CustomCard>
  );
};

export default UserList;
