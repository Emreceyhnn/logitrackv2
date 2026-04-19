import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCustomers,
  deleteCustomer,
  getCustomersWithDashboardData,
} from "@/app/lib/controllers/customer";
import { toast } from "sonner";

export const customerKeys = {
  all: ["customers"] as const,
  lists: () => [...customerKeys.all, "list"] as const,
  details: (id: string) => [...customerKeys.all, "detail", id] as const,
  dashboard: () => [...customerKeys.all, "dashboard"] as const,
  dashboardWithFilters: (page: number, pageSize: number, search?: string) =>
    [...customerKeys.dashboard(), { page, pageSize, search }] as const,
};

export function useCustomers() {
  return useQuery({
    queryKey: customerKeys.lists(),
    queryFn: () => getCustomers(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCustomersWithDashboard(
  page: number = 1,
  pageSize: number = 10,
  search?: string
) {
  return useQuery({
    queryKey: customerKeys.dashboardWithFilters(page, pageSize, search),
    queryFn: () => getCustomersWithDashboardData(page, pageSize, search),
    staleTime: 1000 * 60 * 5,
  });
}


export function useCustomerMutations() {
  const queryClient = useQueryClient();

  const handleSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: customerKeys.all });
    toast.success(message);
  };

  const handleError = (message: string, error: Error | unknown) => {
    console.error(message, error);
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
