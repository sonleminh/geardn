import { Type, Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

const SORT_BY = ['createdAt', 'price', 'sold'] as const;
type SortBy = (typeof SORT_BY)[number];

export class BaseQueryDto {
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  @Transform(({ obj, value }) => obj.order ?? value ?? 'desc')
  order: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @Transform(({ obj, value }) => obj.sortBy ?? value ?? 'createdAt')
  sortBy?: SortBy;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Transform(({ value }) => {
    const n = Number(value);
    return Number.isNaN(n) ? 1 : n;
  })
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 12;
}
