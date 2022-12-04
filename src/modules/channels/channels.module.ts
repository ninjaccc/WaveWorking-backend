import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Channel, ChannelSchema } from './channel.schema';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    // #TODO 待確認怎麼用，先放著
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    MongooseModule.forFeature([
      {
        name: Channel.name,
        schema: ChannelSchema,
      },
    ]),
  ],
  controllers: [ChannelsController],
  providers: [ChannelsService],
})
export class ChannelsModule {}
