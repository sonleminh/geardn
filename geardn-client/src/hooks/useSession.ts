import { useQuery } from '@tanstack/react-query';
import { whoami } from '@/apis/session';
import { BaseResponse } from '@/types/response.type';
import { IUser } from '@/interfaces/IUser';

export function useSession() {
  return useQuery<BaseResponse<IUser>>({ queryKey: ['whoami'], queryFn: whoami, retry: false });
}
