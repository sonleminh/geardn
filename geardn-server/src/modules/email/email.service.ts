import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { Order, OrderItem } from '@prisma/client';
import { formatPrice } from 'src/utils/format-price';

@Injectable()
export class EmailService {
  private readonly resend: Resend;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendNewOrderNotification(
    order?: Order & { orderItems: OrderItem[] },
  ): Promise<void> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: 'GearDN <orders@geardn.id.vn>',
        to: process.env.STORE_OWNER_EMAIL,
        subject: `💸 New Order #${order.id} — ${formatPrice(Number(order?.totalPrice))} 💸`,
        html: buildOrderEmailHtml(order),
      });

      if (error) {
        this.logger.error(`Resend returned error: ${JSON.stringify(error)}`);
        return;
      }

      this.logger.log(`Email sent, Resend ID: ${data?.id}`);
    } catch (err) {
      this.logger.error(`Exception sending email: ${err.message}`);
    }
  }
}

function buildOrderEmailHtml(
  order: Order & { orderItems: OrderItem[] },
): string {
  const shipment = order.shipment as {
    address?: string;
    ward?: string;
    district?: string;
    city?: string;
  } | null;

  const fullAddress =
    [shipment?.address, shipment?.ward, shipment?.district, shipment?.city]
      .filter(Boolean)
      .join(', ') || 'N/A';

  const itemRows = order.orderItems
    .map(
      (item) => `
      <tr style="border-bottom:1px solid #f4f4f5;">
        <td style="padding:12px 0;vertical-align:top;">
          <div style="font-size:13px;font-weight:500;color:#09090b;margin-bottom:2px;line-height:1.4;">${item.productName}</div>
          <div style="font-size:11px;color:#d4d4d8;">SKU: ${item.skuCode}</div>
        </td>
        <td style="padding:12px 0;text-align:center;font-size:13px;color:#71717a;vertical-align:top;">×${item.quantity}</td>
        <td style="padding:12px 0;text-align:right;font-size:13px;font-weight:500;color:#09090b;vertical-align:top;white-space:nowrap;">
          ${Number(item.sellingPrice).toLocaleString('vi-VN')}đ
        </td>
      </tr>`,
    )
    .join('');

  const orderDate = new Date().toLocaleString('vi-VN');
  const totalItems = order.orderItems.reduce((sum, i) => sum + i.quantity, 0);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<div style="padding:24px 16px;">
<div style="max-width:600px;margin:0 auto;">

  <!-- Header -->
  <div style="background:#ffffff;border-radius:16px 16px 0 0;padding:20px 24px 16px;text-align:center;border-bottom:1px solid #f4f4f5;">
    <div style="display:inline-block;background:#f4f4f5;border-radius:99px;padding:4px 12px;margin-bottom:10px;">
      <span style="font-size:11px;color:#71717a;letter-spacing:0.06em;">&#9679; NEW ORDER</span>
    </div>
    <div style="font-size:24px;font-weight:700;color:#09090b;margin-bottom:2px;letter-spacing:-0.5px;">${order.orderCode}</div>
    <div style="font-size:12px;color:#a1a1aa;">${orderDate}</div>
  </div>

  <!-- Stats Row -->
  <table style="width:100%;border-collapse:collapse;background:#ffffff;">
    <tr>
      <td style="padding:14px 16px;text-align:center;border-right:1px solid #f4f4f5;border-bottom:1px solid #f4f4f5;">
        <div style="font-size:10px;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">Total</div>
        <div style="font-size:16px;font-weight:700;color:#09090b;">${Number(order.totalPrice).toLocaleString('vi-VN')}đ</div>
      </td>
      <td style="padding:14px 16px;text-align:center;border-right:1px solid #f4f4f5;border-bottom:1px solid #f4f4f5;">
        <div style="font-size:10px;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">Items</div>
        <div style="font-size:16px;font-weight:700;color:#09090b;">${totalItems}</div>
      </td>
      <td style="padding:14px 16px;text-align:center;border-bottom:1px solid #f4f4f5;">
        <div style="font-size:10px;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;">Status</div>
        <div style="display:inline-block;background:#09090b;color:#ffffff;font-size:11px;font-weight:600;padding:3px 10px;border-radius:99px;letter-spacing:0.04em;">${order.status}</div>
      </td>
    </tr>
  </table>

  <!-- Customer -->
  <div style="background:#ffffff;padding:20px 24px;">
    <div style="font-size:10px;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:14px;">Customer</div>
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:5px 0;font-size:12px;color:#a1a1aa;width:80px;vertical-align:top;">Name</td>
        <td style="padding:5px 0;font-size:13px;color:#09090b;font-weight:500;">${order.fullName ?? 'N/A'}</td>
      </tr>
      <tr>
        <td style="padding:5px 0;font-size:12px;color:#a1a1aa;vertical-align:top;">Phone</td>
        <td style="padding:5px 0;font-size:13px;color:#09090b;">${order.phoneNumber ?? 'N/A'}</td>
      </tr>
      <tr>
        <td style="padding:5px 0;font-size:12px;color:#a1a1aa;vertical-align:top;">Address</td>
        <td style="padding:5px 0;font-size:13px;color:#09090b;line-height:1.5;">${fullAddress}</td>
      </tr>
    </table>
  </div>

  <!-- Divider -->
  <div style="height:1px;background:#f4f4f5;margin:0 24px;"></div>

  <!-- Items -->
  <div style="background:#ffffff;padding:20px 24px;">
    <div style="font-size:10px;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:14px;">Order items</div>
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr style="border-bottom:1px solid #f4f4f5;">
          <th style="padding:8px 0;text-align:left;font-size:11px;color:#a1a1aa;font-weight:400;">Product</th>
          <th style="padding:8px 0;text-align:center;font-size:11px;color:#a1a1aa;font-weight:400;width:40px;">Qty</th>
          <th style="padding:8px 0;text-align:right;font-size:11px;color:#a1a1aa;font-weight:400;width:100px;">Price</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>
    <table style="width:100%;border-collapse:collapse;margin-top:14px;padding-top:14px;border-top:1px solid #f4f4f5;">
      <tr>
        <td style="font-size:12px;color:#a1a1aa;">Total amount</td>
        <td style="text-align:right;font-size:18px;font-weight:700;color:#09090b;">${Number(order.totalPrice).toLocaleString('vi-VN')}đ</td>
      </tr>
    </table>
  </div>

  <!-- CTA -->
  <div style="background:#ffffff;padding:0 24px 24px;text-align:center;border-top:1px solid #f4f4f5;">
    <a href="https://admin.geardn.id.vn/order/confirm/${order.id}"
      style="display:inline-block;background:#09090b;color:#ffffff;padding:11px 28px;border-radius:8px;font-size:13px;font-weight:500;text-decoration:none;letter-spacing:0.01em;">
      View in dashboard &rarr;
    </a>
  </div>

  <!-- Footer -->
  <div style="border-radius:0 0 16px 16px;padding:16px;text-align:center;border-top:1px solid #f4f4f5;background:#fafafa;">
    <div style="font-size:11px;color:#d4d4d8;">GearDN Admin &middot; Automated notification</div>
  </div>

</div>
</div>
</body>
</html>`;
}
