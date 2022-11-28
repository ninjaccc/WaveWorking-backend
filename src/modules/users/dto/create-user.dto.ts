import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Role } from 'src/constants/role.constant';

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

  // roleId
  @IsOptional()
  @ApiProperty({
    example: Role.Guest,
    format: 'number',
  })
  roleId?: Role;

  // gender
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 0,
    description: 'gender number. 0 is women, 1 is man',
    format: 'number',
    required: true,
  })
  gender: number;
}
