export interface ILocationOption {
    id: number;
    code: number;
    name: string;
}

export interface ILocation {
    code: number;
    name: string;
    wards:  ILocationOption[];
}