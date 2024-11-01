import { IModel } from "./IProduct";

export interface ICartPayload {
    model: string;
    quantity: number;
}

export interface IOrderItem {
    // model: {
    //     _id: string;
    //     name: string;
    //     image: string;
    //     price: number;
    //     extinfo: {
    //         tier_index: number[];
    //         is_pre_order: boolean;
    //     };
    //     product_id: string;
    //     product_name: string;
    // };
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
    user_id: string;
    name: string;
    phone: string;
    email: string;
    items: IOrderItem[]
    totalAmount: number;
    status: string;
    address: {
        street: string;
        city: string;
        state: string;
        country: string;
    };
}

export interface ICreateOrder {
    name: string;
    phone: string;
    email: string;
    items: IOrderItem[]
    totalAmount: number;
    address: {
        street: string;
        city: string;
        state: string;
        country: string;
    };
    receiveOption: string;
    note: string;
    payment_method: string;
}