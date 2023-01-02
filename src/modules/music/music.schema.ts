import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.schema';

export type MusicDocument = HydratedDocument<Music>;

@Schema()
export class Music {
  // music origin id(from youtube or others side)
  @Prop()
  @ApiProperty({
    example: '0IA3ZvCkRkQ',
    format: 'string',
    required: true,
  })
  musicId: string;

  // music name
  @Prop()
  @ApiProperty({
    example: 'I Really Want to Stay At Your House',
    format: 'string',
    minLength: 1,
    required: true,
  })
  name: string;

  // author
  @Prop()
  @ApiProperty({
    example: 'Rosa Walton',
    format: 'string',
    minLength: 1,
    required: true,
  })
  author: string;

  // source url
  @Prop()
  @ApiProperty({
    example: 'https://youtu.be/Dnz-BTz9eDU',
    format: 'string',
  })
  url?: string;

  // image of music
  @Prop()
  @ApiProperty({
    example:
      'https://www.wyzowl.com/wp-content/uploads/2019/09/YouTube-thumbnail-size-guide-best-practices-top-examples.png',
    format: 'string',
  })
  thumbnail: string;

  // likes
  @Prop({ type: Map, of: String })
  likes: Record<string, string>;

  // createdAt
  @Prop()
  @ApiProperty({
    example: '2022-09-22T12:40:56.757',
    format: 'string',
    required: true,
  })
  createdAt: Date;

  // duration
  @Prop()
  @ApiProperty({
    example: 'PT3M14S',
    format: 'string',
    required: true,
  })
  duration: string;

  // which channel is the music added
  @Prop()
  @ApiProperty({
    example: '637b38f08e32266d5b5202fa',
    format: 'string',
    required: true,
  })
  channelId: string;

  // Who added this music
  @Prop()
  @ApiProperty({
    example: '637c85907f2cb79eb4608ea3',
    format: 'string',
    required: true,
  })
  userId: string;

  // on time
  @Prop()
  @ApiProperty({
    example: '2022-09-22T12:40:56.757',
    format: 'string',
  })
  onTime: Date;

  // 可以再被重新添加至當前撥放清單的時間
  @Prop()
  @ApiProperty({
    example: '2022-09-22T12:40:56.757',
    format: 'string',
  })
  canBeReAddedTime: Date;
}

export const MusicSchema = SchemaFactory.createForClass(Music);
