/**
 * Overview Page — Hybrid SSR + CSR
 */

import type { Metadata } from "next";
import { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getOverviewDashboardData } from "@/app/lib/controllers/overview";
import { overviewKeys } from "@/app/lib/query-keys/overview.keys";
import OverviewContent from "./components/OverviewContent";

export const metadata: Metadata = {
  title: "Overview | LogiTrack",
  description:
    "Real-time logistics dashboard — active shipments, fleet status, warehouse capacity and KPIs at a glance.",
};

function OverviewPageSkeleton() {
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

export default async function OverviewPage() {

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
      },
    },
  });

  try {
    await queryClient.prefetchQuery({
      queryKey: overviewKeys.dashboard(),
      queryFn: () => getOverviewDashboardData(),
      staleTime: 1000 * 60 * 5,
    });
  } catch (error) {
    console.error("[OverviewPage SSR] prefetch failed:", error);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<OverviewPageSkeleton />}>
        <OverviewContent />
      </Suspense>
    </HydrationBoundary>
  );
}
