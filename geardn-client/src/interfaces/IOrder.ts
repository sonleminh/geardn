import { OrderStatus, UIOrderStatus } from "@/constants/orderStatus";
import { IProduct } from "./IProduct";

export interface ICartPayload {
    model: string;
    quantity: number;
}

export interface IOrderItem {
    imageUrl: string;
    productId: number;
    productName: string;
    productSlug: string;
    quantity: number;
    sellingPrice: number;   
    skuAttributes: {attribute: string; value: string}[];
    skuCode: string;
    skuId: number;     
    product: IProduct;
}

export interface IOrder {
    id: number;
    userId: number;
    orderCode: string;
    totalPrice: number;
    status: OrderStatus;
    uiStatus: UIOrderStatus;
    fullName: string;
    phoneNumber: string;
    email?: string;
    note?: string,
    shipment: {
        method: number;
        address: string;
        deliveryDate: Date;
    };
    paymentMethod: {
        id: number,
        key: string,
        name: string,
        image: string,
    },
    flag: {
        isOnlineOrder: boolean,
    },
    orderItems: IOrderItem[],
    createdAt: Date;
}

export interface ICreateOrderPayload {
    userId?: string | null;
    fullName: string;
    phoneNumber: string;
    email: string;
    totalPrice: number;
    note: string;
    shipment: {
        method: number;
        address: string;
        deliveryDate: Date
    },
    flag: {
        isOnlineOrder: boolean;
    },
    paymentMethodId: number;
    orderItems:  {
        skuId: number;
        quantity: number
    }[]
  }
