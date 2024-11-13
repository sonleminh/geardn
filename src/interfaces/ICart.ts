import { IModel } from "./IProduct";

export interface ICart {
    _id: string;
    user_id: string;
    items: ICartItem[]
}

export interface ICart {
    _id: string;
    user_id: string;
    items: ICartItem[]
}

export interface ICartPayload {
    model: string;
    quantity: number;
}

export interface ICartItem {
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