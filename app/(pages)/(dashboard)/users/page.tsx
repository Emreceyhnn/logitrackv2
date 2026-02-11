"use client";

import { Box, Button, Typography, Stack, CircularProgress, Chip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { getUsersForMyCompany } from "@/app/lib/controllers/users";
import Link from "next/link";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const data = await getUsersForMyCompany(token);
                    setUsers(data);
                } catch (error) {
                    console.error("Failed to fetch users:", error);
                }
            }
            setLoading(false);
        };

        fetchUsers();
    }, []);

    const columns: GridColDef[] = [
        { field: "username", headerName: "Username", flex: 1 },
        { field: "name", headerName: "Name", flex: 1 },
        { field: "surname", headerName: "Surname", flex: 1 },
        { field: "email", headerName: "Email", flex: 1.5 },
        {
            field: "role",
            headerName: "Role",
            flex: 1,
            renderCell: (params) => {
                return <Chip label={params.value?.name || "N/A"} size="small" variant="outlined" sx={{ color: "white", borderColor: "rgba(255,255,255,0.2)" }} />
            }
        },
    ];

    return (
        <Box sx={{ height: "100%", width: "100%", p: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" fontWeight={700} color="white">
                    Users
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddRoundedIcon />}
                    component={Link}
                    href="/users/create"
                    sx={{
                        backgroundColor: "#38bdf8",
                        "&:hover": { backgroundColor: "#0ea5e9" },
                        textTransform: "none",
                        fontWeight: 600
                    }}
                >
                    Add User
                </Button>
            </Stack>

            <Box sx={{ height: 600, width: "100%", bgcolor: "#151515", borderRadius: 2 }}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                        <CircularProgress size={32} sx={{ color: "#38bdf8" }} />
                    </Box>
                ) : (
                    <DataGrid
                        rows={users}
                        columns={columns}
                        getRowId={(row) => row.id}
                        sx={{
                            border: "none",
                            color: "white",
                            "& .MuiDataGrid-cell": {
                                borderColor: "rgba(255, 255, 255, 0.1)",
                            },
                            "& .MuiDataGrid-columnHeaders": {
                                bgcolor: "rgba(255, 255, 255, 0.05)",
                                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                            },
                            "& .MuiDataGrid-row:hover": {
                                bgcolor: "rgba(255, 255, 255, 0.05)",
                            },
                            "& .MuiTablePagination-root": {
                                color: "white"
                            },
                            "& .MuiSvgIcon-root": {
                                color: "white"
                            }
                        }}
                    />
                )}
            </Box>
        </Box>
    );
}
