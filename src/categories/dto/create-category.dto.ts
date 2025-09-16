import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  productId?: number;
}
