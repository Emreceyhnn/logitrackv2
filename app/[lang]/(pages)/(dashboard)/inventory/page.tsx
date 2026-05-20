/**
 * Inventory Page — Hybrid SSR + CSR
 */

import { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getInventoryWithDashboardData } from "@/app/lib/controllers/inventory";
import { inventoryKeys } from "@/app/lib/query-keys/inventory.keys";
import InventoryContent from "./components/InventoryContent";

function InventoryPageSkeleton() {
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

export default async function InventoryPage() {

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
  const warehouseId = undefined;
  const search = undefined;
  const sortBy = "name";
  const sortOrder = "asc";
  const status = undefined;

  try {
    await queryClient.prefetchQuery({
      queryKey: inventoryKeys.dashboardWithFilters(
        clientPage,
        pageSize,
        warehouseId,
        search,
        sortBy,
        sortOrder,
        status
      ),
      queryFn: () =>
        getInventoryWithDashboardData(
          serverPage,
          pageSize,
          warehouseId,
          search,
          sortBy,
          sortOrder,
          status
        ),
      staleTime: 1000 * 60 * 5,
    });
  } catch (error) {
    console.error("[InventoryPage SSR] prefetch failed:", error);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<InventoryPageSkeleton />}>
        <InventoryContent />
      </Suspense>
    </HydrationBoundary>
  );
}
