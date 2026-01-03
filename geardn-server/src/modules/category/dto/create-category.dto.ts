import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  icon: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  priority: number;
}
