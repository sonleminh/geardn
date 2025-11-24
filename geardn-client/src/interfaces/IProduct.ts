import { ICategory } from "./ICategory";
import { IProductSku } from "./IProductSku";

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
    images?: string[];
}

export interface IModel {
    id: string;
    name: string;
    price: number;
    stock: number;
    extinfo: {
        tier_index: number[];
        is_pre_order: boolean;
    };
}

export interface IProduct {
    id: number;
    name: string;
    categoryId: number;
    category: ICategory;
    tags: ITagOptions[];
    images: string[];
    brand: string;
    details: IDetails;
    description: string;
    slug: string;
    skus: IProductSku[]
    priceMin: number;
    priceMax: number;
    createdAt: string;
}