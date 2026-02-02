export interface IDashboardStatistics {
  activeUsersNow: number;
  summary: {
    users: number;
    sessions: number;
    views: number;
    engagementRate: string;
  };
}
