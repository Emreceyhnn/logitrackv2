export interface CompanyProfile {
  id: string;
  name: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyStats {
  users: number;
  vehicles: number;
  drivers: number;
  warehouses: number;
  customers: number;
  shipments: number;
}

export interface CompanyMember {
  id: string;
  name: string;
  surname: string;
  email: string;
  avatarUrl: string | null;
  status: string;
  roleName: string | null;
  createdAt: string;
}

export interface CompanyPageData {
  profile: CompanyProfile;
  stats: CompanyStats;
  members: CompanyMember[];
}

export interface CompanyPageState {
  data: CompanyPageData | null;
  loading: boolean;
  error: string | null;
}

export interface CompanyPageActions {
  fetchData: () => Promise<void>;
  refreshAll: () => Promise<void>;
  deleteMember: (memberId: string) => Promise<void>;
}

export interface CompanyPageProps {
  state: CompanyPageState;
  actions: CompanyPageActions;
}
