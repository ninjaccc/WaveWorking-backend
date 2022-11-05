import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddMusicUrlDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'https://youtu.be/Dnz-BTz9eDU',
    format: 'string',
    required: true,
  })
  url: string;
}
