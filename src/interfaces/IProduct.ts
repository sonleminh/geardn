import { ICategory } from "./ICategory";

export interface ITagOptions {
    value: string;
    label: string;
}

export interface IDiscount {
    discountPrice: number;
    startDate: Date;
    endDate: Date;
}

interface IDetails {
    guarantee?: number | string;
    weight?: string;
    material?: string;
}

export interface IProduct {
    _id: string;
    name: string;
    // discount?: IDiscount;
    category: ICategory;
    original_price: number;
    tags: ITagOptions[];
    images: string[];
    attributes: string[];
    sku_name: string;
    brand: string;
    details: IDetails;
    description: string;
    createdAt: string;
}