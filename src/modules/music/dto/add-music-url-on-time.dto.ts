import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AddMusicUrlDto } from './add-music-url.dto';

export class AddMusicUrlOnTimeDto extends AddMusicUrlDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '2022-09-22T12:40:56.757',
    format: 'string',
    required: true,
  })
  time: string;
}
