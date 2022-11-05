import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.schema';

export type MusicDocument = Music & Document;

@Schema()
export class Music extends Document {
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
    required: true,
  })
  url: string;

  // image of music
  @Prop()
  @ApiProperty({
    example:
      'https://www.wyzowl.com/wp-content/uploads/2019/09/YouTube-thumbnail-size-guide-best-practices-top-examples.png',
    format: 'string',
  })
  thumbnail: string;

  // likes
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  likes: User[];

  // createdAt
  @Prop()
  @ApiProperty({
    example: '2022-09-22T12:40:56.757',
    format: 'string',
    required: true,
  })
  createdAt: Date;
}

export const MusicSchema = SchemaFactory.createForClass(Music);
