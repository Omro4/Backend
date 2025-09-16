import { IsNumber, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateProductImageDto {
  @IsNumber()
  productId: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;

  @IsString()
  @IsOptional()
  altText?: string;
}
