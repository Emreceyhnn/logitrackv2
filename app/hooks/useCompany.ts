import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCompanyProfile,
  removeCompanyUser,
} from "@/app/lib/controllers/company";
import { toast } from "sonner";

import { companyKeys } from "@/app/lib/query-keys/company.keys";

async function fetchCompanyDashboard(filters: {
  page: number;
  pageSize: number;
  search?: string;
}) {
  const params = new URLSearchParams();
  params.set("page", String(filters.page));
  params.set("pageSize", String(filters.pageSize));
  if (filters.search) params.set("search", filters.search);

  const res = await fetch(`/api/company/dashboard?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`[useCompanyWithDashboard] fetch failed: ${res.status}`);
  }

  return res.json();
}

export function useCompanyWithDashboard(filters: {
  page: number;
  pageSize: number;
  search?: string;
}) {
  return useQuery({
    queryKey: companyKeys.dashboardWithFilters(filters),
    queryFn: () => fetchCompanyDashboard(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCompanyProfile() {
  return useQuery({
    queryKey: companyKeys.profile(),
    queryFn: () => getCompanyProfile(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCompanyMutations() {
  const queryClient = useQueryClient();

  const handleSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: companyKeys.all });
    toast.success(message);
  };

  const handleError = (message: string, error: Error | unknown) => {
    console.error(message, error);
    toast.error((error as Error)?.message || message);
  };

  const deleteMemberMutation = useMutation({
    mutationFn: (memberId: string) => removeCompanyUser(memberId),
    onSuccess: () => handleSuccess("Member removed from company successfully"),
    onError: (error: Error) => handleError("Failed to remove member", error),
  });

  return {
    deleteMember: deleteMemberMutation,
  };
}
