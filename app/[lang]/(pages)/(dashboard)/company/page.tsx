"use client";

import { Box, Stack, Typography, Alert, Button, useTheme } from "@mui/material";
import { useState, useMemo } from "react";
import AddIcon from "@mui/icons-material/Add";
import {
  CompanyPageActions,
  CompanyProfile,
  CompanyStats,
  CompanyMember,
} from "@/app/lib/type/company";
import { useCompanyProfile, useCompanyMutations } from "@/app/hooks/useCompany";
import CompanyInfoCard from "@/app/components/dashboard/company/companyInfoCard";
import CompanyMembersTable from "@/app/components/dashboard/company/companyMembersTable";
import AddCompanyMemberDialog from "@/app/components/dialogs/company/AddCompanyMemberDialog";
import {
  People,
  DirectionsCar,
  Badge,
  Warehouse,
  Groups,
  LocalShipping,
} from "@mui/icons-material";
import KpiCards from "@/app/components/cards/KpiCards";

export default function CompanyPage() {
  /* -------------------------------- VARIABLES ------------------------------- */
  const theme = useTheme();

  /* ---------------------------------- HOOKS --------------------------------- */
  const {
    data: result,
    isLoading: loading,
    error,
    refetch,
  } = useCompanyProfile();
  const { deleteMember: deleteMutation } = useCompanyMutations();

  /* ---------------------------------- STATE --------------------------------- */
  const [addMemberOpen, setAddMemberOpen] = useState(false);

  /* --------------------------------- ACTIONS -------------------------------- */
  const state = useMemo(
    () => ({
      data: result
        ? {
            profile: result.profile as CompanyProfile,
            stats: result.stats as CompanyStats,
            members: result.members as CompanyMember[],
          }
        : null,
      loading,
      error: error
        ? error instanceof Error
          ? error.message
          : String(error)
        : null,
    }),
    [result, loading, error]
  );

  const actions: CompanyPageActions = useMemo(
    () => ({
      fetchData: async () => {
        await refetch();
      },
      refreshAll: async () => {
        await refetch();
      },
      deleteMember: async (memberId: string) => {
        await deleteMutation.mutateAsync(memberId);
      },
    }),
    [refetch, deleteMutation]
  );

  /* --------------------------------- KPI --------------------------------- */
  const kpis = [
    {
      label: "Total Users",
      value: state.data?.stats?.users ?? 0,
      icon: <People sx={{ fontSize: 22 }} />,
      color: theme.palette.kpi.indigo,
    },
    {
      label: "Vehicles",
      value: state.data?.stats?.vehicles ?? 0,
      icon: <DirectionsCar sx={{ fontSize: 22 }} />,
      color: theme.palette.kpi.sky,
    },
    {
      label: "Drivers",
      value: state.data?.stats?.drivers ?? 0,
      icon: <Badge sx={{ fontSize: 22 }} />,
      color: theme.palette.kpi.emerald,
    },
    {
      label: "Warehouses",
      value: state.data?.stats?.warehouses ?? 0,
      icon: <Warehouse sx={{ fontSize: 22 }} />,
      color: theme.palette.kpi.amber,
    },
    {
      label: "Customers",
      value: state.data?.stats?.customers ?? 0,
      icon: <Groups sx={{ fontSize: 22 }} />,
      color: theme.palette.kpi.pink,
    },
    {
      label: "Shipments",
      value: state.data?.stats?.shipments ?? 0,
      icon: <LocalShipping sx={{ fontSize: 22 }} />,
      color: theme.palette.kpi.violet,
    },
  ];

  return (
    <Box position="relative" p={{ xs: 2, md: 4 }} width="100%">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography
            sx={{ fontSize: 24, fontWeight: 700, color: "text.primary" }}
          >
            Company
          </Typography>
          <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
            Overview of your organisation, resources, and team members.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddMemberOpen(true)}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Add Member
        </Button>
      </Stack>

      {state.error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {state.error}
        </Alert>
      )}

      <Stack spacing={3}>
        <KpiCards kpis={kpis} loading={state.loading} />
        <CompanyInfoCard props={{ state, actions }} />
        <CompanyMembersTable props={{ state, actions }} />
      </Stack>

      <AddCompanyMemberDialog
        open={addMemberOpen}
        onClose={() => setAddMemberOpen(false)}
        onSuccess={actions.refreshAll}
      />
    </Box>
  );
}
