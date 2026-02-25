"use client";

import { Box, Stack, Typography, Alert } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { getCompanyProfile } from "@/app/lib/controllers/company";
import { getAuthenticatedUser } from "@/app/lib/auth-middleware";
import { CompanyPageState } from "@/app/lib/type/company";
import CompanyKpiCard from "@/app/components/dashboard/company/companyKpiCard";
import CompanyInfoCard from "@/app/components/dashboard/company/companyInfoCard";
import CompanyMembersTable from "@/app/components/dashboard/company/companyMembersTable";

export default function CompanyPage() {
  const [state, setState] = useState<CompanyPageState>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
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
    fetchData();
  }, [fetchData]);

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
    </Box>
  );
}
