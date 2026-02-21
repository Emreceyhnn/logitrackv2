"use client";

import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { UserWithRelations, UserListProps } from "@/app/lib/type/users";
import EditIcon from "@mui/icons-material/Edit";

const UserList = ({ users, loading, onSelect }: UserListProps) => {
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
      valueGetter: (params, row) =>
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

  return (
    <Paper
      sx={{ height: 600, width: "100%", borderRadius: 2, overflow: "hidden" }}
    >
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress size={32} />
        </Box>
      ) : (
        <DataGrid
          rows={users}
          columns={columns}
          getRowId={(row) => row.id}
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              bgcolor: "background.default",
            },
            "& .MuiDataGrid-row:hover": {
              bgcolor: "action.hover",
              cursor: "pointer",
            },
          }}
          onRowClick={(params) => onSelect(params.row.id)}
        />
      )}
    </Paper>
  );
};

export default UserList;
