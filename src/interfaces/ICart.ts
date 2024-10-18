export interface ICart {
    user_id: string;
    items: ICartItem[]
}

export interface ICartPayload {
    sku: string;
    quantity: number;
}

export interface ICartItem {
    sku: {
        product_name: string;
        price: number;
    };
    quantity: number;
}