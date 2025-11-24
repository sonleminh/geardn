export interface IProvince {
    name: string;
    code: number;
    division_type: string;
    codename: string;
    phone_code: number;
    districts: IDistrict[];
}

export interface IDistrict {
    name: string;
    code: number;
    division_type: string;
    codename: string;
    province_code: number;
    wards: IWard[];
}

export interface IWard {
    name: string;
    code: number;
    division_type: string;
    codename: string;
    district_code: number;
}