import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional } from 'class-validator';

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
  image?: string;
}
