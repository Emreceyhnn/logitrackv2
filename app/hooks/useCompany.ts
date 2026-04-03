import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCompanyProfile, removeCompanyUser } from "@/app/lib/controllers/company";
import { toast } from "sonner";
import { CompanyPageData } from "@/app/lib/type/company";

export const companyKeys = {
  all: ["company"] as const,
  profile: () => [...companyKeys.all, "profile"] as const,
};

export function useCompanyProfile() {
  return useQuery<CompanyPageData>({
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
