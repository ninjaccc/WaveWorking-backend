import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  // name
  @ApiProperty({
    example: 'pejman hadavi',
    format: 'string',
    minLength: 2,
    maxLength: 18,
    required: true,
  })
  name: string;

  // email
  @ApiProperty({
    example: 'test@gmail.com',
    format: 'string',
    required: true,
  })
  email: string;

  // password
  @ApiProperty({
    example: 'password',
    format: 'string',
    minLength: 6,
    maxLength: 20,
    required: true,
  })
  password: string;

  // gender
  @ApiProperty({
    example: 0,
    description: 'gender number. 0 is women, 1 is man',
    format: 'number',
    required: true,
  })
  gender: number;
}
