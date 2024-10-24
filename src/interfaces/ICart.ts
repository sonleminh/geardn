import { IModel } from "./IProduct";

export interface ICart {
    user_id: string;
    items: ICartItem[]
}

export interface ICartPayload {
    model: string;
    quantity: number;
}

export interface ICartItem {
    model: {
        _id: string;
        name: string;
        image: string;
        price: number;
        extinfo: {
            tier_index: number[];
            is_pre_order: boolean;
        };
        product_id: string;
        product_name: string;
    };
    quantity: number;
}

export interface ICartResponse {
    _id: string;
    user_id: string;
    items: IModel[]
}