"use client";

import { Box, Stack, Typography, Alert } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { getCompanyProfile } from "@/app/lib/controllers/company";
import { getAuthenticatedUser } from "@/app/lib/auth-middleware";
import { CompanyPageState } from "@/app/lib/type/company";
import CompanyKpiCard from "@/app/components/dashboard/company/companyKpiCard";
import CompanyInfoCard from "@/app/components/dashboard/company/companyInfoCard";
import CompanyMembersTable from "@/app/components/dashboard/company/companyMembersTable";
import CreateCompanyDialog from "@/app/components/dialogs/company/CreateCompanyDialog";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";

export default function CompanyPage() {
  const [state, setState] = useState<CompanyPageState>({
    data: null,
    loading: true,
    error: null,
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const user = await getAuthenticatedUser();
      if (!user) {
        setState({
          data: null,
          loading: false,
          error: "Unauthorized. Please log in.",
        });
        return;
      }
      if (!user.companyId) {
        setState({
          data: null,
          loading: false,
          error:
            "No company associated with this account. Please create or join a company.",
        });
        return;
      }
      const result = await getCompanyProfile(user.companyId, user.id);
      setState({
        data: {
          profile: result.profile,
          stats: result.stats,
          members: result.members,
        },
        loading: false,
        error: null,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load company data.";
      setState({ data: null, loading: false, error: message });
    }
  }, []);

  useEffect(() => {
    // fetchData is async, and we already initialized state with loading: true.
    // The initial fetch is safe.

    fetchData();
  }, [fetchData]);

  const handleManualRefresh = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    await fetchData();
  };

  return (
    <Box position="relative" p={4} width="100%">
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
          onClick={() => setIsCreateDialogOpen(true)}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            boxShadow: (theme) => `0 8px 20px ${theme.palette.primary.main}33`,
          }}
        >
          Add Company
        </Button>
      </Stack>

      {state.error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {state.error}
        </Alert>
      )}

      <Stack spacing={3}>
        <CompanyKpiCard data={state.data?.stats ?? null} />

        <CompanyInfoCard profile={state.data?.profile ?? null} />

        <CompanyMembersTable
          members={state.data?.members ?? []}
          loading={state.loading}
        />
      </Stack>

      <CreateCompanyDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={handleManualRefresh}
      />
    </Box>
  );
}
