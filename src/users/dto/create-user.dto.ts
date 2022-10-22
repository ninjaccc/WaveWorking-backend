import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  // name
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(18)
  @ApiProperty({
    example: 'pejman hadavi',
    format: 'string',
    minLength: 2,
    maxLength: 18,
    required: true,
  })
  name: string;

  // email
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'test@gmail.com',
    format: 'string',
    required: true,
  })
  email: string;

  // password
  @IsNotEmpty()
  @ApiProperty({
    example: 'password',
    format: 'string',
    minLength: 6,
    maxLength: 20,
    required: true,
  })
  password: string;

  // gender
  @IsNotEmpty()
  @ApiProperty({
    example: 0,
    description: 'gender number. 0 is women, 1 is man',
    format: 'number',
    required: true,
  })
  gender: number;
}
