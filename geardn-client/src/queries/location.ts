// src/queries/location.ts
import { useQuery } from "@tanstack/react-query";
import { ILocation, ILocationOption } from "@/interfaces/ILocation";
import { BaseResponse } from "@/types/response.type";
import { getProvince, getProvinces } from "@/services/location";

export const useProvinces = () =>
  useQuery<ILocationOption[] | null>({
    queryKey: ["prov"],
    queryFn: getProvinces,
    staleTime: 86_400_000, // 24h
  });

export const useProvince = (districtCode?: number) =>
  useQuery<BaseResponse<ILocation> | null>({
    queryKey: ["ward", districtCode ?? null],
    queryFn: () => getProvince(districtCode!),
    enabled: !!districtCode,
    staleTime: 86_400_000,
  });
