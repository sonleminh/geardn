import { IModel } from "./IProduct";

export interface ICartPayload {
    model: string;
    quantity: number;
}

export interface IOrderItem {
    model_id: string;
    name: string;
    image: string;
    price: number;
    extinfo: {
        tier_index: number[];
        is_pre_order: boolean;
    };
    product_id: string;
    product_name: string;
    quantity: number;
}

export interface IOrder {
    _id: string;
    user_id: string;
    customer: {
        name: string;
        phone: string;
        mail?: string;
    }
    items: IOrderItem[]
    address: {
        street: string;
        city: string;
        state: string;
        country: string;
    };
    shipment?: {
        method: number;
        delivery_date: Date;
        address: string;
    };
    payment: {
        _id: string,
        key: string,
        name: string,
        image: string,
    },
    flag: {
        is_online_order: boolean,
    },
    note?: string,
    total_amount: number;
    status: string;
}

export interface ICreateOrder {
    customer: {
        name: string;
        phone: string;
        mail?: string;
    }
    items: IOrderItem[]
    address?: {
        city: string;
        district: string;
        ward: string;
        specific_address: string;
    };
    shipment?: {
        method: number;
        delivery_date: Date;
        address: string;
    };
    payment: string,
    flag: {
        is_online_order: boolean,
    },
    note?: string,
    user_id: string | null;
}
