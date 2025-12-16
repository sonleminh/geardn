export interface IAttributeValue {
    value: string;
    attribute: IAttribute;
}

export interface IAttribute {
    id: number;
    name: string;
    label: string;
    createdAt: Date;
}

export interface IProductSkuAttributes {
    id: number;
    attributeValue: IAttributeValue
}

export interface IProductSku {
    id: number;
    productId: number;
    sku: string;
    sellingPrice: number;
    imageUrl: string;
    productSkuAttributes: IProductSkuAttributes[]
    createdAt: Date;
    stocks: {
        id: number;
        quantity: number;
    }[];
}
