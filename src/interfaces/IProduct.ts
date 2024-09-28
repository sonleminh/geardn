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
    price: number;
    discount: IDiscount;
    category_id: string;
    tags: ITagOptions[];
    content: string;
    images: string[];
    createdAt: string;
}