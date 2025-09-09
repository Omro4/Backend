import { IsString, MinLength } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @MinLength(3)
  name: string;
}
