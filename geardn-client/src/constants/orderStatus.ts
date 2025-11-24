export enum OrderStatus {
    PENDING='PENDING',
    PROCESSING='PROCESSING',
    SHIPPED='SHIPPED',
    DELIVERED='DELIVERED',
    CANCELED='CANCELED',
  };

  export type UIOrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELED';
  
export const OrderStatusLabelMap: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Đang chờ',
  [OrderStatus.PROCESSING]: 'Đang xử lý',
  [OrderStatus.SHIPPED]: 'Đã gửi hàng',
  [OrderStatus.DELIVERED]: 'Đã giao hàng',
  [OrderStatus.CANCELED]: 'Đã hủy',
}