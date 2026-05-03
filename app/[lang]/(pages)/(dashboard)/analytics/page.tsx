/**
 * Analytics Page — Hybrid SSR + CSR
 */

import { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAuthenticatedUser } from "@/app/lib/auth-middleware";
import { getAnalyticsDashboardData } from "@/app/lib/controllers/analytics";
import { analyticsKeys } from "@/app/lib/query-keys/analytics.keys";
import AnalyticsContent from "./components/AnalyticsContent";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

function AnalyticsPageSkeleton() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="100%"
      minHeight="60vh"
    >
      <CircularProgress size={36} />
    </Box>
  );
}

export default async function AnalyticsPage() {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect("/");
  }

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 10,
      },
    },
  });

  try {
    await queryClient.prefetchQuery({
      queryKey: analyticsKeys.dashboard(),
      queryFn: () => getAnalyticsDashboardData(),
      staleTime: 1000 * 60 * 10,
    });
  } catch (error) {
    console.error("[AnalyticsPage SSR] prefetch failed:", error);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<AnalyticsPageSkeleton />}>
        <AnalyticsContent />
      </Suspense>
    </HydrationBoundary>
  );
}
