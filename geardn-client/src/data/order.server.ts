import { IOrder } from "@/interfaces/IOrder";
import { getBackendBaseUrl } from "@/lib/backend-config";
import { BaseResponse } from "@/types/response.type";

const BE = getBackendBaseUrl();

export async function getOrderConfirm(code: string) {
  const res = await fetch(`${BE}/orders/${encodeURIComponent(code)}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (res.status === 404) return null;

  if (!res.ok) {
    console.error(
      `Error fetching order confirmation`,
      res.status,
      await res.text()
    );
    throw new Error(`Failed to fetch order confirmation: ${res.status}`);
  }
  return res.json() as Promise<BaseResponse<IOrder>>;
}
