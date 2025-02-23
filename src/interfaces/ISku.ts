export interface IAttribute {
    id: string;
    type: string;
    value: string;
    createdAt: Date;
}

export interface ISku {
    id: number;
    productId: number;
    sku: string;
    price: number;
    quantity: number;
    imageUrl: string;
    productSkuAttributes: {
        id: number;
        attribute: IAttribute
    }[]
    createdAt: Date;
}
