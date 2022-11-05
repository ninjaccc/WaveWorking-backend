import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ChannelDocument = Channel & Document;

@Schema()
export class Channel extends Document {
  // name
  @Prop()
  @ApiProperty({
    example: 'MusicBarLaLa',
    format: 'string',
    minLength: 2,
    maxLength: 18,
    required: true,
  })
  name: string;

  // createdAt
  @Prop()
  @ApiProperty({
    example: '2022-09-22T12:40:56.757',
    format: 'string',
    required: true,
  })
  createdAt: Date;

  // image of channel
  @Prop()
  @ApiProperty({
    example:
      'https://www.wyzowl.com/wp-content/uploads/2019/09/YouTube-thumbnail-size-guide-best-practices-top-examples.png',
    format: 'string',
  })
  thumbnail: string;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
