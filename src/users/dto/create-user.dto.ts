import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  MinLength,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

 @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
    maxLength: 100,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsEmail()
 
  email: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;


   @ApiProperty({
    description: 'password of the user',
    example: 'Abc@1234',
    maxLength: 15,
    minLength: 6, 
  })

  @IsString()
  @MinLength(6)
  
  password: string;
}
