import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class AddChannelDto {
  // name
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(18)
  @ApiProperty({
    example: 'MusicBarLaLa',
    format: 'string',
    minLength: 2,
    maxLength: 18,
    required: true,
  })
  name: string;

  // image
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'https://cdn-icons-png.flaticon.com/128/4185/4185501.png',
    description: 'The image of the channel',
    format: 'string',
  })
  thumbnail?: string;

  // password
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'GsHEVHyQ8pQalnww8fg.V2yxiC',
    description: 'The password of the channel',
    format: 'string',
  })
  password?: string;

  // the channel manager id
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '637b8929b8cb2d3eff5273e0',
    format: 'string',
    required: true,
  })
  managerId: string;
}
