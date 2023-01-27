import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.schema';
import { Music } from '../music/music.schema';

export type LikeDocument = HydratedDocument<Like>;

@Schema()
export class Like {
  // music origin id(from youtube or others side)
  @Prop({ type: Types.ObjectId, ref: 'Music' })
  @ApiProperty({
    example: '637b38f08e32266d5b5202fa',
    format: 'string',
    required: true,
  })
  music: Music;

  // which channel is the music added
  @Prop()
  @ApiProperty({
    example: '637b38f08e32266d5b5202fa',
    format: 'string',
    required: true,
  })
  channelId: string;

  // for those who like this music
  @Prop([{ type: Types.ObjectId }])
  @ApiProperty({
    example: '637b38f08e32266d5b5202fa',
    format: 'string',
    isArray: true,
  })
  users: User[];
}

export const LikeSchema = SchemaFactory.createForClass(Like);
