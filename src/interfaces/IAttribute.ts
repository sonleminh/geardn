export interface IAttribute {
    id: string;
    type: string;
    value: string;
    createdAt: Date;
}

export interface ISku {
    id: string;
    productid: string;
    product_name: string;
    product_sku: string;
    attributes: IAttribute[];
    sku: string;
    price: number;
    quantity: number;
    status: string;
    createdAt: Date;
}
