"use client";

import {
  Box,
  Stack,
  Typography,
  Alert,
  Button,
  Divider,
  useTheme,
} from "@mui/material";
import CustomCard from "@/app/components/cards/card";
import { useEffect, useState, useMemo } from "react";
import AddIcon from "@mui/icons-material/Add";
import { getCompanyProfile } from "@/app/lib/controllers/company";
import { getAuthenticatedUser } from "@/app/lib/auth-middleware";
import {
  CompanyPageState,
  CompanyPageActions,
  CompanyProfile,
  CompanyStats,
  CompanyMember,
} from "@/app/lib/type/company";
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

  /* --------------------------------- STATES --------------------------------- */
  const [state, setState] = useState<CompanyPageState>({
    data: null,
    loading: true,
    error: null,
  });
  const [addMemberOpen, setAddMemberOpen] = useState(false);

  /* --------------------------------- ACTIONS -------------------------------- */
  const actions: CompanyPageActions = useMemo(
    () => ({
      fetchData: async () => {
        try {
          const user = await getAuthenticatedUser();
          if (!user) {
            setState((prev) => ({
              ...prev,
              data: null,
              loading: false,
              error: "Unauthorized. Please log in.",
            }));
            return;
          }
          if (!user.companyId) {
            setState((prev) => ({
              ...prev,
              data: null,
              loading: false,
              error:
                "No company associated with this account. Please create or join a company.",
            }));
            return;
          }
          const result = await getCompanyProfile();
          setState({
            data: {
              profile: result.profile as CompanyProfile,
              stats: result.stats as CompanyStats,
              members: result.members as CompanyMember[],
            },
            loading: false,
            error: null,
          });
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "Failed to load company data.";
          setState((prev) => ({
            ...prev,
            data: null,
            loading: false,
            error: message,
          }));
        }
      },

      refreshAll: async () => {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        try {
          const result = await getCompanyProfile();
          setState({
            data: {
              profile: result.profile as CompanyProfile,
              stats: result.stats as CompanyStats,
              members: result.members as CompanyMember[],
            },
            loading: false,
            error: null,
          });
        } catch (err: unknown) {
          const message =
            err instanceof Error
              ? err.message
              : "Failed to refresh company data.";
          setState((prev) => ({ ...prev, loading: false, error: message }));
        }
      },

      deleteMember: async (memberId: string) => {
        try {
          const { removeCompanyUser } =
            await import("@/app/lib/controllers/company");
          await removeCompanyUser(memberId);
          setState((prev) => {
            if (!prev.data) return prev;
            return {
              ...prev,
              data: {
                ...prev.data,
                members: prev.data.members.filter((m) => m.id !== memberId),
              },
            };
          });
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "Failed to delete member.";
          setState((prev) => ({ ...prev, error: message }));
          throw err;
        }
      },
    }),
    []
  );

  /* -------------------------------- LIFECYCLE ------------------------------- */

  useEffect(() => {
    actions.fetchData();
  }, [actions]);

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
        <CustomCard sx={{ padding: "0 0 6px 0" }}>
          <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
            Team Members
          </Typography>
          <Divider />
          <CompanyMembersTable props={{ state, actions }} />
        </CustomCard>
      </Stack>

      <AddCompanyMemberDialog
        open={addMemberOpen}
        onClose={() => setAddMemberOpen(false)}
      />
    </Box>
  );
}
