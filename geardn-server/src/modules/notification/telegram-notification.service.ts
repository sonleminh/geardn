import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { Order, OrderItem } from '@prisma/client';
import { OrderEntity } from '../order/entities/order.entity';

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
  async handleOrderCreatedEvent(order: OrderEntity & { items: OrderItem[] }) {
    const message = `
🚨 <b>New Order Received!</b> 🚨

🆔 <b>Order ID:</b> #${order.id}
👤 <b>Customer:</b> ${order.fullName}
💰 <b>Total:</b> $${order.totalPrice}
📦 <b>Items:</b> ${order.items.map((item) => `${item.productName} (${item.quantity})`).join(', ')}

<i>Check dashboard for details.</i>
    `;

    try {
      await this.bot.telegram.sendMessage(this.adminId, message, {
        parse_mode: 'HTML',
      });
      this.logger.log(`Notification sent for Order #${order.id}`);
    } catch (error) {
      this.logger.error('Failed to send Telegram notification', error);
    }
  }
}
