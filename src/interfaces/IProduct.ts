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

export interface IVariant {
    name: string;
    options: string[];
    image?: string[];
}

export interface IProduct {
    _id: string;
    name: string;
    // discount?: IDiscount;
    category: ICategory;
    original_price: number;
    tags: ITagOptions[];
    images: string[];
    // sku_name: string;
    tier_variations: IVariant[];
    brand: string;
    details: IDetails;
    description: string;
    createdAt: string;
}