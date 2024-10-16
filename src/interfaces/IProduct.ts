export interface ITagOptions {
    value: string;
    label: string;
}

export interface IDiscount {
    discountPrice: number;
    startDate: Date;
    endDate: Date;
}

export interface IProduct {
    _id: string;
    name: string;
    category_id: string;
    images: string[];
    tags: ITagOptions[];
    original_price: number;
    attributes: string[];
    discount: IDiscount;
    content: string;
    createdAt: string;
}