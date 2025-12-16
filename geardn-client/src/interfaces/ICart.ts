import { IProductSku } from "./IProductSku";

export interface ICartPayload {
    userid: string | null;
    model: string;
    quantity: number;
}

export interface ICartStoreItem {
    productId: number;
    skuId: number;
    productName: string;
    imageUrl: string;
    sellingPrice: number;
    quantity: number;
    attributes: {
        attribute: string;
        attributeValue: string;
    }[]
    cartItemId?: number;
}

export interface ICartServerItem {
    id: number;
    productId: number;
    product: {
        name: string;
        images: string[];
    };
    sku: IProductSku;
    quantity: number;
}

export interface ICartStockItem {
        id: number;
        quantity: number;
}

export interface ISyncCartPayload {
    items: {
        productId: number;
        skuId: number;
        quantity: number;
    }[]
}

export interface ICartResponse {
    id: number;
    userId: number;
    items: ICartServerItem[];
    user: {
        id: number;
        name: string;
        email: string;
    }
}

export interface IAddCartItemPayload {
    productId: number;
    skuId: number;
    quantity: number;
}

export interface IUpdateQuantityPayload {
    id: number;
    quantity: number;
}

export interface IUpdateQuantityResponse {
    data: {
        id: number;
        userId: number;
        items: {
            id: number;
            productId: number;
            skuId: number;
            quantity: number;
        }[]};
    total: number;
}