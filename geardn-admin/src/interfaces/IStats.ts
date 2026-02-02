export interface IBaseDateStat {
  date: Date | string;
}

export interface IRevenueProfitDateStats {
  date: Date;
  revenue: number;
  profit: number;
}

export interface IRevenueProfitStats {
  revenueProfitStatsData: IRevenueProfitDateStats[];
  totals: {
    totalRevenue: number;
    totalProfit: number;
  };
}

export interface IRevenueProfitSummaryStats {
  totals: {
    totalRevenue: number;
    totalProfit: number;
  };
  growth: {
    revenuePercent: number;
    profitPercent: number;
  };
}

export interface IOrderDailyStat extends IBaseDateStat {
  orders: number;
}

export interface IOrderStatisticResponse {
  orderStats: IOrderDailyStat[];
  totals: {
    totalOrders: number;
    pendingOrders?: number;
  };
}

export interface IOrderSummaryStats {
  totals: {
    delivered: number;
    pending: number;
    canceled: number;
    canceledThisMonthCount: number;
    deliveredThisMonthCount: number;
    deliveredLastMonthCount: number;
  };
  rates: {
    cancellationRate: number;
    cancellationRateThisMonth: number;
  };
  growth: { delivered: number };
}

export interface IDailyViewStat extends IBaseDateStat {
  views: number;
}

export interface IViewStatisticResponse {
  viewStats: IDailyViewStat[];
  totals: {
    views: number;
  };
}

export interface ITopPageStat {
  path: string;
  title: string;
  views: number;
}

export interface ICommonStat {
  name: string;
  value: number;
}

export interface ISummaryStatsResponse {
  topPages: ITopPageStat[];
  topSources: ICommonStat[];
  topDevices: ICommonStat[];
  topLocations: ICommonStat[];
}
