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
    pendingOrders?: number; // Có thể có hoặc không
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
  viewStats: IDailyViewStat[]; // Mảng dữ liệu biểu đồ
  totals: {
    views: number; // Tổng số view
  };
}

// Item cho Top Page/Product
export interface ITopPageStat {
  path: string;
  title: string;
  views: number;
}

// Item cho Source/Device/Location (Generic)
export interface ICommonStat {
  name: string; // Tên nguồn (Google, Facebook) hoặc Tên thiết bị (Mobile, Desktop)
  value: number; // Số lượng session hoặc user
}

// Response tổng
export interface ISummaryStatsResponse {
  topPages: ITopPageStat[];
  topSources: ICommonStat[];
  topDevices: ICommonStat[];
  topLocations: ICommonStat[];
}
