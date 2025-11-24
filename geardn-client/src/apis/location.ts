import { ILocation, ILocationOption } from "@/interfaces/ILocation";
import { BaseResponse } from "@/types/response.type";

export const getProvinces = async () =>
    (await fetch('/api/bff/province', { cache: 'no-store' })).json() as Promise<ILocationOption[]>;
  
  export const getProvince = async (provinceCode: string | number) =>
    (await fetch(`/api/bff/province/${provinceCode}`, { cache: 'force-cache' })).json() as Promise<BaseResponse<ILocation>>;