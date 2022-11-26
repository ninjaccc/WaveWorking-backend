import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class JoinChannelAsDjDto {
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

  // channel id
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The id of the channel',
    format: 'string',
  })
  channelId: string;
}
