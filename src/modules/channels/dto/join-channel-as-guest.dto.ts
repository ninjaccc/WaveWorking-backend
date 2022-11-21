import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class JoinChannelAsGuestDto {
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

  // channel id
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The id of the channel',
    format: 'string',
  })
  channelId: string;

  // channel password
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The password of the channel',
    format: 'string',
  })
  channelPassword: string;
}
