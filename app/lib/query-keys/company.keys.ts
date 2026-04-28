export const companyKeys = {
  all: ["company"] as const,
  profile: () => [...companyKeys.all, "profile"] as const,
  dashboardWithFilters: (filters: { page: number; pageSize: number; search?: string }) =>
    [...companyKeys.all, "dashboard", filters] as const,
};
