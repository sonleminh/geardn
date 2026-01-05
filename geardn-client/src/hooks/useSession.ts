import { useQuery } from "@tanstack/react-query";
import { whoami } from "@/apis/session";
import { BaseResponse } from "@/types/response.type";
import { IUser } from "@/interfaces/IUser";
import { getCookie } from "cookies-next";

export function useSession() {
  const isLogged = getCookie("is_logged_in");
  return useQuery<BaseResponse<IUser>>({
    queryKey: ["whoami"],
    queryFn: whoami,
    retry: false,
    enabled: !!isLogged,
  });
}
