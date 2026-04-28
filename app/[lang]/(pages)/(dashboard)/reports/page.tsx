/**
 * Reports Page — Hybrid SSR + CSR
 */

import { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAuthenticatedUser } from "@/app/lib/auth-middleware";
import { getReportsDataAction } from "@/app/lib/controllers/reports";
import { reportsKeys } from "@/app/lib/query-keys/reports.keys";
import ReportsContent from "./components/ReportsContent";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

function ReportsPageSkeleton() {
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

export default async function ReportsPage() {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect("/");
  }

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 15,
      },
    },
  });

  try {
    await queryClient.prefetchQuery({
      queryKey: reportsKeys.dashboard(),
      queryFn: () => getReportsDataAction(),
      staleTime: 1000 * 60 * 15,
    });
  } catch (error) {
    console.error("[ReportsPage SSR] prefetch failed:", error);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<ReportsPageSkeleton />}>
        <ReportsContent />
      </Suspense>
    </HydrationBoundary>
  );
}
