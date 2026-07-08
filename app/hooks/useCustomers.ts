import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  deleteCustomer,
} from "@/app/lib/controllers/customer";
import { toast } from "sonner";

import { customerKeys } from "@/app/lib/query-keys/customer.keys";
import { CustomerWithRelations } from "@/app/lib/type/customer";
import { logger } from "@/app/lib/logger";


async function fetchCustomers(): Promise<CustomerWithRelations[]> {
  const res = await fetch(`/api/customers`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`[useCustomers] fetch failed: ${res.status}`);
  }

  return res.json();
}

export function useCustomers() {
  return useQuery({
    queryKey: customerKeys.lists(),
    queryFn: () => fetchCustomers(),
    staleTime: 1000 * 60 * 5,
  });
}

async function fetchCustomerDashboard(
  page: number,
  pageSize: number,
  search?: string
): Promise<{
  customers: CustomerWithRelations[];
  totalCount: number;
  stats: {
    totalCustomers: number;
    activeCustomers: number;
    totalShipments: number;
  };
  statsTrends?: {
    totalCustomers?: { value: number; isUp: boolean };
  };
}> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));
  if (search) params.set("search", search);

  const res = await fetch(`/api/customers/dashboard?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`[useCustomersWithDashboard] fetch failed: ${res.status}`);
  }

  return res.json();
}

export function useCustomersWithDashboard(
  page: number = 1,
  pageSize: number = 10,
  search?: string
) {
  return useQuery({
    queryKey: customerKeys.dashboardWithFilters(page, pageSize, search),
    queryFn: () => fetchCustomerDashboard(page, pageSize, search),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}


export function useCustomerMutations() {
  const queryClient = useQueryClient();

  const handleSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: customerKeys.all });
    toast.success(message);
  };

  const handleError = (message: string, error: Error | unknown) => {
    logger.error(message, error);
    toast.error((error as Error)?.message || message);
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCustomer(id),
    onSuccess: () => handleSuccess("Customer deleted successfully"),
    onError: (error: Error) => handleError("Failed to delete customer", error),
  });

  return {
    deleteCustomer: deleteMutation,
  };
}
