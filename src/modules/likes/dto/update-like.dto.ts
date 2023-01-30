import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateLikeDto {
  @IsNotEmpty()
  @IsBoolean()
  like: boolean;

  @IsNotEmpty()
  @IsString()
  channelId: string;

  @IsNotEmpty()
  @IsString()
  musicId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
