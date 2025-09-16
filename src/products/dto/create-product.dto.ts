import {
  IsString,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  categoryId: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  imageId: number;
}
