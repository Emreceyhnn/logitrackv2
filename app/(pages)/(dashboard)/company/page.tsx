"use client";

import { Box, Stack, Typography, Alert } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { getCompanyProfile } from "@/app/lib/controllers/company";
import { getAuthenticatedUser } from "@/app/lib/auth-middleware";
import {
  CompanyPageState,
  CompanyPageActions,
} from "@/app/lib/type/company";
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

  const actions: CompanyPageActions = {
    fetchData: useCallback(async () => {
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
            error: "No company associated with this account. Please create or join a company.",
          }));
          return;
        }
        const result = await getCompanyProfile();
        setState({
          data: {
            profile: result.profile as any,
            stats: result.stats as any,
            members: result.members as any,
          },
          loading: false,
          error: null,
        });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to load company data.";
        setState((prev) => ({ ...prev, data: null, loading: false, error: message }));
      }
    }, []),

    refreshAll: useCallback(async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      // We can use actions.fetchData here but for clarity calling the same logic
      try {
        const result = await getCompanyProfile();
        setState({
          data: {
            profile: result.profile as any,
            stats: result.stats as any,
            members: result.members as any,
          },
          loading: false,
          error: null,
        });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to refresh company data.";
        setState((prev) => ({ ...prev, loading: false, error: message }));
      }
    }, []),
  };

  useEffect(() => {
    actions.fetchData();
  }, [actions.fetchData]);

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
        <CompanyKpiCard props={{ state, actions }} />
        <CompanyInfoCard props={{ state, actions }} />
        <CompanyMembersTable props={{ state, actions }} />
      </Stack>

      <CreateCompanyDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={actions.refreshAll}
      />
    </Box>
  );
}
