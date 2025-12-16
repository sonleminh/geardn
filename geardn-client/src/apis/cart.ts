import { IAddCartItemPayload, ICartResponse, ICartStockItem, ISyncCartPayload, IUpdateQuantityPayload, IUpdateQuantityResponse } from "@/interfaces/ICart";
import { BaseResponse } from "@/types/response.type";
import { bff } from "@/lib/api-fetch";

export const getCart = () => bff<BaseResponse<ICartResponse>>('/api/bff/carts');

export const getCartStock = (skuIds: number[]) =>
  bff<BaseResponse<ICartStockItem[]>>(`/api/bff/carts/stocks?skuIds=${skuIds.join(',')}`);

export const syncCart = (payload: ISyncCartPayload) =>
  bff<BaseResponse<ICartResponse>>(`/api/bff/carts/sync`, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(payload) });

export const addCartItem = (payload: IAddCartItemPayload) =>
  bff<BaseResponse<{message: string}>>(`/api/bff/carts/items`, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(payload) });

export const updateQty = (payload: IUpdateQuantityPayload) =>
  bff<BaseResponse<IUpdateQuantityResponse>>(`/api/bff/carts/items/${payload.id}`, { method:'PATCH', headers:{'content-type':'application/json'}, body: JSON.stringify(payload) });

export const deleteCartItem = (id: number) =>
  bff<BaseResponse<IUpdateQuantityResponse>>(`/api/bff/carts/items/${id}`, { method:'DELETE', headers:{'content-type':'application/json'} });