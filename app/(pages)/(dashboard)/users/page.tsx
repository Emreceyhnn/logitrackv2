"use client";

import { Box, Button, Typography, Stack } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { getMyCompanyUsersAction } from "@/app/lib/controllers/users";
import { UsersPageState, UsersPageActions } from "@/app/lib/type/users";
import UserList from "@/app/components/dashboard/users/UserList";
import Link from "next/link";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

export default function UsersPage() {
  /* ---------------------------------- state --------------------------------- */
  const [state, setState] = useState<UsersPageState>({
    users: [],
    selectedUserId: null,
    filters: {},
    loading: true,
    error: null,
  });

  /* --------------------------------- actions -------------------------------- */
  const fetchUsers = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const data = await getMyCompanyUsersAction();
      // Cast to compatible type (UserWithRelations includes role/driver)
      // The controller returns role/driver, so it should match.
      setState((prev) => ({
        ...prev,
        users: data as any,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      console.error("Failed to fetch users:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
    }
  }, []);

  const actions: UsersPageActions = {
    fetchUsers,
    selectUser: (id) => setState((prev) => ({ ...prev, selectedUserId: id })),
    updateFilters: (filters) =>
      setState((prev) => ({
        ...prev,
        filters: { ...prev.filters, ...filters },
      })),
  };

  /* --------------------------------- effects -------------------------------- */
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <Box sx={{ height: "100%", width: "100%", p: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" fontWeight={700}>
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
            fontWeight: 600,
          }}
        >
          Add User
        </Button>
      </Stack>

      <UserList
        users={state.users}
        loading={state.loading}
        onSelect={actions.selectUser}
      />
    </Box>
  );
}
