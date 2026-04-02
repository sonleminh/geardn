import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CartModule } from '../cart/cart.module';
import { ExportLogModule } from '../export-log/export-log.module';
import { EmailModule } from '../email/email.module';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService, PrismaService],
  imports: [CartModule, ExportLogModule, EmailModule, LoggerModule],
})
export class OrdersModule {}
