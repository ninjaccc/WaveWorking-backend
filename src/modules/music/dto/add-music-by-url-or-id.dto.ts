import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class AddMusicByUrlOrIdDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'https://youtu.be/Dnz-BTz9eDU',
    format: 'string',
  })
  url: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Dnz-BTz9eDU',
    format: 'string',
  })
  id: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '2022-09-22T12:40:56.757',
    format: 'string',
    required: true,
  })
  onTime: string;
}
