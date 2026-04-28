/**
 * Overview Page — Hybrid SSR + CSR
 */

import { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAuthenticatedUser } from "@/app/lib/auth-middleware";
import { getOverviewDashboardData } from "@/app/lib/controllers/overview";
import { overviewKeys } from "@/app/lib/query-keys/overview.keys";
import OverviewContent from "./components/OverviewContent";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

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
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect("/");
  }

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
