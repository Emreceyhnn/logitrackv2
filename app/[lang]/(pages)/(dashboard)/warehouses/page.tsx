/**
 * Warehouses Page — Hybrid SSR + CSR
 */

import { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAuthenticatedUser } from "@/app/lib/auth-middleware";
import { getWarehousesWithDashboardData } from "@/app/lib/controllers/warehouse";
import { warehouseKeys } from "@/app/lib/query-keys/warehouse.keys";
import WarehouseContent from "./components/WarehouseContent";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

function WarehousePageSkeleton() {
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

export default async function WarehousePage() {
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

  const clientPage = 1;
  const serverPage = clientPage;
  const pageSize = 10;

  try {
    await queryClient.prefetchQuery({
      queryKey: warehouseKeys.dashboardWithFilters(clientPage, pageSize),
      queryFn: () => getWarehousesWithDashboardData(serverPage, pageSize),
      staleTime: 1000 * 60 * 5,
    });
  } catch (error) {
    console.error("[WarehousePage SSR] prefetch failed:", error);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<WarehousePageSkeleton />}>
        <WarehouseContent />
      </Suspense>
    </HydrationBoundary>
  );
}
