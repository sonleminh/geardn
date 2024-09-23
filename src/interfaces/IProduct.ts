export interface ITagOptions {
    value: string;
    label: string;
}

export interface IProduct {
    _id: string;
    name: string;
    category_id: string;
    tags: ITagOptions[];
    content: string;
    thumbnail_image: string;
    createdAt: string;
}