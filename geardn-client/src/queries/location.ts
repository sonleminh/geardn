// src/queries/location.ts
import { useQuery } from '@tanstack/react-query';
import { getProvince, getProvinces } from '@/apis/location';
import { ILocation, ILocationOption } from '@/interfaces/ILocation';
import { BaseResponse } from '@/types/response.type';

export const useProvinces = () =>
  useQuery<ILocationOption[]>({
    queryKey: ['prov'],
    queryFn: getProvinces,
    staleTime: 86_400_000, // 24h
  });

export const useProvince = (districtCode?: number) =>
  useQuery<BaseResponse<ILocation>>({
    queryKey: ['ward', districtCode ?? null],
    queryFn: () => getProvince(districtCode!),
    enabled: !!districtCode,
    staleTime: 86_400_000,
  });
