import { IUser } from "@/interfaces/IUser";
import { bff } from "@/lib/api-fetch";
import { BaseResponse } from "@/types/response.type";

export const whoami = async () => {
  return bff<BaseResponse<IUser>>('/api/bff/auth/whoami');
}