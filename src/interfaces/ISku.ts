export interface IAttribute {
    _id: string;
    name: string;
    value: string;
    atb_sku: string;
    createdAt: Date;
}

export interface ISku {
    _id: string;
    product_id: string;
    product_name: string;
    product_sku: string;
    attributes: IAttribute[];
    sku: string;
    price: number;
    quantity: number;
    status: string;
    createdAt: Date;
}
