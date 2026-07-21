import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  getCompanyProfile,
  removeCompanyUser,
} from "@/app/lib/controllers/company";
import {
  getPendingJoinRequests,
  acceptJoinRequest,
  rejectJoinRequest,
} from "@/app/lib/controllers/joinRequests";
import { toast } from "sonner";

import { companyKeys } from "@/app/lib/query-keys/company.keys";
import { logger } from "@/app/lib/logger";


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
    placeholderData: keepPreviousData,
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
    logger.error(message, error);
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

export function usePendingJoinRequests() {
  return useQuery({
    queryKey: companyKeys.joinRequests(),
    queryFn: () => getPendingJoinRequests(),
    staleTime: 1000 * 30,
  });
}

export function useJoinRequestMutations() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: companyKeys.joinRequests() });

  const accept = useMutation({
    mutationFn: (params: {
      id: string;
      roleName: string;
      driverData?: {
        employeeId: string;
        phone: string;
        licenseType?: string;
        licenseNumber?: string;
        licenseExpiry?: string;
      };
    }) => acceptJoinRequest(params.id, params.roleName, params.driverData),
    onSuccess: () => {
      invalidate();
      queryClient.invalidateQueries({ queryKey: companyKeys.all });
    },
  });

  const reject = useMutation({
    mutationFn: (id: string) => rejectJoinRequest(id),
    onSuccess: invalidate,
  });

  return { accept, reject };
}
