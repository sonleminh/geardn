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
  private readonly botToken: string;

  // constructor(
  //   @InjectBot() private readonly bot: Telegraf<Context>,
  //   private readonly configService: ConfigService,
  // ) {
  //   this.adminId = this.configService.get<string>('TELEGRAM_ADMIN_ID');
  // }

  constructor(private readonly configService: ConfigService) {
    this.adminId = this.configService.get<string>('TELEGRAM_ADMIN_ID');
    this.botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
  }

  @OnEvent('order.created')
  async handleOrderCreatedEvent(
    order?: OrderEntity & { orderItems: OrderItem[] },
  ) {
    const message = `
🚨 <b>New Order Received!</b> 🚨

ℹ️ <b>Order ID:</b> ${order?.orderCode}
👤 <b>Customer:</b> ${order?.fullName}
🏠 <b>Address:</b> ${order?.shipment?.address}
📞 <b>Phone:</b> ${order?.phoneNumber}
💰 <b>Total:</b> ${formatPrice(Number(order?.totalPrice))}
📦 <b>Items:</b>
${order?.orderItems?.map((item) => `  • ${item?.productName} (x${item?.quantity})`).join('\n')}

<b>Dashboard:</b> <a href="https://admin.geardn.id.vn">admin.geardn.id.vn</a>

    `;
    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.adminId,
          text: message,
          parse_mode: 'HTML',
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Telegram API responded with status ${response.status}`,
        );
      }

      this.logger.log(`Notification sent for Order #${order?.orderCode}`);
    } catch (error) {
      // This will now safely catch the ETIMEDOUT without crashing the server
      this.logger.error('Failed to send Telegram notification', error.message);
    }
  }
}
