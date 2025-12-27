import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { Order, OrderItem } from '@prisma/client';
import { OrderEntity } from '../order/entities/order.entity';
import { formatPrice } from '../../utils/format-price';

@Injectable()
export class TelegramNotificationService {
  private readonly logger = new Logger(TelegramNotificationService.name);
  private readonly adminId: string;

  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly configService: ConfigService,
  ) {
    this.adminId = this.configService.get<string>('TELEGRAM_ADMIN_ID');
  }

  @OnEvent('order.created')
  async handleOrderCreatedEvent(
    order?: OrderEntity & { orderItems: OrderItem[] },
  ) {
    const message = `
🚨 <b>New Order Received!</b> 🚨

ℹ️ <b>Order ID:</b> ${order?.orderCode}
👤 <b>Customer:</b> ${order?.fullName}
👤 <b>Address:</b> ${order?.shipment?.address}
👤 <b>Phone:</b> ${order?.cancelReason}
💰 <b>Total:</b> ${formatPrice(Number(order?.totalPrice))}
📦 <b>Items:</b>
${order?.orderItems?.map((item) => `  • ${item?.productName} (x${item?.quantity})`).join('\n')}

<b>Dashboard:</b> <a href="https://admin.geardn.id.vn">admin.geardn.id.vn</a>

    `;
    try {
      await this.bot.telegram.sendMessage(this.adminId, message, {
        parse_mode: 'HTML',
      });
      this.logger.log(`Notification sent for Order #${order?.orderCode}`);
    } catch (error) {
      this.logger.error('Failed to send Telegram notification', error);
    }
  }
}
