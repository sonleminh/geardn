import { ILocation, ILocationOption } from "@/interfaces/ILocation";
import { getBackendBaseUrl } from "@/lib/backend-config";
import { BaseResponse } from "@/types/response.type";

const BE = getBackendBaseUrl();
export async function getProvinces() {
  const res = await fetch(`${BE}/province`);
  if (res.status === 404) return null;

  if (!res.ok) {
    console.error(`Error fetching province list`, res.status, await res.text());
    throw new Error(`Failed to fetch province list: ${res.status}`);
  }
  return res.json() as Promise<ILocationOption[]>;
}

export async function getProvince(provinceCode: string | number) {
  const res = await fetch(`${BE}/province/${provinceCode}`, {
    cache: "force-cache",
  });
  if (res.status === 404) return null;

  if (!res.ok) {
    console.error(`Error fetching province`, res.status, await res.text());
    throw new Error(`Failed to fetch province: ${res.status}`);
  }
  return res.json() as Promise<BaseResponse<ILocation>>;
}
