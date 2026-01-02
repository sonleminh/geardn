import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  async getDashboardData() {
    return this.analyticsService.getDashboardStatistics();
  }

  @Get('realtime')
  async getRealtimeStats() {
    return this.analyticsService.getRealtimeStats();
  }

  @Get('top-pages')
  async getTopPages() {
    return this.analyticsService.getTopPages();
  }
}
