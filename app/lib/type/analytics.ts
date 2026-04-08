export interface AnalyticsPerformance {
  onTimeRate: number;
  fleetUtilization: number;
  satisfaction: number;
  satisfactionCount: number;
}

export interface AnalyticsCosts {
  months: string[];
  fuel: number[];
  maintenance: number[];
  overhead: number[];
  distribution: {
    id: number;
    value: number;
    label: string;
  }[];
}

export interface AnalyticsForecast {
  weeks: string[];
  actuals: (number | null)[];
  predicted: (number | null)[];
}

export interface AnalyticsPageState {
  performance: AnalyticsPerformance;
  costs: AnalyticsCosts;
  forecast: AnalyticsForecast;
}

export interface AnalyticsPageProps {
  // Page props for Analytics
  [key: string]: unknown;
}

export interface AnalyticsPageActions {
  fetchData: () => Promise<void>;
}
