import { Injectable } from '@nestjs/common';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

@Injectable()
export class AnalyticsService {
  private analyticsDataClient: BetaAnalyticsDataClient;
  private propertyId = '517172052';

  constructor() {
    this.analyticsDataClient = new BetaAnalyticsDataClient({
      keyFilename: './ga4-credentials.json',
    });
  }

 async getDashboardStatistics() {
    // Chúng ta sẽ chạy song song 3 báo cáo để tiết kiệm thời gian
    const [realtime, basicStats, topPages, dailyTrend] = await Promise.all([
      // 1. Lấy số người đang online (Realtime)
      this.analyticsDataClient.runRealtimeReport({
        property: `properties/${this.propertyId}`,
        metrics: [{ name: 'activeUsers' }],
      }),

      // 2. Lấy tổng quan 7 ngày qua (Tổng user, view, session)
      this.analyticsDataClient.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate: '7daysAgo', endDate: 'yesterday' }], // Dùng yesterday để số liệu chốt chính xác
        metrics: [
            { name: 'activeUsers' },
            { name: 'screenPageViews' },
            { name: 'sessions' },
            { name: 'engagementRate' } // Tỷ lệ tương tác
        ],
      }),

      // 3. Lấy Top 5 trang được xem nhiều nhất
      this.analyticsDataClient.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate: '28daysAgo', endDate: 'yesterday' }],
        dimensions: [{ name: 'pageTitle' }, { name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
        orderBys: [{ desc: true, metric: { metricName: 'screenPageViews' } }],
        limit: 5,
      }),

      // 4. Lấy biểu đồ xu hướng theo ngày (để vẽ biểu đồ)
      this.analyticsDataClient.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate: '7daysAgo', endDate: 'yesterday' }],
        dimensions: [{ name: 'date' }], // Nhóm theo ngày (YYYYMMDD)
        metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
        orderBys: [{ desc: false, dimension: { dimensionName: 'date' } }],
        }),
    ]);

    // --- XỬ LÝ DỮ LIỆU TRẢ VỀ CHO GỌN ---

    // 1. Realtime
    const activeUsersNow = realtime[0].rows?.[0]?.metricValues?.[0]?.value || '0';

    // 2. Basic Stats
    const statsRow = basicStats[0].rows?.[0];
    const summary = {
      users: statsRow?.metricValues?.[0]?.value || 0,
      views: statsRow?.metricValues?.[1]?.value || 0,
      sessions: statsRow?.metricValues?.[2]?.value || 0,
      engagementRate: parseFloat(statsRow?.metricValues?.[3]?.value || '0').toFixed(2),
    };

    // 3. Top Pages
    const topPagesList = topPages[0].rows?.map((row) => ({
      title: row.dimensionValues[0].value,
      path: row.dimensionValues[1].value,
      views: row.metricValues[0].value,
    })) || [];

    // 4. Daily Trend (Format lại ngày để FE dễ hiển thị)
    const trend = dailyTrend[0].rows?.map((row) => {
        // Format ngày từ 20231225 -> 25/12
        const rawDate = row.dimensionValues[0].value; 
        const formattedDate = `${rawDate.substring(6, 8)}/${rawDate.substring(4, 6)}`;
        return {
            date: formattedDate,
            users: row.metricValues[0].value,
            views: row.metricValues[1].value,
        };
    }) || [];

    return {
      data: {
        activeUsersNow,
        summary,
        topPagesList,
        trend,
      },
      message: 'Dashboard statistics fetched successfully',
    };
  }
  
async getRealtimeStats() {
  // CHÚ Ý: Dùng runRealtimeReport thay vì runReport
  const [response] = await this.analyticsDataClient.runRealtimeReport({
    property: `properties/${this.propertyId}`,
    metrics: [
      { name: 'activeUsers' }, // Số người đang online
    ],
    // Realtime không cần dateRanges vì nó mặc định là 30 phút qua
  });

  const activeUsers = response.rows?.[0]?.metricValues?.[0]?.value || 0;

  return {
    activeUsers: activeUsers
  };
}

  async getTopPages() {
      const [response] = await this.analyticsDataClient.runReport({
      property: `properties/${this.propertyId}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }], 
      orderBys: [
        {
            desc: true,
            metric: { metricName: 'screenPageViews' }
        }
      ],
      limit: 5, 
    });
    
    return response.rows.map(row => ({
        path: row.dimensionValues[0].value,
        views: row.metricValues[0].value
    }));
  }
}