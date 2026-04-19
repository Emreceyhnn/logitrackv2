import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCompanyProfile,
  getCompanyWithDashboardData,
  removeCompanyUser,
} from "@/app/lib/controllers/company";
import { toast } from "sonner";

export const companyKeys = {
  all: ["company"] as const,
  profile: () => [...companyKeys.all, "profile"] as const,
  dashboardWithFilters: (filters: { page: number; pageSize: number; search?: string }) =>
    [...companyKeys.all, "dashboard", filters] as const,
};

export function useCompanyWithDashboard(filters: {
  page: number;
  pageSize: number;
  search?: string;
}) {
  return useQuery({
    queryKey: companyKeys.dashboardWithFilters(filters),
    queryFn: () => getCompanyWithDashboardData(filters),
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
