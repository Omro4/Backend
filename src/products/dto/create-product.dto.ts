import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
      description: 'Name of the product',
      example: 'Electronics',
      maxLength: 100,
    })
  @IsString()
  name: string;

  @IsString()
  description: string;
 
  @ApiProperty({
    description: 'price of the product',
    example: '100',
    maxLength: 10,
    minLength: 1,
  })
  @IsNumber()
  @Min(0)
  price: number;


  @ApiProperty({
    description: 'number of the stock of the product',
    example: '50',
    maximum: 1000,
    minimum: 1,
  })
  
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
