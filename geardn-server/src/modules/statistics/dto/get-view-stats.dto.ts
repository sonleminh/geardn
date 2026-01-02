import { IsDateString, IsOptional } from 'class-validator';

export class GetViewStatsDto {
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
