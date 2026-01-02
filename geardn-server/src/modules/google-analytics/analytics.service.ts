import { Injectable } from '@nestjs/common';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { eachDayOfInterval, format, parseISO } from 'date-fns';

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
          { name: 'engagementRate' }, // Tỷ lệ tương tác
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
    const activeUsersNow =
      realtime[0].rows?.[0]?.metricValues?.[0]?.value || '0';

    // 2. Basic Stats
    const statsRow = basicStats[0].rows?.[0];
    const summary = {
      users: statsRow?.metricValues?.[0]?.value || 0,
      views: statsRow?.metricValues?.[1]?.value || 0,
      sessions: statsRow?.metricValues?.[2]?.value || 0,
      engagementRate: parseFloat(
        statsRow?.metricValues?.[3]?.value || '0',
      ).toFixed(2),
    };

    // 3. Top Pages
    const topPagesList =
      topPages[0].rows?.map((row) => ({
        title: row.dimensionValues[0].value,
        path: row.dimensionValues[1].value,
        views: row.metricValues[0].value,
      })) || [];

    // 4. Daily Trend (Format lại ngày để FE dễ hiển thị)
    const trend =
      dailyTrend[0].rows?.map((row) => {
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
      activeUsers: activeUsers,
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
          metric: { metricName: 'screenPageViews' },
        },
      ],
      limit: 5,
    });

    return response.rows.map((row) => ({
      path: row.dimensionValues[0].value,
      views: row.metricValues[0].value,
    }));
  }

  async getDailyViewStats(params: { fromDate?: string; toDate?: string }) {
    // 1. Xử lý ngày tháng cho đúng chuẩn GA4 (YYYY-MM-DD)
    // Nếu không truyền date thì mặc định lấy 7 ngày qua
    const startDate = params.fromDate
      ? params.fromDate.split('T')[0] // Lấy phần YYYY-MM-DD
      : '7daysAgo';

    const endDate = params.toDate ? params.toDate.split('T')[0] : 'today';

    // 2. Gọi GA4
    const [response] = await this.analyticsDataClient.runReport({
      property: `properties/${this.propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'date' }], // GA4 trả về format YYYYMMDD
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    });

    // 3. Map dữ liệu từ GA4 vào một Map để dễ tra cứu
    const dataMap = new Map<string, number>();
    response.rows?.forEach((row) => {
      // row.dimensionValues[0].value là chuỗi "20251226"
      // Cần convert sang format YYYY-MM-DD để khớp với key khi loop
      const gaDate = row.dimensionValues[0].value;
      const formattedGaDate = `${gaDate.slice(0, 4)}-${gaDate.slice(4, 6)}-${gaDate.slice(6, 8)}`;
      dataMap.set(formattedGaDate, Number(row.metricValues[0].value));
    });

    // 4. Tạo mảng đầy đủ các ngày trong khoảng thời gian (Fill 0 view)
    // Nếu dùng '7daysAgo' thì cần tính toán lại ngày start thực tế cho loop,
    // nhưng để đơn giản ta giả sử user luôn truyền date hoặc ta tính date mặc định ở bước 1 bằng JS date.

    // Để an toàn, ta dùng date-fns để tạo range.
    // Nếu params null, ta tự lấy ngày hiện tại lùi lại.
    const start = params.fromDate
      ? parseISO(params.fromDate)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const end = params.toDate ? parseISO(params.toDate) : new Date();

    const allDays = eachDayOfInterval({ start, end });

    let totalViews = 0;

    const viewStats = allDays.map((dateObj) => {
      const dateKey = format(dateObj, 'yyyy-MM-dd'); // Key để tìm trong Map
      const views = dataMap.get(dateKey) || 0; // Nếu không có trong Map (GA4 ko trả về) thì là 0

      totalViews += views;

      return {
        date: dateObj.toISOString(), // Trả về ISO cho Frontend
        views: views,
      };
    });

    return {
      data: {
        viewStats,
        totals: {
          views: totalViews,
        },
      },
    };
  }

  async getSummaryStats(dateParams: { fromDate?: string; toDate?: string }) {
    // 1. Xử lý ngày tháng (như method trước)
    const startDate = dateParams.fromDate
      ? dateParams.fromDate.split('T')[0]
      : '28daysAgo';
    const endDate = dateParams.toDate
      ? dateParams.toDate.split('T')[0]
      : 'today';
    const dateRanges = [{ startDate, endDate }];

    // 2. Chạy song song 4 reports
    const [topPagesReport, sourceReport, deviceReport, locationReport] =
      await Promise.all([
        // A. Top 5 Trang được xem nhiều nhất
        this.analyticsDataClient.runReport({
          property: `properties/${this.propertyId}`,
          dateRanges,
          dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
          metrics: [{ name: 'screenPageViews' }],
          orderBys: [{ desc: true, metric: { metricName: 'screenPageViews' } }],
          limit: 5,
        }),

        // B. Top 5 Nguồn truy cập (Session Source)
        this.analyticsDataClient.runReport({
          property: `properties/${this.propertyId}`,
          dateRanges,
          dimensions: [{ name: 'sessionSource' }],
          metrics: [{ name: 'sessions' }],
          orderBys: [{ desc: true, metric: { metricName: 'sessions' } }],
          limit: 5,
        }),

        // C. Tỷ lệ thiết bị (Mobile/Desktop)
        this.analyticsDataClient.runReport({
          property: `properties/${this.propertyId}`,
          dateRanges,
          dimensions: [{ name: 'deviceCategory' }],
          metrics: [{ name: 'activeUsers' }],
          orderBys: [{ desc: true, metric: { metricName: 'activeUsers' } }],
        }),

        // D. Top 5 Tỉnh/Thành phố
        this.analyticsDataClient.runReport({
          property: `properties/${this.propertyId}`,
          dateRanges,
          dimensions: [{ name: 'city' }],
          metrics: [{ name: 'activeUsers' }],
          orderBys: [{ desc: true, metric: { metricName: 'activeUsers' } }],
          limit: 5,
        }),
      ]);

    // 3. Format dữ liệu trả về
    return {
      topPages: this.formatReportData(topPagesReport[0], (row) => ({
        path: row.dimensionValues[0].value,
        title: row.dimensionValues[1].value,
        views: Number(row.metricValues[0].value),
      })),

      topSources: this.formatReportData(sourceReport[0], (row) => ({
        name: row.dimensionValues[0].value, // google, facebook, direct...
        value: Number(row.metricValues[0].value),
      })),

      topDevices: this.formatReportData(deviceReport[0], (row) => ({
        name: row.dimensionValues[0].value, // mobile, desktop, tablet
        value: Number(row.metricValues[0].value),
      })),

      topLocations: this.formatReportData(locationReport[0], (row) => ({
        name: row.dimensionValues[0].value, // Hanoi, Ho Chi Minh...
        value: Number(row.metricValues[0].value),
      })),
    };
  }

  // Helper function để map dữ liệu cho gọn code
  private formatReportData(report: any, mapFn: (row: any) => any) {
    return report.rows?.map(mapFn) || [];
  }
}
