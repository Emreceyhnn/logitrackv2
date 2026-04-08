// ─── Settings Page Domain Types ───────────────────────────────────────────

export type AppearanceMode = "light" | "dark" | "system";
export type LanguageCode = "EN" | "TR";
export type CurrencyCode = "USD" | "EUR" | "TRY" | "GBP";

export interface RegionalSettings {
  language: LanguageCode;
  currency: CurrencyCode;
  timezone: string;
  dateFormat: string;
}

export interface NotificationSettings {
  emailShipmentUpdates: boolean;
  emailMaintenanceAlerts: boolean;
  emailWeeklyReports: boolean;
  pushNewAssignments: boolean;
  pushDelayAlerts: boolean;
}

export interface AppearanceSettings {
  mode: AppearanceMode;
}

export interface SettingsPageState {
  activeTab: number;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  regional: RegionalSettings;
  notifications: NotificationSettings;
  appearance: AppearanceSettings;
}

export interface SettingsPageActions {
  setActiveTab: (tab: number) => void;
  updateRegional: (data: Partial<RegionalSettings>) => void;
  updateNotifications: (data: Partial<NotificationSettings>) => void;
  updateAppearance: (data: Partial<AppearanceSettings>) => void;
  saveRegional: () => Promise<void>;
  saveNotifications: () => Promise<void>;
}
