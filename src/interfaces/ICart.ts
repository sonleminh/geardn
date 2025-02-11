import { IModel } from "./IProduct";

export interface ICart {
    id: string;
    userid: string;
    items: ICartItem[]
}

export interface ICart {
    id: string;
    userid: string;
    items: ICartItem[]
}

export interface ICartPayload {
    userid: string | null;
    model: string;
    quantity: number;
}

export interface ICartItem {
    // model: {
    //     id: string;
    //     name: string;
    //     image: string;
    //     price: number;
    //     extinfo: {
    //         tier_index: number[];
    //         is_pre_order: boolean;
    //     };
    //     productid: string;
    //     product_name: string;
    // };
    modelid: string;
    name: string;
    image: string;
    price: number;
    extinfo: {
        tier_index: number[];
        is_pre_order: boolean;
    };
    productid: string;
    product_name: string;
    quantity: number;
}