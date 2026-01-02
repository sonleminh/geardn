import { Module } from '@nestjs/common';
import { StatisticsController } from './statistic.controller';
import { StatisticsService } from './statistic.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AnalyticsModule } from '../google-analytics/analytics.module';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService],
  imports: [PrismaModule, AnalyticsModule],
  exports: [StatisticsService],
})
export class StatisticsModule {}
