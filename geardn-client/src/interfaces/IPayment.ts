export interface IPaymentMethod {
    id: string;
    key: string;
    name: string;
    image: string;
    isDisabled: string;
    createdAt: Date;
}

export interface IPaymentMethodListRespone {
    success: boolean;
    message: string;
    data:  IPaymentMethod[];
    total: number;
}