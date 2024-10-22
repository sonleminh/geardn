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
        product_name: string;
        price: number;
    };
    quantity: number;
}